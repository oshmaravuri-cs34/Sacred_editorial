import notifee, { AndroidImportance, TriggerType, RepeatFrequency, AndroidAction, EventType } from '@notifee/react-native';
import TrackPlayer, { Capability, AppKilledPlaybackBehavior } from 'react-native-track-player';
import { getSlokaOfTheDay } from '../utils/gitaUtils';

export const NOTIFICATION_CHANNEL_ID = 'sloka_reminder';

export const initializeNotifications = async () => {
    // Create notification channel
    await notifee.createChannel({
        id: NOTIFICATION_CHANNEL_ID,
        name: 'Daily Sloka Reminder',
        importance: AndroidImportance.HIGH,
    });

    // Request permissions for Android 13+
    await notifee.requestPermission();
};

export const scheduleDailySlokaNotification = async (hour: number = 8, minute: number = 0) => {
    const sloka = getSlokaOfTheDay();

    const date = new Date();
    date.setHours(hour, minute, 0, 0);

    // If time has passed, set for tomorrow
    if (date.getTime() <= Date.now()) {
        date.setDate(date.getDate() + 1);
    }

    // Create a trigger notification
    await notifee.createTriggerNotification(
        {
            title: `Reminder: Time for Bhagavad Gita`,
            body: `Listen to Chapter ${sloka.chapter.chapterNumber} Sloka ${sloka.verse.verseNumber}: ${sloka.chapter.name}`,
            android: {
                channelId: NOTIFICATION_CHANNEL_ID,
                actions: [
                    {
                        title: 'Play Now',
                        pressAction: { id: 'play_sloka' },
                    },
                    {
                        title: 'Not Now',
                        pressAction: { id: 'dismiss' },
                    },
                ],
                pressAction: { id: 'default' },
            },
        },
        {
            type: TriggerType.TIMESTAMP,
            timestamp: date.getTime(),
            repeatFrequency: RepeatFrequency.DAILY,
        }
    );
};

export const setupTrackPlayer = async () => {
    try {
        await TrackPlayer.setupPlayer();
        await TrackPlayer.updateOptions({
            android: {
              appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
            },
            capabilities: [
                Capability.Play,
                Capability.Pause,
                Capability.Stop,
            ],
            compactCapabilities: [Capability.Play, Capability.Pause],
        });
    } catch (e) {
        console.log('Player already initialized or error', e);
    }
};

export const startSlokaPlayback = async () => {
    const sloka = getSlokaOfTheDay();
    
    // Sample Audio URL - Replace with actual content
    const audioUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

    await TrackPlayer.reset();
    await TrackPlayer.add({
        id: `sloka-${sloka.chapter.id}-${sloka.verse.verseNumber}`,
        url: audioUrl,
        title: `Chapter ${sloka.chapter.chapterNumber} Sloka ${sloka.verse.verseNumber}`,
        artist: 'Bhagavad Gita',
        artwork: 'https://placeholder.com/artwork.jpg', // Placeholder
    });
    await TrackPlayer.play();
};

// Handle notification events
notifee.onBackgroundEvent(async ({ type, detail }) => {
    if (type === EventType.ACTION_PRESS && detail.pressAction?.id === 'play_sloka') {
        await setupTrackPlayer();
        await startSlokaPlayback();
    }
});

notifee.onForegroundEvent(async ({ type, detail }) => {
    if (type === EventType.ACTION_PRESS && detail.pressAction?.id === 'play_sloka') {
        await setupTrackPlayer();
        await startSlokaPlayback();
    }
});
