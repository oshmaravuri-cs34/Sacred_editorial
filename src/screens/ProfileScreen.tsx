import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity, Switch, Platform, Modal, TextInput, KeyboardAvoidingView, FlatList } from 'react-native';
import { Menu, Settings, Edit2, Globe, Moon, Type, Bell, DownloadCloud, ChevronRight, Edit3, Trash2, X, Check, Camera, Image as ImageIcon, ChevronUp, ChevronDown, Clock, Eye } from 'lucide-react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useTheme, LanguageCode } from '../context/ThemeContext';
import { translations } from '../data/translations';

const LANG_OPTIONS: { id: LanguageCode; name: string; native: string }[] = [
  { id: 'en', name: 'English', native: 'English' },
  { id: 'hi', name: 'Hindi', native: 'हिंदी' },
  { id: 'te', name: 'Telugu', native: 'తెలుగు' },
  { id: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { id: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { id: 'mr', name: 'Marathi', native: 'मराठी' },
  { id: 'bn', name: 'Bengali', native: 'বাংলা' },
  { id: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { id: 'ml', name: 'Malayalam', native: 'മലയാളം' },
];

const ProfileScreen = () => {
  const { isDarkMode, toggleDarkMode, fontSizeMultiplier, setFontSizeMultiplier, language, setLanguage, memorizedVerses, notificationTime, setNotificationTime } = useTheme();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isPickerModalVisible, setIsPickerModalVisible] = useState(false);
  const [isFontModalVisible, setIsFontModalVisible] = useState(false);
  const [isLangModalVisible, setIsLangModalVisible] = useState(false);
  const [tempFontSize, setTempFontSize] = useState(fontSizeMultiplier);
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);
  // Profile state
  const [name, setName] = useState('Arjun Sharma');
  const [email, setEmail] = useState('arjun.seeker@example.com');
  const [isTimeModalVisible, setIsTimeModalVisible] = useState(false);
  const [tempTime, setTempTime] = useState<{ h: number, m: number, p: 'AM' | 'PM' }>({ h: 7, m: 0, p: 'AM' });
  
  // Temporary state for editing before save
  const [editName, setEditName] = useState(name);
  const [editEmail, setEditEmail] = useState(email);

  const incHour = () => setTempTime(prev => ({...prev, h: prev.h === 12 ? 1 : prev.h + 1}));
  const decHour = () => setTempTime(prev => ({...prev, h: prev.h === 1 ? 12 : prev.h - 1}));
  const incMin = () => setTempTime(prev => ({...prev, m: prev.m === 55 ? 0 : prev.m + 5}));
  const decMin = () => setTempTime(prev => ({...prev, m: prev.m === 0 ? 55 : prev.m - 5}));
  const togglePeriod = () => setTempTime(prev => ({...prev, p: prev.p === 'AM' ? 'PM' : 'AM'}));

  const handleOpenTimeModal = () => {
    setTempTime({ h: notificationTime.hour, m: notificationTime.minute, p: notificationTime.period });
    setIsTimeModalVisible(true);
  };
  const handleSaveTime = () => {
    setNotificationTime({ hour: tempTime.h, minute: tempTime.m, period: tempTime.p });
    setIsTimeModalVisible(false);
  };

  const handleSaveProfile = () => {
    setName(editName);
    setEmail(editEmail);
    setIsEditModalVisible(false);
  };

  const handleOpenEdit = () => {
    setEditName(name);
    setEditEmail(email);
    setIsEditModalVisible(true);
  };

  const handleOpenFontModal = () => {
    setTempFontSize(fontSizeMultiplier);
    setIsFontModalVisible(true);
  };

  const handleSaveFont = () => {
    setFontSizeMultiplier(tempFontSize);
    setIsFontModalVisible(false);
  };

  const openCamera = async () => {
    setIsPickerModalVisible(false);
    const result = await launchCamera({ mediaType: 'photo', quality: 0.8 });
    if (result.assets && result.assets[0].uri) {
      setProfileImageUri(result.assets[0].uri);
    }
  };

  const openGallery = async () => {
    setIsPickerModalVisible(false);
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });
    if (result.assets && result.assets[0].uri) {
      setProfileImageUri(result.assets[0].uri);
    }
  };

  const removePicture = () => {
    setProfileImageUri(null);
    setIsPickerModalVisible(false);
  };

  const fm = fontSizeMultiplier || 1;
  const t = translations[language].profile;
  const styles = getStyles(isDarkMode, fm);

  const currentLangName = LANG_OPTIONS.find(l => l.id === language)?.native.toUpperCase() || 'ENGLISH';

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{translations[language].headers.title}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {profileImageUri ? (
              <Image source={{ uri: profileImageUri }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, { backgroundColor: '#EAE1D3', alignItems: 'center', justifyContent: 'center' }]}>
                <Text style={{ fontSize: 32 * fm, fontFamily: 'serif', color: '#B48259', fontWeight: 'bold' }}>
                  {name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                </Text>
              </View>
            )}
            <TouchableOpacity style={styles.editAvatarBtn} activeOpacity={0.8} onPress={() => setIsPickerModalVisible(true)}>
              <Edit2 color="#FFF" size={12} strokeWidth={3} />
            </TouchableOpacity>
          </View>

          <View style={styles.nameRow}>
            <Text style={styles.name}>{name}</Text>
            <TouchableOpacity onPress={handleOpenEdit} style={{marginLeft: 8}}>
              <Edit2 color="#A45511" size={16} />
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>{t.seeker} - {t.joined}</Text>

          {/* Stats Bar */}
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{memorizedVerses.length}</Text>
              <Text style={styles.statLabel}>{t.versesMem}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>{t.streak}</Text>
            </View>
          </View>
        </View>

        {/* EXPERIENCE SETTINGS */}
        <View style={styles.sectionDividerRow}>
          <Text style={styles.sectionDividerText}>{t.expSettings}</Text>
          <View style={styles.sectionDividerLine} />
        </View>

        <View style={styles.settingsGroup}>
          
          {/* Language Item */}
          <TouchableOpacity 
            style={styles.settingItem}
            activeOpacity={0.7}
            onPress={() => setIsLangModalVisible(true)}
          >
            <View style={styles.settingIconBox}>
              <Globe color="#B48259" size={20} strokeWidth={2} />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>{t.language}</Text>
              <Text style={styles.settingDesc}>{t.langDesc}</Text>
            </View>
            <View style={styles.settingActionRow}>
              <Text style={styles.settingValueText}>{currentLangName}</Text>
              <ChevronRight color="#C2A895" size={16} />
            </View>
          </TouchableOpacity>

          {/* Dark Mode Item */}
          <View style={styles.settingItem}>
            <View style={styles.settingIconBox}>
              <Moon color="#B48259" size={20} strokeWidth={2} />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>{t.darkMode}</Text>
              <Text style={styles.settingDesc}>{t.darkDesc}</Text>
            </View>
            <Switch
              trackColor={{ false: '#EAE1D3', true: '#B48259' }}
              thumbColor={Platform.OS === 'ios' ? '#FFF' : '#F6F2EB'}
              onValueChange={toggleDarkMode}
              value={isDarkMode}
              style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
            />
          </View>

          {/* Font Size Item */}
          <TouchableOpacity 
            style={styles.settingItem}
            activeOpacity={0.7}
            onPress={handleOpenFontModal}
          >
            <View style={styles.settingIconBox}>
              <Type color="#B48259" size={20} strokeWidth={2} />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>{t.fontSize}</Text>
              <Text style={styles.settingDesc}>{t.fontDesc}</Text>
            </View>
            <ChevronRight color="#C2A895" size={16} />
          </TouchableOpacity>

        </View>

        {/* SPIRITUAL DISCIPLINE */}
        <View style={styles.sectionDividerRow}>
          <Text style={styles.sectionDividerText}>{t.spiritDisc}</Text>
          <View style={styles.sectionDividerLine} />
        </View>

        <View style={styles.settingsGroup}>
          
          {/* Daily Reflection Item */}
          <View style={styles.settingItem}>
            <View style={styles.settingIconBox}>
              <Bell color="#B48259" size={20} strokeWidth={2} />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>{t.dailyRef}</Text>
              <Text style={styles.settingDesc}>{t.dailyRefDesc}</Text>
            </View>
            <TouchableOpacity style={styles.settingActionRow} onPress={handleOpenTimeModal}>
              <Text style={[styles.settingValueText, { fontSize: 13 * fm }]}>
                {notificationTime.hour}:{notificationTime.minute.toString().padStart(2, '0')}{"\n"}{notificationTime.period}
              </Text>
              <Edit3 color="#A0988E" size={14} style={{marginLeft: 8}} />
            </TouchableOpacity>
          </View>

          {/* Offline Sanctuary Item */}
          <View style={styles.settingItem}>
            <View style={styles.settingIconBox}>
              <DownloadCloud color="#B48259" size={20} strokeWidth={2} />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>{t.offlineSanc}</Text>
              <Text style={styles.settingDesc}>{t.offlineDesc}</Text>
            </View>
            <View style={styles.offlineActionRow}>
              <Text style={styles.offlineSize}>124 MB{"\n"}USED</Text>
              <TouchableOpacity>
                <Trash2 color="#CD3A30" size={16} />
              </TouchableOpacity>
            </View>
          </View>

        </View>

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutButton}>
          <Text style={styles.signOutText}>{t.signOut}</Text>
        </TouchableOpacity>

        <View style={{height: 40}}/>
      </ScrollView>

      {/* Profile Picture Picker Modal */}
      <Modal visible={isPickerModalVisible} animationType="fade" transparent={true}>
        <View style={styles.pickerModalBg}>
          <View style={styles.pickerModalContainer}>
            <View style={styles.pickerModalHeader}>
              <Text style={styles.pickerModalTitle}>Profile Photo</Text>
              <TouchableOpacity onPress={() => setIsPickerModalVisible(false)} style={styles.closeBtn}>
                <X color="#A45511" size={20} />
              </TouchableOpacity>
            </View>

            <View style={styles.pickerOptionsContainer}>
              <TouchableOpacity style={styles.pickerOptionBtn} onPress={openCamera}>
                <View style={styles.pickerOptionIconContainer}>
                   <Camera color="#B48259" size={24} />
                </View>
                <Text style={styles.pickerOptionText}>Take Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.pickerOptionBtn} onPress={openGallery}>
                <View style={styles.pickerOptionIconContainer}>
                   <ImageIcon color="#B48259" size={24} />
                </View>
                <Text style={styles.pickerOptionText}>Choose from Gallery</Text>
              </TouchableOpacity>

              {profileImageUri && (
                <>
                  <TouchableOpacity style={styles.pickerOptionBtn} onPress={() => { setIsPickerModalVisible(false); setIsImageViewerVisible(true); }}>
                    <View style={styles.pickerOptionIconContainer}>
                      <Eye color="#B48259" size={24} />
                    </View>
                    <Text style={styles.pickerOptionText}>View Photo</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.pickerOptionBtn} onPress={removePicture}>
                    <View style={[styles.pickerOptionIconContainer, { backgroundColor: '#FDECEC' }]}>
                      <Trash2 color="#CD3A30" size={24} />
                    </View>
                    <Text style={[styles.pickerOptionText, { color: '#CD3A30' }]}>Remove Photo</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal visible={isEditModalVisible} animationType="slide" transparent={true}>
        <KeyboardAvoidingView 
          style={styles.modalBg} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setIsEditModalVisible(false)} style={styles.closeBtn}>
                <X color="#A45511" size={20} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.textInput}
                value={editName}
                onChangeText={setEditName}
                placeholder="Enter your name"
                placeholderTextColor="#A0988E"
              />

              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.textInput}
                value={editEmail}
                onChangeText={setEditEmail}
                placeholder="Enter your email"
                placeholderTextColor="#A0988E"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile} activeOpacity={0.8}>
                <Check color="#FFF" size={18} style={{marginRight: 8}} />
                <Text style={styles.saveBtnText}>SAVE CHANGES</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Font Size Modal */}
      <Modal visible={isFontModalVisible} animationType="fade" transparent={true}>
        <View style={styles.pickerModalBg}>
          <View style={styles.pickerModalContainer}>
            <View style={styles.pickerModalHeader}>
              <Text style={styles.pickerModalTitle}>Font Size</Text>
              <TouchableOpacity onPress={() => setIsFontModalVisible(false)} style={styles.closeBtn}>
                <X color="#A45511" size={20} />
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 35, paddingHorizontal: 10 }}>
              <Text style={{ fontFamily: 'serif', fontSize: 16 * fm, fontWeight: 'bold', color: isDarkMode ? '#EAE1D3' : '#333' }}>A</Text>
              
              <View style={{ flex: 1, paddingHorizontal: 0, justifyContent: 'center', marginHorizontal: 15 }}>
                {/* Track Line */}
                <View style={{ position: 'absolute', left: 10, right: 10, height: 3, backgroundColor: isDarkMode ? '#4A423B' : '#EAE1D3' }} />
                
                {/* Active Track Line (Left to Current) */}
                {(() => {
                  const FONT_SIZES = [0.85, 0.9, 0.95, 1.0, 1.05, 1.1, 1.15, 1.2];
                  const currentIndex = Math.max(0, FONT_SIZES.indexOf(tempFontSize));
                  const percentage = (currentIndex / (FONT_SIZES.length - 1)) * 100;
                  return (
                    <View style={{ position: 'absolute', left: 10, right: 10, top: 0, bottom: 0, justifyContent: 'center' }}>
                       <View style={{ width: `${percentage}%`, height: 3, backgroundColor: '#CA7532' }} />
                    </View>
                  );
                })()}

                {/* Touch Points */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  {[0.85, 0.9, 0.95, 1.0, 1.05, 1.1, 1.15, 1.2].map((size) => {
                    const isActive = tempFontSize === size;
                    return (
                      <TouchableOpacity 
                        key={size}
                        onPress={() => setTempFontSize(size)} 
                        style={{ width: 24, height: 24, justifyContent: 'center', alignItems: 'center' }} 
                        activeOpacity={0.8}
                      >
                        {isActive ? (
                          <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: '#CA7532' }} />
                        ) : (
                          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: isDarkMode ? '#7A726B' : '#C2BAAE' }} />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <Text style={{ fontFamily: 'serif', fontSize: 26 * fm, fontWeight: 'bold', color: isDarkMode ? '#EAE1D3' : '#333' }}>A</Text>
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveFont} activeOpacity={0.8}>
              <Check color="#FFF" size={18} style={{marginRight: 8}} />
              <Text style={styles.saveBtnText}>APPLY SETTINGS</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

      {/* Time Picker Modal */}
      <Modal visible={isTimeModalVisible} animationType="slide" transparent={true}>
        <View style={styles.pickerModalBg}>
          <View style={styles.pickerModalContainer}>
            <View style={styles.pickerModalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Clock color="#A45511" size={20} style={{ marginRight: 8 }} />
                <Text style={styles.pickerModalTitle}>Reflection Time</Text>
              </View>
              <TouchableOpacity onPress={() => setIsTimeModalVisible(false)} style={styles.closeBtn}>
                <X color="#A45511" size={20} />
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 30, paddingHorizontal: 10 }}>
              
              {/* Hour Spinner */}
              <View style={{ alignItems: 'center', marginHorizontal: 10 }}>
                <TouchableOpacity onPress={incHour} style={styles.spinnerBtn}>
                  <ChevronUp color={isDarkMode ? '#EAE1D3' : '#A45511'} size={24} />
                </TouchableOpacity>
                <Text style={{ fontFamily: 'serif', fontSize: 36 * fm, fontWeight: 'bold', color: isDarkMode ? '#FFF' : '#333', marginVertical: 10 }}>
                  {tempTime.h}
                </Text>
                <TouchableOpacity onPress={decHour} style={styles.spinnerBtn}>
                  <ChevronDown color={isDarkMode ? '#EAE1D3' : '#A45511'} size={24} />
                </TouchableOpacity>
              </View>

              <Text style={{ fontFamily: 'serif', fontSize: 36 * fm, fontWeight: 'bold', color: isDarkMode ? '#FFF' : '#333', marginBottom: 10 }}>
                :
              </Text>

              {/* Minute Spinner */}
              <View style={{ alignItems: 'center', marginHorizontal: 10 }}>
                <TouchableOpacity onPress={incMin} style={styles.spinnerBtn}>
                  <ChevronUp color={isDarkMode ? '#EAE1D3' : '#A45511'} size={24} />
                </TouchableOpacity>
                <Text style={{ fontFamily: 'serif', fontSize: 36 * fm, fontWeight: 'bold', color: isDarkMode ? '#FFF' : '#333', marginVertical: 10 }}>
                  {tempTime.m.toString().padStart(2, '0')}
                </Text>
                <TouchableOpacity onPress={decMin} style={styles.spinnerBtn}>
                  <ChevronDown color={isDarkMode ? '#EAE1D3' : '#A45511'} size={24} />
                </TouchableOpacity>
              </View>

              {/* AM/PM Spinner */}
              <View style={{ alignItems: 'center', marginLeft: 20 }}>
                <TouchableOpacity onPress={togglePeriod} style={styles.spinnerBtn}>
                  <ChevronUp color={isDarkMode ? '#EAE1D3' : '#A45511'} size={24} />
                </TouchableOpacity>
                <Text style={{ fontFamily: 'serif', fontSize: 24 * fm, fontWeight: 'bold', color: '#CA7532', marginVertical: 18 }}>
                  {tempTime.p}
                </Text>
                <TouchableOpacity onPress={togglePeriod} style={styles.spinnerBtn}>
                  <ChevronDown color={isDarkMode ? '#EAE1D3' : '#A45511'} size={24} />
                </TouchableOpacity>
              </View>
              
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveTime} activeOpacity={0.8}>
              <Check color="#FFF" size={18} style={{marginRight: 8}} />
              <Text style={styles.saveBtnText}>SET ALARM</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

      {/* Full Screen Image Viewer */}
      <Modal visible={isImageViewerVisible} animationType="fade" transparent={true}>
        <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity 
            style={{ position: 'absolute', top: Platform.OS === 'ios' ? 50 : 20, right: 20, zIndex: 1, padding: 10 }}
            onPress={() => setIsImageViewerVisible(false)}
          >
            <X color="#FFF" size={30} />
          </TouchableOpacity>
          {profileImageUri && (
            <Image 
              source={{ uri: profileImageUri as string }} 
              style={{ width: '100%', height: '80%' }} 
              resizeMode="contain" 
            />
          )}
        </View>
      </Modal>

      {/* Language Selection Modal */}
      <Modal visible={isLangModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBg}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderTitle}>{t.language}</Text>
              <TouchableOpacity onPress={() => setIsLangModalVisible(false)} style={styles.closeBtn}>
                <X color="#A45511" size={20} />
              </TouchableOpacity>
            </View>
            <View style={{ maxHeight: 400 }}>
              <FlatList
                data={LANG_OPTIONS}
                keyExtractor={(item: { id: string }) => item.id}
                renderItem={({ item }: { item: { id: LanguageCode; name: string; native: string } }) => {
                  const isSelected = language === item.id;
                  return (
                    <TouchableOpacity 
                      style={[styles.langItem, isSelected && styles.langItemSelected]}
                      onPress={() => {
                        setLanguage(item.id);
                        setIsLangModalVisible(false);
                      }}
                    >
                      <Text style={[styles.langText, isSelected && styles.langTextSelected]}>
                        {item.native} ({item.name})
                      </Text>
                      {isSelected && <Check color="#CA7532" size={20} />}
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

const getStyles = (isDark: boolean, fm: number) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#1A1816' : '#FDFBF7',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontFamily: 'serif',
    fontSize: 18 * fm,
    fontWeight: 'bold',
    color: '#B48259',
    fontStyle: 'italic',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  
  profileSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    position: 'relative',
    shadowColor: '#000',
    shadowOpacity: isDark ? 0.3 : 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    marginBottom: 15,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    backgroundColor: '#CA7532',
    width: 24,
    height: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: isDark ? '#1A1816' : '#FDFBF7',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  name: {
    fontFamily: 'serif',
    fontSize: 26 * fm,
    fontWeight: 'bold',
    color: isDark ? '#EAE1D3' : '#A45511',
  },
  subtitle: {
    fontSize: 10 * fm,
    color: '#A0988E',
    letterSpacing: 1.5,
    fontWeight: '600',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
  },
  statBox: {
    backgroundColor: isDark ? '#2D2823' : '#F6F2EB',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 10,
    minWidth: 120,
  },
  statNumber: {
    fontSize: 18 * fm,
    fontWeight: 'bold',
    color: '#CD3A30',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 8 * fm,
    color: '#A0988E',
    letterSpacing: 0.5,
  },

  sectionDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  sectionDividerText: {
    fontSize: 10 * fm,
    color: '#A0988E',
    letterSpacing: 2,
    fontWeight: '600',
    marginRight: 15,
  },
  sectionDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: isDark ? '#2D2823' : '#EAE1D3',
  },

  settingsGroup: {
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  settingIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: isDark ? '#2D2823' : '#F6F2EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  settingTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  settingTitle: {
    fontFamily: 'serif',
    fontSize: 16 * fm,
    fontWeight: 'bold',
    color: isDark ? '#EAE1D3' : '#333',
    marginBottom: 2,
  },
  settingDesc: {
    fontSize: 12 * fm,
    color: '#8A8275',
  },
  settingActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValueText: {
    fontSize: 10 * fm,
    color: '#CD3A30',
    fontWeight: 'bold',
    letterSpacing: 1,
    marginRight: 4,
    textAlign: 'right'
  },
  
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#2D2823' : '#F6F2EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  sliderA: {
    fontFamily: 'serif',
    fontSize: 12 * fm,
    fontWeight: 'bold',
    color: isDark ? '#EAE1D3' : '#555',
  },
  sliderTrackBg: {
    width: 40,
    height: 2,
    backgroundColor: isDark ? '#4A423B' : '#EAE1D3',
    marginHorizontal: 10,
    justifyContent: 'center',
  },
  sliderTrackActive: {
    width: '60%',
    height: '100%',
    backgroundColor: '#CA7532',
  },
  sliderThumb: {
    position: 'absolute',
    left: '50%',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#CA7532',
  },

  offlineActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 70,
  },
  offlineSize: {
    fontSize: 8 * fm,
    color: '#A0988E',
    textAlign: 'right',
    marginRight: 10,
    lineHeight: 12,
  },

  signOutButton: {
    marginTop: 20,
    alignItems: 'center',
    paddingVertical: 15,
  },
  signOutText: {
    color: '#CD3A30',
    fontSize: 11 * fm,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },

  // Language Modal Styles
  langItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#2D2823' : '#F6F2EB',
  },
  langItemSelected: {
    backgroundColor: isDark ? '#26221D' : '#FFF5ED',
  },
  langText: {
    fontSize: 18 * fm,
    color: isDark ? '#EAE1D3' : '#333',
    fontWeight: '500',
    fontFamily: 'serif',
  },
  langTextSelected: {
    color: '#CA7532',
    fontWeight: 'bold',
  },

  // Modal Styles
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: isDark ? '#1A1816' : '#FDFBF7',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: 350,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    shadowColor: '#000',
    shadowOpacity: isDark ? 0.5 : 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -5 },
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#2D2823' : '#EAE1D3',
  },
  modalHeaderTitle: {
    fontFamily: 'serif',
    fontSize: 20 * fm,
    fontWeight: 'bold',
    color: '#A45511',
  },
  closeBtn: {
    padding: 5,
    backgroundColor: isDark ? '#2D2823' : '#F6F2EB',
    borderRadius: 15,
  },
  modalContent: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 12 * fm,
    fontWeight: 'bold',
    color: '#A0988E',
    marginBottom: 8,
    letterSpacing: 1,
  },
  textInput: {
    backgroundColor: isDark ? '#2D2823' : '#FFF',
    borderWidth: 1,
    borderColor: isDark ? '#4A423B' : '#EAE1D3',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16 * fm,
    color: isDark ? '#EAE1D3' : '#333',
    marginBottom: 20,
    fontFamily: 'serif',
  },
  saveBtn: {
    backgroundColor: '#CA7532',
    height: 54,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  saveBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14 * fm,
    letterSpacing: 1.5,
  },

  // Picker Modal Styles
  pickerModalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  pickerModalContainer: {
    backgroundColor: isDark ? '#1A1816' : '#FFF',
    width: '100%',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: isDark ? 0.3 : 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  pickerModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  pickerModalTitle: {
    fontFamily: 'serif',
    fontSize: 18 * fm,
    fontWeight: 'bold',
    color: isDark ? '#EAE1D3' : '#333',
  },
  pickerOptionsContainer: {
    gap: 15,
  },
  pickerOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    backgroundColor: isDark ? '#1A1816' : '#FDFBF7',
    borderWidth: 1,
    borderColor: isDark ? '#2D2823' : '#EAE1D3',
  },
  pickerOptionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: isDark ? '#2D2823' : '#F6F2EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  pickerOptionText: {
    fontSize: 16 * fm,
    fontWeight: '600',
    color: isDark ? '#EAE1D3' : '#333',
  },
  fontSizeOptionBtn: {
    flex: 1,
    marginHorizontal: 5,
    height: 60,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: isDark ? '#2D2823' : '#EAE1D3',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isDark ? '#1A1816' : '#FDFBF7',
  },
  fontSizeOptionActive: {
    borderColor: '#CA7532',
    backgroundColor: isDark ? '#3E2A1E' : '#FDF6ED',
  },
  fontSizeOptionText: {
    fontFamily: 'serif',
    fontWeight: 'bold',
    color: isDark ? '#EAE1D3' : '#555',
  },
  fontSizeOptionTextActive: {
    color: '#CA7532',
  },
  spinnerBtn: {
    padding: 10,
    backgroundColor: isDark ? '#2D2823' : '#FDF6ED',
    borderRadius: 12,
  }
});

export default ProfileScreen;
