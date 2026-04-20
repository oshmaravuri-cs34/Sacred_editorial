import notifee, { AndroidImportance, TriggerType, RepeatFrequency, AndroidAction, EventType } from '@notifee/react-native';
import TrackPlayer, { Capability, AppKilledPlaybackBehavior, Event } from 'react-native-track-player';
import { getSlokaOfTheDay } from '../utils/gitaUtils';
import { gitaChapters } from '../data/gitaData';
import { API_BASE_URL } from '../config/api';
import { getSloka } from './apiClient';

export const NOTIFICATION_CHANNEL_ID = 'sloka_reminder';

let isPlayerInitialized = false;

// Simple global subscriber for notification events
type NotificationListener = (sloka: { chapterId: number, verseNumber: number }) => void;
let listener: NotificationListener | null = null;
export const setNotificationListener = (l: NotificationListener | null) => { listener = l; };

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

export const scheduleDailySlokaNotification = async (hour: number = 8, minute: number = 0, period: 'AM' | 'PM' = 'AM') => {
    // Cancel all previous triggers to avoid duplicates
    await notifee.cancelAllNotifications();

    const sloka = getSlokaOfTheDay();

    // Convert to 24h format
    let scheduledHour = hour;
    if (period === 'PM' && hour < 12) scheduledHour += 12;
    if (period === 'AM' && hour === 12) scheduledHour = 0;

    const date = new Date();
    date.setHours(scheduledHour, minute, 0, 0);

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
                        pressAction: { id: 'play_sloka', launchActivity: 'default' },
                    },
                    {
                        title: 'Not Now',
                        pressAction: { id: 'dismiss' },
                    },
                ],
                pressAction: { id: 'default', launchActivity: 'default' },
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
    if (isPlayerInitialized) return;
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
        isPlayerInitialized = true;
    } catch (e) {
        console.log('Player already initialized or error', e);
        isPlayerInitialized = true;
    }
};

export const startSlokaPlayback = async (chapterId?: number, verseNumber?: number, notifyListener: boolean = true) => {
    let sloka;
    if (chapterId && verseNumber) {
        const chapter = gitaChapters.find(c => c.id === chapterId);
        const verse = chapter?.verses.find(v => v.verseNumber === verseNumber);
        if (chapter && verse) {
            sloka = { chapter, verse };
        }
    }

    if (!sloka) {
        sloka = getSlokaOfTheDay();
    }

    // Only notify listener for notification-triggered playback, not in-app button presses
    if (notifyListener && listener) {
        listener({ chapterId: sloka.chapter.id, verseNumber: sloka.verse.verseNumber });
    }

    // Make real backend call to retrieve dynamic MP3 URL
    let finalAudioUrl = '';
    try {
        const response = await getSloka(sloka.chapter.id, sloka.verse.verseNumber);
        finalAudioUrl = response.audio;
        console.log('Audio URL from backend:', finalAudioUrl);
    } catch (e) {
        console.error("Failed to fetch audio url from backend, falling back to local construct", e);
        finalAudioUrl = `${API_BASE_URL}/audio/${sloka.chapter.id}_${sloka.verse.verseNumber}.mp3`;
        console.log('Fallback audio URL:', finalAudioUrl);
    }

    // Reset and load the track — let errors propagate up
    await TrackPlayer.reset();
    await TrackPlayer.add({
        id: `sloka-${sloka.chapter.id}-${sloka.verse.verseNumber}`,
        url: finalAudioUrl,
        title: `Chapter ${sloka.chapter.chapterNumber} Sloka ${sloka.verse.verseNumber}`,
        artist: 'Bhagavad Gita'
    });
    await TrackPlayer.play();
    console.log('TrackPlayer.play() called successfully for:', finalAudioUrl);
};

// Handle notification events
notifee.onBackgroundEvent(async ({ type, detail }) => {
    if (type === EventType.ACTION_PRESS && detail.pressAction?.id === 'play_sloka') {
        await setupTrackPlayer();
        await startSlokaPlayback();
    }
});

// Foreground handling for both button and general press
notifee.onForegroundEvent(async ({ type, detail }) => {
    if (type === EventType.PRESS || (type === EventType.ACTION_PRESS && detail.pressAction?.id === 'play_sloka')) {
        await setupTrackPlayer();
        await startSlokaPlayback();
    }
});

TrackPlayer.addEventListener(Event.PlaybackError, (error: any) => {
    console.error('Playback Error captured through event listener:', error);
    import('react-native').then(({ Alert }) => {
        Alert.alert("Playback Error", `Failed to play audio: ${error.message || JSON.stringify(error)}`);
    });
});


