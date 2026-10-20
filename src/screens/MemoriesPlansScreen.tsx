import React from 'react';
import {Alert, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ArrowLeft, Camera, Check, Crown, ShieldCheck} from 'lucide-react-native';

const PURPLE = '#7956BA';
const INK = '#32254C';

export default function MemoriesPlansScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const showComingSoon = () => {
    Alert.alert(
      'Premium yakında 💜',
      'Abonelikler henüz satışa açılmadı. Google Play ödeme entegrasyonu ve güvenli Premium doğrulaması tamamlandığında buradan satın alabileceksin.',
      [{text: 'Tamam'}],
    );
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={[styles.content, {paddingTop: insets.top + 14, paddingBottom: insets.bottom + 40}]}>
        <Pressable onPress={() => navigation.goBack()} accessibilityLabel="Geri dön" accessibilityRole="button" style={styles.back}>
          <ArrowLeft color={INK} size={22}/>
        </Pressable>
        <View style={styles.icon}><Crown color={PURPLE} size={32}/></View>
        <Text style={styles.label}>ANIMIO PREMIUM</Text>
        <Text style={styles.title}>Anılarınız için özel bir dünya.</Text>
        <Text style={styles.subtitle}>Kendi anı defterini oluştur, anılarını fotoğraflarla sakla ve dostlarınla yaşadığın günlere yeniden dön.</Text>
        <View style={styles.benefits}>
          <View style={styles.benefit}><Camera color={PURPLE} size={20}/><Text style={styles.benefitText}>Toplam 100 fotoğraflık anı alanı</Text><Check color={PURPLE} size={18}/></View>
          <View style={styles.benefit}><ShieldCheck color={PURPLE} size={20}/><Text style={styles.benefitText}>Anı defterine Premium erişim</Text><Check color={PURPLE} size={18}/></View>
        </View>
        <Text style={styles.section}>Üyelik seçenekleri</Text>
        <Pressable style={styles.plan} onPress={showComingSoon} accessibilityRole="button">
          <View><Text style={styles.planTitle}>Aylık Premium</Text><Text style={styles.planHint}>Her ay yenilenir</Text></View>
          <Text style={styles.price}>49,99 TL</Text>
        </Pressable>
        <Pressable style={styles.plan} onPress={showComingSoon} accessibilityRole="button">
          <View><Text style={styles.planTitle}>Yıllık Premium</Text><Text style={styles.planHint}>12 aylık erişim</Text></View>
          <Text style={styles.price}>399,99 TL</Text>
        </Pressable>
        <Text style={styles.disclaimer}>Gösterilen fiyatlar taslak önerilerdir. Şu anda ödeme alınmaz, abonelik başlatılmaz. Nihai fiyatlar ve satın alma koşulları yayınlanmadan önce açıklanacaktır.</Text>
        <Pressable style={styles.button} onPress={showComingSoon} accessibilityRole="button"><Text style={styles.buttonText}>Premium yakında</Text></Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: '#F8F5F3'},
  content: {paddingHorizontal: 24},
  back: {width: 44, height: 44, borderRadius: 15, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center'},
  icon: {marginTop: 32, width: 74, height: 74, borderRadius: 24, alignSelf: 'center', backgroundColor: '#EEE7F8', alignItems: 'center', justifyContent: 'center'},
  label: {marginTop: 20, color: PURPLE, textAlign: 'center', letterSpacing: 2, fontFamily: 'Quicksand-Bold', fontSize: 11},
  title: {marginTop: 13, textAlign: 'center', color: INK, fontFamily: 'Quicksand-Bold', fontSize: 27, lineHeight: 35},
  subtitle: {marginTop: 13, textAlign: 'center', color: '#81748D', fontFamily: 'Quicksand-Medium', fontSize: 13, lineHeight: 21},
  benefits: {marginTop: 32, backgroundColor: '#FFFFFF', borderRadius: 22, paddingHorizontal: 16},
  benefit: {minHeight: 69, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomColor: '#F2ECF5', borderBottomWidth: 1},
  benefitText: {fontFamily: 'Quicksand-Bold', fontSize: 12, color: INK, flex: 1},
  section: {marginTop: 28, marginBottom: 13, color: INK, fontFamily: 'Quicksand-Bold', fontSize: 17},
  plan: {backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E8DDF2', borderRadius: 18, padding: 18, marginBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  planTitle: {fontFamily: 'Quicksand-Bold', fontSize: 14, color: INK},
  planHint: {fontFamily: 'Quicksand-Medium', fontSize: 11, marginTop: 5, color: '#81748D'},
  price: {fontFamily: 'Quicksand-Bold', fontSize: 16, color: PURPLE},
  disclaimer: {fontFamily: 'Quicksand-Medium', fontSize: 11, lineHeight: 18, textAlign: 'center', color: '#81748D', marginTop: 14},
  button: {backgroundColor: PURPLE, minHeight: 55, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginTop: 22},
  buttonText: {fontFamily: 'Quicksand-Bold', fontSize: 15, color: '#FFFFFF'},
});
