import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Easing,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {getDefaultPetImage} from '../data/petTypes';

import {
  ArrowLeft,
  ArrowRight,
  BookHeart,
  Camera,
  Crown,
  Heart,
  LockKeyhole,
  Sparkles,
} from 'lucide-react-native';

const C = {
  background: '#F8F5F3',
  ink: '#32254C',
  purple: '#7956BA',
  softPurple: '#EEE7F8',
  muted: '#82768C',
  white: '#FFFDFA',
  peach: '#F8E6D8',
};

const PET_ART = [
  getDefaultPetImage('Kedi'),
  getDefaultPetImage('Köpek'),
  getDefaultPetImage('Tavşan'),
  getDefaultPetImage('Kuş'),
];

const FEATURES = [
  {icon: Camera, title: 'Fotoğraflı anılar', detail: 'Küçük anların hepsi bir arada.'},
  {icon: BookHeart, title: 'Kişisel anı defteri', detail: 'Duygularını ve hikâyelerini yaz.'},
  {icon: Heart, title: '100 fotoğraflık albüm', detail: 'Tüm dostların için ortak alan.'},
];

function PhotoCard({index, progress}: {index: number; progress: Animated.Value}) {
  const offsets = [-66, -20, 24, 68];
  const rotations = ['-15deg', '-5deg', '7deg', '16deg'];
  const initialRotation = ['-36deg', '-18deg', '23deg', '39deg'];
  const shift = progress.interpolate({inputRange: [0, 1], outputRange: [65, 0]});
  const rotate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [initialRotation[index], rotations[index]],
  });
  const scale = progress.interpolate({inputRange: [0, 1], outputRange: [0.78, 1]});
  return (
    <Animated.View
      style={[
        styles.photoCard,
        {
          left: '50%',
          marginLeft: -57 + offsets[index],
          zIndex: index === 1 ? 6 : index === 2 ? 5 : index === 0 ? 4 : 3,
          opacity: progress,
          transform: [{translateY: shift}, {rotate}, {scale}],
        },
      ]}>
      <View style={[styles.photoArea, {backgroundColor: index % 2 ? '#F4E6DB' : '#ECE3F6'}]}>
        <Image source={PET_ART[index]} style={styles.photoImage} resizeMode="contain" />
      </View>
      <View style={styles.photoFooter}>
        <Heart size={11} color="#D98FA5" fill="#D98FA5" />
      </View>
    </Animated.View>
  );
}

export default function MemoriesPremiumScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const entry = useRef(new Animated.Value(0)).current;
  const cards = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const breathing = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const opening = Animated.sequence([
      Animated.parallel([
        Animated.timing(entry, {toValue: 1, duration: 620, easing: Easing.out(Easing.cubic), useNativeDriver: true}),
        Animated.timing(cards, {toValue: 1, duration: 1100, delay: 140, easing: Easing.out(Easing.back(1.1)), useNativeDriver: true}),
      ]),
    ]);
    const pulse = Animated.loop(Animated.sequence([
      Animated.timing(breathing, {toValue: 1, duration: 1900, easing: Easing.inOut(Easing.sin), useNativeDriver: true}),
      Animated.timing(breathing, {toValue: 0, duration: 1900, easing: Easing.inOut(Easing.sin), useNativeDriver: true}),
    ]));
    opening.start();
    pulse.start();
    return () => {opening.stop(); pulse.stop();};
  }, [entry, cards, breathing]);

  const heroDrift = scrollY.interpolate({inputRange: [0, 300], outputRange: [0, -95], extrapolate: 'clamp'});
  const heroFade = scrollY.interpolate({inputRange: [0, 250], outputRange: [1, 0.2], extrapolate: 'clamp'});
  const appearing = {opacity: entry, transform: [{translateY: entry.interpolate({inputRange: [0, 1], outputRange: [25, 0]})}]};
  const floatUp = breathing.interpolate({inputRange: [0, 1], outputRange: [0, -7]});

  return (
    <View style={styles.screen}>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 138}}
        onScroll={Animated.event([{nativeEvent: {contentOffset: {y: scrollY}}}], {useNativeDriver: true})}
        scrollEventThrottle={16}>
        <View style={[styles.topBar, {paddingTop: insets.top + 12}]}>
          <Pressable onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Geri dön" style={styles.backButton}>
            <ArrowLeft size={22} color={C.ink} />
          </Pressable>
          <Text style={styles.topTitle}>Anılarım</Text>
          <View style={styles.crownButton}><Crown size={19} color={C.purple} /></View>
        </View>

        <Animated.View style={[styles.hero, {opacity: heroFade, transform: [{translateY: heroDrift}]}]}>
          <View style={styles.heroOrbOne} />
          <View style={styles.heroOrbTwo} />
          <Animated.View style={[styles.heroText, appearing]}>
            <View style={styles.tag}><Sparkles size={13} color={C.purple}/><Text style={styles.tagText}>ANIMIO PREMIUM</Text></View>
            <Text style={styles.headline}>Birlikte geçen her an, bir hikâye.</Text>
            <Text style={styles.heroDescription}>Dostlarınla yaşadığın güzellikleri kendi anı defterinde biriktir.</Text>
          </Animated.View>
          <Animated.View style={[styles.albumStage, {transform: [{translateY: floatUp}]}]}>
            <View style={styles.albumBack} />
            <View style={styles.albumCover}>
              <BookHeart size={34} color={C.purple} strokeWidth={1.5}/>
              <Text style={styles.albumCaption}>bizim hikâyemiz</Text>
              <View style={styles.albumDashes}><View style={styles.dash}/><View style={styles.dash}/><View style={styles.dash}/></View>
            </View>
            {PET_ART.map((_, index) => <PhotoCard key={index} index={index} progress={cards} />)}
            <View style={styles.sparkleOne}><Sparkles size={24} color="#C99E68" /></View>
            <View style={styles.sparkleTwo}><Sparkles size={17} color="#A98DC9" /></View>
          </Animated.View>
        </Animated.View>

        <View style={styles.content}>
          <Animated.View style={[styles.sectionHeader, appearing]}>
            <Text style={styles.eyebrow}>SADECE ANIMIO PREMIUM'DA</Text>
            <Text style={styles.sectionTitle}>Her anın bir yeri olsun.</Text>
            <Text style={styles.sectionSubtitle}>Sadece fotoğraf değil, birlikte büyüttüğünüz bir hikâye.</Text>
          </Animated.View>
          <View style={styles.featurePanel}>
            {FEATURES.map(({icon: Icon, title, detail}, index) => (
              <View key={title} style={[styles.featureRow, index < FEATURES.length - 1 && styles.featureDivider]}>
                <View style={styles.featureIcon}><Icon size={21} color={C.purple} strokeWidth={1.8}/></View>
                <View style={{flex: 1}}><Text style={styles.featureTitle}>{title}</Text><Text style={styles.featureDetail}>{detail}</Text></View>
                <ArrowRight size={17} color="#BEA9CC" />
              </View>
            ))}
          </View>
          <View style={styles.preview}>
            <View style={styles.previewTop}><Text style={styles.previewLabel}>ANILARINDAN BİR SAYFA</Text><LockKeyhole size={15} color={C.purple}/></View>
            <View style={styles.previewBody}>
              <View style={styles.previewThumb}><Image source={PET_ART[2]} style={{width: '100%', height: '100%'}} resizeMode="contain"/></View>
              <View style={{flex: 1, gap: 5}}><Text style={styles.previewDate}>12 MAYIS 2026</Text><Text style={styles.previewTitle}>Küçük mutluluklar</Text><Text style={styles.previewCopy}>Bugün birlikte güneşin tadını çıkardık... ♡</Text></View>
            </View>
          </View>
          <Text style={styles.footerInfo}>Anılarım özelliği Premium üyeliğe dahildir. Abonelik ve fotoğraf yükleme henüz etkin değildir.</Text>
        </View>
      </Animated.ScrollView>

      <View style={[styles.bottom, {paddingBottom: Math.max(insets.bottom, 14)}]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Premium özelliklerini keşfet"
          onPress={() => navigation.navigate('MemoriesPlans')}
          style={({pressed}) => [styles.cta, {opacity: pressed ? 0.9 : 1, transform: [{scale: pressed ? 0.985 : 1}]}]}>
          <Crown size={20} color="#FFFFFF" />
          <Text style={styles.ctaText}>Premium'u Keşfet</Text>
          <ArrowRight size={19} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: C.background},
  topBar: {height: 108, paddingHorizontal: 23, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  backButton: {height: 42, width: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 16, backgroundColor: '#FFFFFF'},
  topTitle: {fontFamily: 'Quicksand-Bold', fontSize: 18, color: C.ink},
  crownButton: {height: 42, width: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 16, backgroundColor: C.softPurple},
  hero: {height: 515, overflow: 'hidden', marginTop: -2},
  heroOrbOne: {position: 'absolute', width: 320, height: 320, borderRadius: 160, backgroundColor: '#EFE4F4', top: 180, left: -90},
  heroOrbTwo: {position: 'absolute', width: 240, height: 240, borderRadius: 120, backgroundColor: '#F7E8DA', top: 165, right: -80},
  heroText: {paddingHorizontal: 29, alignItems: 'center'},
  tag: {flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 15, paddingVertical: 9, backgroundColor: '#EAE0F5', borderRadius: 25},
  tagText: {fontFamily: 'Quicksand-Bold', letterSpacing: 1.5, fontSize: 10, color: C.purple},
  headline: {fontFamily: 'Quicksand-Bold', fontSize: 29, lineHeight: 37, textAlign: 'center', color: C.ink, marginTop: 20, maxWidth: 330},
  heroDescription: {fontFamily: 'Quicksand-Medium', fontSize: 13, lineHeight: 21, textAlign: 'center', color: C.muted, maxWidth: 285, marginTop: 10},
  albumStage: {height: 255, marginTop: 22, alignItems: 'center', justifyContent: 'center'},
  albumBack: {position: 'absolute', width: 155, height: 174, borderRadius: 23, backgroundColor: '#D9C4E8', transform: [{rotate: '8deg'}], marginTop: 26},
  albumCover: {position: 'absolute', width: 155, height: 174, marginTop: 20, borderRadius: 23, backgroundColor: '#FDF4E7', borderWidth: 2, borderColor: '#F9F9F4', alignItems: 'center', justifyContent: 'center', transform: [{rotate: '-6deg'}], elevation: 3},
  albumCaption: {fontFamily: 'Quicksand-Bold', fontSize: 11, color: C.ink, marginTop: 12},
  albumDashes: {flexDirection: 'row', gap: 5, marginTop: 12},
  dash: {width: 6, height: 6, borderRadius: 3, backgroundColor: '#D4C1DB'},
  photoCard: {position: 'absolute', top: 62, width: 114, height: 145, borderRadius: 14, backgroundColor: '#FFFFFF', padding: 7, shadowColor: '#513671', shadowOffset: {width: 0, height: 8}, shadowOpacity: 0.2, shadowRadius: 12, elevation: 7},
  photoArea: {width: 100, height: 108, borderRadius: 8, alignItems: 'center', justifyContent: 'center'},
  photoImage: {width: 89, height: 96},
  photoFooter: {height: 22, justifyContent: 'center', alignItems: 'flex-end', paddingRight: 4},
  sparkleOne: {position: 'absolute', right: 26, top: 18},
  sparkleTwo: {position: 'absolute', left: 35, bottom: 17},
  content: {paddingHorizontal: 22},
  sectionHeader: {alignItems: 'center', marginTop: 5, paddingBottom: 23},
  eyebrow: {fontFamily: 'Quicksand-Bold', letterSpacing: 1.6, color: C.purple, fontSize: 10},
  sectionTitle: {fontFamily: 'Quicksand-Bold', fontSize: 23, color: C.ink, textAlign: 'center', marginTop: 10},
  sectionSubtitle: {fontFamily: 'Quicksand-Medium', fontSize: 12, color: C.muted, textAlign: 'center', marginTop: 8, lineHeight: 19},
  featurePanel: {backgroundColor: '#FFFFFF', borderRadius: 25, paddingHorizontal: 16, borderWidth: 1, borderColor: '#F0EAF3'},
  featureRow: {minHeight: 82, flexDirection: 'row', alignItems: 'center', gap: 13},
  featureDivider: {borderBottomWidth: 1, borderBottomColor: '#F4EEF5'},
  featureIcon: {height: 44, width: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 15, backgroundColor: C.softPurple},
  featureTitle: {fontFamily: 'Quicksand-Bold', color: C.ink, fontSize: 13},
  featureDetail: {fontFamily: 'Quicksand-Medium', color: C.muted, fontSize: 11, marginTop: 4},
  preview: {backgroundColor: '#F4E9E6', borderRadius: 25, padding: 16, marginTop: 22},
  previewTop: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  previewLabel: {fontFamily: 'Quicksand-Bold', color: C.purple, fontSize: 10, letterSpacing: 1},
  previewBody: {flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 16},
  previewThumb: {height: 78, width: 82, borderRadius: 13, backgroundColor: '#E8DBF0', overflow: 'hidden'},
  previewDate: {fontFamily: 'Quicksand-Bold', color: C.muted, fontSize: 9},
  previewTitle: {fontFamily: 'Quicksand-Bold', color: C.ink, fontSize: 14},
  previewCopy: {fontFamily: 'Quicksand-Medium', color: C.muted, fontSize: 11, lineHeight: 16},
  footerInfo: {fontFamily: 'Quicksand-Medium', textAlign: 'center', fontSize: 10, lineHeight: 16, color: C.muted, marginTop: 24},
  bottom: {position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 22, paddingTop: 15, backgroundColor: '#F8F5F3', borderTopWidth: 1, borderTopColor: '#EDE5ED'},
  cta: {backgroundColor: C.purple, borderRadius: 19, minHeight: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 13},
  ctaText: {fontFamily: 'Quicksand-Bold', color: '#FFFFFF', fontSize: 15},
});
