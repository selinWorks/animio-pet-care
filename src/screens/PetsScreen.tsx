import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  StatusBar,
  ImageSourcePropType,
  Animated,
  Alert,
} from 'react-native';

import {
  PawPrint,
  Cat,
  Dog,
  Bird,
  Rabbit,
  Rat,
  Fish,
  Turtle,
  Plus,
  Heart,
  CalendarDays,
  Images,
  ChevronRight,
  Users,
  Check,
  Trash2,
} from 'lucide-react-native';

import {
  CompositeNavigationProp,
  useNavigation,
} from '@react-navigation/native';

import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';

import {
  RootStackParamList,
  TabParamList,
} from '../navigation/AppNavigator';

import {usePets} from '../data/PetContext';
import {Pet} from '../types/Pet';
import {getDefaultPetImage} from '../data/petTypes';

type NavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<RootStackParamList>,
  BottomTabNavigationProp<TabParamList>
>;

const F = {
  light: 'Quicksand-Light',
  regular: 'Quicksand-Regular',
  medium: 'Quicksand-Medium',
  semiBold: 'Quicksand-SemiBold',
  bold: 'Quicksand-Bold',
};

const C = {
  bg: '#FAF9FF',
  white: '#FFFFFF',

  text: '#181642',
  secondary: '#737C9A',
  muted: '#9AA1B7',

  purple: '#7157F4',
  purpleDark: '#5943DF',
  purpleSoft: '#F2EEFF',
  purpleSoft2: '#E9E1FF',

  pinkSoft: '#FFF0F4',
  pink: '#FF4F74',

  greenSoft: '#E4F9F2',
  green: '#24C9A0',

  border: '#EEEBF6',
};

type FilterType =
  | 'all'
  | 'cat'
  | 'dog'
  | 'bird'
  | 'rodent'
  | 'rabbit'
  | 'fish'
  | 'reptile'
  | 'other';

const FILTERS: {
  key: FilterType;
  label: string;
  icon: React.ReactNode;
}[] = [
  {key: 'all', label: 'Tümü', icon: <PawPrint size={20} />},
  {key: 'cat', label: 'Kediler', icon: <Cat size={20} />},
  {key: 'dog', label: 'Köpekler', icon: <Dog size={20} />},
  {key: 'bird', label: 'Kuşlar', icon: <Bird size={20} />},
  {key: 'rodent', label: 'Kemirgenler', icon: <Rat size={20} />},
  {key: 'rabbit', label: 'Tavşanlar', icon: <Rabbit size={20} />},
  {key: 'fish', label: 'Balıklar', icon: <Fish size={20} />},
  {key: 'reptile', label: 'Sürüngenler', icon: <Turtle size={20} />},
  {key: 'other', label: 'Diğer', icon: <PawPrint size={20} />},
];

function normalizeType(type?: string) {
  return (type || '')
    .toLocaleLowerCase('tr-TR')
    .trim();
}

function getPetCategory(type?: string): FilterType {
  const value = normalizeType(type);
  const matches = (keywords: string[]) =>
    keywords.some(keyword => value.includes(keyword));

  if (matches([
    'kedi', 'cat', 'british shorthair', 'scottish fold', 'siyam',
    'maine coon', 'ragdoll', 'tekir', 'sfenks', 'bengal',
    'birman', 'abyssinian',
  ])) return 'cat';

  if (matches([
    'köpek', 'kopek', 'dog', 'golden retriever', 'labrador',
    'alman kurdu', 'bulldog', 'poodle', 'chihuahua', 'beagle',
    'husky', 'pomeranian', 'rottweiler', 'cocker spaniel',
    'dachshund', 'maltese', 'shih tzu', 'border collie',
  ])) return 'dog';

  if (matches([
    'kuş', 'kus', 'bird', 'muhabbet', 'papağan', 'papagan',
    'kanarya', 'ispinoz', 'güvercin', 'guvercin', 'serçe',
    'bülbül', 'bulbul',
  ])) return 'bird';

  if (matches([
    'kemirgen', 'hamster', 'kobay', 'çinçilla', 'cincilla',
    'fare', 'sıçan', 'sican', 'gerbil', 'sincap',
  ])) return 'rodent';

  if (matches(['tavşan', 'tavsan', 'rabbit'])) return 'rabbit';

  if (matches([
    'balık', 'balik', 'fish', 'beta', 'betta', 'lepistes',
    'koi', 'neon tetra', 'moli', 'plati',
  ])) return 'fish';

  if (matches([
    'sürüngen', 'surungen', 'kaplumbağa', 'kaplumbaga',
    'yılan', 'yilan', 'kertenkele', 'iguana', 'geko', 'gecko',
    'sakallı ejder', 'bukalemun',
  ])) return 'reptile';

  return 'other';
}

function getPetAvatar(type?: string): ImageSourcePropType {
  return getDefaultPetImage(type);
}

/* =========================================================
   PETS SCREEN
========================================================= */

export default function PetsScreen() {
  const petContext = usePets();
  const {pets} = petContext;
  // PetContext dosyası paylaşılmadığından, mevcut silme fonksiyonu
  // yalnızca varsa çağrılır. Farklı bir API kullanıyorsan bağlamalısın.
  const deletePet = (petContext as typeof petContext & {
    deletePet?: (id: Pet['id']) => Promise<void> | void;
  }).deletePet;
  const insets = useSafeAreaInsets();
  const topInset = Math.max(insets.top, StatusBar.currentHeight ?? 0);

  const navigation = useNavigation<NavigationProp>();

  const [selectedFilter, setSelectedFilter] =
    useState<FilterType>('all');

  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false);
  const actionProgress = useRef(new Animated.Value(0)).current;

  // Tek bir native animasyon degeri buton tiklandigi anda baslatilir.
  // Kart basina useEffect beklenmez.
  const animateSelection = (active: boolean) => {
    actionProgress.stopAnimation();
    Animated.spring(actionProgress, {
      toValue: active ? 1 : 0,
      useNativeDriver: true,
      damping: 19,
      stiffness: 190,
      mass: 0.85,
    }).start();
  };

  const petList: Pet[] = pets || [];

  // Silinen ya da erişimi kaldırılan kayıtlar seçili kalmasın.
  useEffect(() => {
    const validIds = new Set(petList.map(pet => String(pet.id)));
    setSelectedIds(previous => previous.filter(id => validIds.has(id)));
  }, [pets]);

  const exitSelection = () => {
    animateSelection(false);
    setSelectionMode(false);
    setSelectedIds([]);
  };

  const toggleSelected = useCallback((id: string) => {
    if (deleting) return;
    setSelectedIds(previous =>
      previous.includes(id)
        ? previous.filter(item => item !== id)
        : [...previous, id],
    );
  }, [deleting]);

  const openPet = useCallback((pet: Pet) => {
    navigation.navigate('PetDetail', {pet});
  }, [navigation]);

  const confirmBulkDelete = () => {
    if (!selectedIds.length || deleting) return;
    if (!deletePet) {
      Alert.alert(
        'Silme işlemi bağlanamadı',
        'PetContext içindeki mevcut profil silme fonksiyonu bu ekrana bağlanmalı. Henüz hiçbir kayıt silinmedi.',
      );
      return;
    }

    Alert.alert(
      'Dostları sil?',
      `${selectedIds.length} dostun profilini silmek istediğine emin misin? Bu işlem geri alınamaz.`,
      [
        {text: 'Vazgeç', style: 'cancel'},
        {
          text: 'Profilleri Sil',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            let deletedCount = 0;
            try {
              // Mevcut tekli silme akışını kullan; ayrı bir Firebase yolu uydurma.
              for (const id of selectedIds) {
                await deletePet(id as Pet['id']);
                deletedCount += 1;
              }
              exitSelection();
            } catch (error) {
              const message = error instanceof Error ? error.message : 'Bilinmeyen hata';
              Alert.alert(
                'Silme tamamlanamadı',
                `${deletedCount} profil silindi. Kalanlar silinemedi. ${message}`,
              );
              setSelectedIds(previous => previous.slice(deletedCount));
            } finally {
              setDeleting(false);
            }
          },
        },
      ],
    );
  };

  const filteredPets = useMemo(() => {
    if (selectedFilter === 'all') {
      return petList;
    }

    return petList.filter(
      pet =>
        getPetCategory(pet.type) ===
        selectedFilter,
    );
  }, [petList, selectedFilter]);

  return (
    <View style={[styles.screen, {paddingTop: topInset}]}>
      <StatusBar
        translucent
        barStyle="dark-content"
        backgroundColor="transparent"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, {paddingTop: 16}]}>

        {/* =================================================
            TITLE
        ================================================= */}

        <View style={styles.pageTitleRow}>
          <Text style={styles.pageTitle}>Dostlarım</Text>
          {petList.length > 0 && (
            <Pressable
              onPress={() => navigation.navigate('PetJoin')}
              style={({pressed}) => [
                styles.joinSmallButton,
                pressed && styles.joinSmallButtonPressed,
              ]}>
              <Users size={17} color={C.purple} strokeWidth={2.1} />
              <Text style={styles.joinSmallText}>Kodla Katıl</Text>
            </Pressable>
          )}
        </View>

        {/* =================================================
            FILTERS
        ================================================= */}

        {petList.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}>

          {FILTERS.map(filter => {
            const selected =
              selectedFilter === filter.key;

            return (
              <Pressable
                key={filter.key}
                onPress={() =>
                  setSelectedFilter(filter.key)
                }
                style={({pressed}) => [
                  styles.filterButton,

                  selected &&
                    styles.filterButtonSelected,

                  pressed &&
                    styles.filterButtonPressed,
                ]}>

                {React.cloneElement(
                  filter.icon as React.ReactElement<any>,
                  {
                    color: selected
                      ? C.purple
                      : '#7E879F',

                    strokeWidth: selected
                      ? 2.3
                      : 1.8,
                  },
                )}

                <Text
                  style={[
                    styles.filterText,

                    selected &&
                      styles.filterTextSelected,
                  ]}>
                  {filter.label}
                </Text>

              </Pressable>
            );
          })}

        </ScrollView>
        )}

        {/* =================================================
            EMPTY STATE / PET LIST
        ================================================= */}

        {petList.length === 0 ? (
          <>
            <EmptyState
              onAdd={() =>
                navigation.navigate('AddPet')
              }
              onJoin={() =>
                navigation.navigate('PetJoin')
              }
            />

            <WhyAddPet />

          </>
        ) : (
          <>
            <View style={styles.petListToolbar}>
              <Text style={styles.petCount}>
                {selectionMode
                  ? `${selectedIds.length} seçildi`
                  : `${filteredPets.length} dost`}
              </Text>
              <View style={styles.petToolbarActions}>
                <Pressable
                  onPress={() =>
                    navigation.navigate('AddPet')
                  }
                  style={({pressed}) => [
                    styles.smallAddButton,

                    pressed &&
                      styles.smallAddButtonPressed,
                  ]}>

                  <Plus
                    size={18}
                    color={C.white}
                    strokeWidth={2.2}
                  />

                  <Text style={styles.smallAddText}>
                    Ekle
                  </Text>

                </Pressable>

              {filteredPets.length > 0 && (
                <Pressable
                  disabled={deleting}
                  hitSlop={10}
                  accessibilityRole="button"
                  accessibilityLabel={selectionMode ? 'Seçimden çık' : 'Dostları seç'}
                  onPress={() => {
                    if (selectionMode) exitSelection();
                    else {
                      animateSelection(true);
                      setSelectionMode(true);
                    }
                  }}
                  style={({pressed}) => [
                    styles.selectButton,
                    selectionMode && styles.selectButtonActive,
                    pressed && styles.selectButtonPressed,
                  ]}>
                  <Text style={styles.selectLabel}>
                    {selectionMode ? 'Vazgeç' : 'Seç'}
                  </Text>
                </Pressable>
              )}
              </View>
            </View>

            {filteredPets.length > 0 ? (
              <View style={styles.petGrid}>

                {filteredPets.map(pet => (
                  <PetCard
                    key={pet.id}
                    pet={pet}
                     selectionMode={selectionMode}
                     progress={actionProgress}
                     selected={selectedIds.includes(String(pet.id))}
                     onSelect={toggleSelected}
                     onOpen={openPet}
                   />
                ))}

              </View>
            ) : (
              <View style={styles.filterEmpty}>

                <View style={styles.filterEmptyIcon}>
                  <PawPrint
                    size={31}
                    color={C.purple}
                  />
                </View>

                <Text style={styles.filterEmptyTitle}>
                  Bu kategoride dost yok
                </Text>

                <Text style={styles.filterEmptyText}>
                  Başka bir kategori seçebilir veya
                  yeni bir dost ekleyebilirsin.
                </Text>

              </View>
            )}
          </>
        )}

       </ScrollView>

       {petList.length > 0 && (
         <Animated.View
           pointerEvents={selectionMode ? 'auto' : 'none'}
           style={[
             styles.bulkActionContainer,
             {bottom: Math.max(insets.bottom, 10) + 78},
             {
               opacity: actionProgress,
               transform: [{translateY: actionProgress.interpolate({
                 inputRange: [0, 1], outputRange: [32, 0],
               })}],
             },
           ]}>
           <Pressable
             disabled={deleting}
             onPress={() => {
               const visibleIds = filteredPets.map(pet => String(pet.id));
               const allVisibleSelected = visibleIds.every(id => selectedIds.includes(id));
               setSelectedIds(previous => allVisibleSelected
                 ? previous.filter(id => !visibleIds.includes(id))
                 : [...new Set([...previous, ...visibleIds])]);
             }}
             style={styles.selectAllButton}>
             <Text style={styles.selectAllLabel}>
               {filteredPets.length > 0 && filteredPets.every(pet => selectedIds.includes(String(pet.id)))
                 ? 'Seçimi kaldır' : 'Tümünü seç'}
             </Text>
           </Pressable>
           <Pressable
             disabled={!selectedIds.length || deleting}
             onPress={confirmBulkDelete}
             style={[styles.deleteSelectedButton, (!selectedIds.length || deleting) && styles.deleteDisabled]}>
             <Trash2 size={17} color={C.white} strokeWidth={2} />
             <Text style={styles.deleteSelectedText}>
               {deleting ? 'Siliniyor...' : `Sil (${selectedIds.length})`}
             </Text>
           </Pressable>
         </Animated.View>
       )}
     </View>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({
  onAdd,
  onJoin,
}: {
  onAdd: () => void;
  onJoin: () => void;
}) {
  return (
    <View style={styles.emptyCard}>

      {/* BACKGROUND BLOBS */}

      <View style={styles.blobOne} />
      <View style={styles.blobTwo} />
      <View style={styles.blobThree} />

      {/* HERO IMAGE */}

      <View style={styles.heroImageContainer}>
        <Image
          source={require(
            '../assets/images/pets/pets-empty-hero.png'
          )}
          style={styles.heroImage}
          resizeMode="contain"
        />
      </View>

      {/* TITLE */}

      <Text style={styles.emptyTitle}>
        Henüz bir dost eklemedin
      </Text>

      {/* DESCRIPTION */}

      <Text style={styles.emptyDescription}>
        Dostunu ekleyerek onun bakım bilgilerini,
        sağlık kayıtlarını ve en özel anlarını tek
        yerde saklayabilirsin.
      </Text>

      {/* ADD BUTTON */}

      <Pressable
        onPress={onAdd}
        android_ripple={{
          color: 'rgba(255,255,255,0.15)',
        }}
        style={({pressed}) => [
          styles.addButton,

          pressed &&
            styles.addButtonPressed,
        ]}>

        <View style={styles.addButtonIcon}>
          <Plus
            size={24}
            color={C.white}
            strokeWidth={1.8}
          />
        </View>

        <Text style={styles.addButtonText}>
          İlk Dostunu Ekle
        </Text>

      </Pressable>

      <Pressable
        onPress={onJoin}
        style={({pressed}) => [
          styles.joinEmptyButton,
          pressed &&
            styles.joinEmptyButtonPressed,
        ]}>

        <Users
          size={20}
          color={C.purple}
          strokeWidth={2}
        />

        <Text style={styles.joinEmptyButtonText}>
          Davet Kodu ile Katıl
        </Text>

      </Pressable>

    </View>
  );
}

/* =========================================================
   WHY ADD PET
========================================================= */

function WhyAddPet() {
  return (
    <View style={styles.whySection}>

      <Text style={styles.whyTitle}>
        Neden dost eklemelisin?
      </Text>

      <View style={styles.benefitRow}>

        <BenefitCard
          icon={
            <Heart
              size={27}
              color={C.pink}
              strokeWidth={2}
            />
          }
          iconBackground={C.pinkSoft}
          title="Her an yanında"
          description={
            'Tüm önemli bilgiler\ntek yerde.'
          }
        />

        <BenefitCard
          icon={
            <CalendarDays
              size={27}
              color={C.green}
              strokeWidth={2}
            />
          }
          iconBackground={C.greenSoft}
          title="Rutinleri kaçırma"
          description={
            'Aşı, mama ve bakım\ntakibini kolayca yap.'
          }
        />

        <BenefitCard
          icon={
            <Images
              size={27}
              color={C.purple}
              strokeWidth={2}
            />
          }
          iconBackground={C.purpleSoft}
          title="Anıları biriktir"
          description={
            'Fotoğraflarını sakla,\nbüyüme yolculuğunu izle.'
          }
        />

      </View>

    </View>
  );
}

/* =========================================================
   BENEFIT CARD
========================================================= */

function BenefitCard({
  icon,
  iconBackground,
  title,
  description,
}: {
  icon: React.ReactNode;
  iconBackground: string;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.benefitCard}>

      <View
        style={[
          styles.benefitIcon,
          {
            backgroundColor:
              iconBackground,
          },
        ]}>

        {icon}

      </View>

      <Text style={styles.benefitTitle}>
        {title}
      </Text>

      <Text style={styles.benefitDescription}>
        {description}
      </Text>

    </View>
  );
}

/* =========================================================
   PET CARD
========================================================= */

const PetCard = React.memo(function PetCard({
  pet,
  onSelect,
  onOpen,
  selectionMode,
  progress,
  selected,
}: {
  pet: Pet;
  onSelect: (id: string) => void;
  onOpen: (pet: Pet) => void;
  selectionMode: boolean;
  progress: Animated.Value;
  selected: boolean;
}) {
  // Tik icin yay animasyonu kullanma: dokunuldugu anda guncelle.
  // State tumunu sec / secimi kaldir islemlerinin tek dogruluk kaynagidir.
  const selectedProgress = useRef(new Animated.Value(selected ? 1 : 0)).current;
  const touchTarget = useRef(selected);

  useEffect(() => {
    touchTarget.current = selected;
    selectedProgress.stopAnimation();
    selectedProgress.setValue(selected ? 1 : 0);
  }, [selected, selectedProgress]);

  const previewToggle = () => {
    if (!selectionMode) return;
    const next = !touchTarget.current;
    touchTarget.current = next;
    selectedProgress.stopAnimation();
    selectedProgress.setValue(next ? 1 : 0);
    // Gorsel tepki ve gercek secim AYNI dokunmada yapilir.
    onSelect(String(pet.id));
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${pet.name}, ${selected ? 'seçili' : 'seçili değil'}`}
      onPressIn={previewToggle}
      onPress={() => { if (!selectionMode) onOpen(pet); }}
      style={({pressed}) => [
        styles.petCard,
        // Secili kart vurgusu artik animated overlay ile dokunma aninda guncellenir.
        // Secim modunda Pressable scale geri bildirimi gec tetiklenebiliyor.
        // Tik zaten aninda tepki verdigi icin karti gecikmeli kucultmeyelim.
        !selectionMode && pressed && styles.petCardPressed,
      ]}>

      {/* Mor arka plan ve cerceve, tik ile AYNI Animated.Value kullanir.
          Boylece React'in sonraki render'ini beklemeden guncellenir. */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.petSelectedOverlay,
          {opacity: selectedProgress},
        ]}
      />

      <Animated.View
        pointerEvents="none"
        style={[
          styles.petCheckboxPosition,
          {
            opacity: progress,
            transform: [
              {translateX: progress.interpolate({inputRange: [0, 1], outputRange: [-12, 0]})},
              {scale: progress.interpolate({inputRange: [0, 1], outputRange: [0.65, 1]})},
            ],
          },
        ]}>
        <View style={styles.petCheckbox}>
          <Animated.View
            style={[
              styles.petCheckboxFill,
              {
                opacity: selectedProgress,
                transform: [{scale: selectedProgress}],
              },
            ]}>
            <Check size={15} color={C.white} strokeWidth={3} />
          </Animated.View>
        </View>
      </Animated.View>

      <Animated.View
        style={[styles.petMainContent, {
          transform: [{translateX: progress.interpolate({inputRange: [0, 1], outputRange: [0, 33]})}],
        }]}>
        <View style={styles.petAvatar}>
          {pet.photoUrl || pet.photoUri ? (
            <Image
              source={{uri: pet.photoUrl || pet.photoUri}}
              style={styles.petAvatarImage}
              resizeMode="cover"
            />
          ) : (
            <Image
              source={getPetAvatar(pet.type)}
              style={styles.petAvatarImage}
              resizeMode="contain"
            />
          )}
        </View>

        <View style={styles.petInfo}>
          <Text numberOfLines={1} style={styles.petName}>{pet.name}</Text>
          <Text numberOfLines={1} style={styles.petMeta}>
            {pet.type}{pet.age ? ` • ${pet.age} yaş` : ''}
          </Text>
        </View>
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        style={[styles.petArrow, {
          opacity: progress.interpolate({inputRange: [0, 0.55, 1], outputRange: [1, 0, 0]}),
          transform: [{scale: progress.interpolate({inputRange: [0, 1], outputRange: [1, 0.7]})}],
        }]}>
        <ChevronRight size={19} color={C.purple} strokeWidth={2} />
      </Animated.View>
    </Pressable>
  );
});

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({

  /* =====================================================
     SCREEN
  ===================================================== */

  screen: {
    flex: 1,
    backgroundColor: C.bg,
  },

  content: {
    paddingHorizontal: 18,
    paddingBottom: 125,
  },

  /* =====================================================
     TITLE
  ===================================================== */

  pageTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 21,
    gap: 10,
  },

  pageTitle: {
    fontSize: 34,
    lineHeight: 41,

    fontFamily: F.bold,

    color: C.text,

    letterSpacing: -1.2,
  },

  /* =====================================================
     FILTERS
  ===================================================== */

  filters: {
    gap: 8,

    paddingRight: 8,

    marginBottom: 23,
  },

  filterButton: {
    height: 48,

    paddingHorizontal: 15,

    borderRadius: 24,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',

    gap: 7,

    backgroundColor: '#F8F7FC',
  },

  filterButtonSelected: {
    backgroundColor: C.purpleSoft,
  },

  filterButtonPressed: {
    opacity: 0.75,

    transform: [
      {
        scale: 0.96,
      },
    ],
  },

  filterText: {
    fontSize: 13,

    fontFamily: F.semiBold,

    color: '#7E879F',
  },

  filterTextSelected: {
    color: C.purple,
  },

  /* =====================================================
     EMPTY CARD
  ===================================================== */

  emptyCard: {
    width: '100%',

    minHeight: 555,

    borderRadius: 27,

    backgroundColor: '#FCFBFF',

    borderWidth: 1,
    borderColor: '#EEE9FB',

    alignItems: 'center',

    overflow: 'hidden',

    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 27,

    shadowColor: '#453886',

    shadowOffset: {
      width: 0,
      height: 8,
    },

    shadowOpacity: 0.06,
    shadowRadius: 18,

    elevation: 3,
  },

  blobOne: {
    position: 'absolute',

    width: 220,
    height: 160,

    borderRadius: 100,

    backgroundColor: '#F0EBFF',

    top: 18,
    left: 75,

    transform: [
      {
        rotate: '-10deg',
      },
    ],
  },

  blobTwo: {
    position: 'absolute',

    width: 180,
    height: 140,

    borderRadius: 90,

    backgroundColor: '#F5F1FF',

    top: 45,
    right: -55,
  },

  blobThree: {
    position: 'absolute',

    width: 190,
    height: 130,

    borderRadius: 90,

    backgroundColor: '#F7F4FF',

    top: 95,
    left: -70,
  },

  /* =====================================================
     HERO IMAGE
  ===================================================== */

  heroImageContainer: {
    width: '113%',
    height: 300,

    justifyContent: 'flex-end',
    alignItems: 'center',

    zIndex: 3,

    marginBottom: -2,
  },

  heroImage: {
    width: '100%',
    height: '100%',
  },

  /* =====================================================
     EMPTY TEXT
  ===================================================== */

  emptyTitle: {
    fontSize: 23,
    lineHeight: 29,

    fontFamily: F.bold,

    color: C.text,

    textAlign: 'center',

    letterSpacing: -0.5,

    zIndex: 4,
  },

  emptyDescription: {
    fontSize: 13.5,
    lineHeight: 20,

    fontFamily: F.regular,

    color: C.secondary,

    textAlign: 'center',

    maxWidth: 315,

    marginTop: 7,

    zIndex: 4,
  },

  /* =====================================================
     MAIN ADD BUTTON
  ===================================================== */

  addButton: {
    width: '68%',
    minWidth: 240,

    height: 58,

    borderRadius: 29,

    backgroundColor: C.purple,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',

    gap: 13,

    marginTop: 23,

    overflow: 'hidden',

    shadowColor: C.purple,

    shadowOffset: {
      width: 0,
      height: 8,
    },

    shadowOpacity: 0.22,
    shadowRadius: 15,

    elevation: 6,
  },

  addButtonPressed: {
    backgroundColor: C.purpleDark,

    opacity: 0.92,

    transform: [
      {
        scale: 0.97,
      },
    ],

    shadowOpacity: 0.12,
    shadowRadius: 7,

    elevation: 3,
  },

  addButtonIcon: {
    width: 30,
    height: 30,

    borderRadius: 15,

    borderWidth: 1.6,
    borderColor: C.white,

    alignItems: 'center',
    justifyContent: 'center',
  },

  addButtonText: {
    fontSize: 17,

    fontFamily: F.medium,

    color: C.white,
  },

  joinEmptyButton: {
    width: '68%',
    minWidth: 240,
    height: 52,
    borderRadius: 26,

    backgroundColor: C.purpleSoft,

    borderWidth: 1,
    borderColor: C.purpleSoft2,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 9,

    marginTop: 10,
  },

  joinEmptyButtonPressed: {
    opacity: 0.75,

    transform: [
      {
        scale: 0.97,
      },
    ],
  },

  joinEmptyButtonText: {
    fontSize: 14.5,
    fontFamily: F.semiBold,
    color: C.purple,
  },

  /* =====================================================
     WHY SECTION
  ===================================================== */

  whySection: {
    marginTop: 50,
  },

  whyTitle: {
    fontSize: 22,
    lineHeight: 28,

    fontFamily: F.bold,

    color: C.text,

    letterSpacing: -0.5,

    marginBottom: 13,
  },

  benefitRow: {
    flexDirection: 'row',
    gap: 9,
  },

  /* =====================================================
     BENEFIT CARDS
  ===================================================== */

  benefitCard: {
    flex: 1,

    minHeight: 180,

    borderRadius: 22,

    backgroundColor: C.white,

    paddingHorizontal: 12,
    paddingVertical: 15,

    borderWidth: 1,
    borderColor: '#F0EDF6',

    shadowColor: '#272047',

    shadowOffset: {
      width: 0,
      height: 6,
    },

    shadowOpacity: 0.04,
    shadowRadius: 12,

    elevation: 2,
  },

  benefitIcon: {
    width: 52,
    height: 52,

    borderRadius: 16,

    alignItems: 'center',
    justifyContent: 'center',

    marginBottom: 14,
  },

  benefitTitle: {
    fontSize: 14,
    lineHeight: 18,

    fontFamily: F.bold,

    color: C.text,

    marginBottom: 6,
  },

  benefitDescription: {
    fontSize: 11.5,
    lineHeight: 16,

    fontFamily: F.regular,

    color: C.secondary,
  },

  /* =====================================================
     PET LIST HEADER
  ===================================================== */

  petToolbarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  petListToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 34,
    marginBottom: 10,
  },
  selectButton: {
    paddingHorizontal: 14,
    height: 43,
    borderRadius: 22,
    backgroundColor: C.purpleSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectButtonActive: {
    backgroundColor: '#E9E1FF',
  },
  selectButtonPressed: { opacity: 0.72 },
  selectLabel: { fontSize: 12, fontFamily: F.bold, color: C.purple },
  petCount: {
    fontSize: 12,

    fontFamily: F.regular,

    color: C.secondary,

    marginTop: 3,
  },

  smallAddButton: {
    height: 43,

    paddingHorizontal: 14,

    borderRadius: 22,

    backgroundColor: C.purple,

    flexDirection: 'row',

    alignItems: 'center',

    gap: 6,
  },

  smallAddButtonPressed: {
    backgroundColor: C.purpleDark,

    opacity: 0.9,

    transform: [
      {
        scale: 0.96,
      },
    ],
  },

  smallAddText: {
    fontSize: 12.5,

    fontFamily: F.semiBold,

    color: C.white,
  },

  petHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  joinSmallButton: {
    height: 43,
    paddingHorizontal: 12,
    borderRadius: 22,
    backgroundColor: C.purpleSoft,
    borderWidth: 1,
    borderColor: C.purpleSoft2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },

  joinSmallButtonPressed: {
    opacity: 0.78,
    transform: [
      {
        scale: 0.96,
      },
    ],
  },

  joinSmallText: {
    fontSize: 11.5,
    fontFamily: F.semiBold,
    color: C.purple,
  },

  /* =====================================================
     PET CARDS
  ===================================================== */

  petGrid: {
    gap: 12,
  },

  petCard: {
    minHeight: 96,

    borderRadius: 22,

    backgroundColor: C.white,

    paddingHorizontal: 14,
    paddingVertical: 12,

    flexDirection: 'row',

    alignItems: 'center',

    borderWidth: 1,
    borderColor: C.border,

    shadowColor: '#322760',

    shadowOffset: {
      width: 0,
      height: 5,
    },

    shadowOpacity: 0.05,
    shadowRadius: 12,

    elevation: 2,
  },

  petCardSelected: { borderColor: '#C8BBFF', backgroundColor: '#FCFAFF' },
  petSelectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#C8BBFF',
    backgroundColor: 'rgba(113, 87, 244, 0.025)',
  },
  petMainContent: { flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center' },
  petCheckboxPosition: { position: 'absolute', left: 16, top: 0, bottom: 0, justifyContent: 'center' },
  petCheckbox: { width: 23, height: 23, borderRadius: 12, borderWidth: 1.7, borderColor: '#C3B8E9', alignItems: 'center', justifyContent: 'center', backgroundColor: C.white },
  petCheckboxSelected: { borderColor: C.purple, backgroundColor: C.purple },
  petCheckboxFill: { position: 'absolute', top: -1.7, bottom: -1.7, left: -1.7, right: -1.7, borderRadius: 12, backgroundColor: C.purple, alignItems: 'center', justifyContent: 'center' },
  bulkActionContainer: { position: 'absolute', left: 18, right: 18, borderRadius: 23, padding: 10, backgroundColor: C.white, borderWidth: 1, borderColor: C.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: '#322760', shadowOpacity: 0.13, shadowRadius: 18, shadowOffset: {width: 0, height: 8}, elevation: 8 },
  selectAllButton: {paddingHorizontal: 13, paddingVertical: 12},
  selectAllLabel: {fontFamily: F.semiBold, fontSize: 13, color: C.purple},
  deleteSelectedButton: {backgroundColor: '#E34C69', borderRadius: 17, paddingVertical: 12, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 8},
  deleteDisabled: {opacity: 0.4},
  deleteSelectedText: {color: C.white, fontFamily: F.bold, fontSize: 13},
  petCardPressed: {
    opacity: 0.84,

    transform: [
      {
        scale: 0.985,
      },
    ],
  },

  petAvatar: {
    width: 68,
    height: 68,

    borderRadius: 22,

    backgroundColor: C.purpleSoft,

    alignItems: 'center',
    justifyContent: 'center',

    overflow: 'hidden',

    marginRight: 13,
  },

  petAvatarBlob: {
    position: 'absolute',

    width: 55,
    height: 55,

    borderRadius: 30,

    backgroundColor: '#E2D8FF',

    right: -15,
    bottom: -15,
  },

  petAvatarImage: {
    width: '100%',
    height: '100%',
  },

  petEmoji: {
    fontSize: 40,
  },

  petInfo: {
    flex: 1,
  },

  petName: {
    fontSize: 17,

    fontFamily: F.bold,

    color: C.text,
  },

  petMeta: {
    fontSize: 12,

    fontFamily: F.regular,

    color: C.secondary,

    marginTop: 4,
  },

  petArrow: {
    width: 34,
    height: 34,

    borderRadius: 17,

    backgroundColor: C.purpleSoft,

    alignItems: 'center',
    justifyContent: 'center',
  },

  /* =====================================================
     FILTER EMPTY
  ===================================================== */

  filterEmpty: {
    minHeight: 300,

    borderRadius: 26,

    backgroundColor: C.white,

    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 25,

    borderWidth: 1,
    borderColor: C.border,
  },

  filterEmptyIcon: {
    width: 70,
    height: 70,

    borderRadius: 35,

    backgroundColor: C.purpleSoft,

    alignItems: 'center',
    justifyContent: 'center',

    marginBottom: 15,
  },

  filterEmptyTitle: {
    fontSize: 18,

    fontFamily: F.bold,

    color: C.text,
  },

  filterEmptyText: {
    fontSize: 13,
    lineHeight: 19,

    fontFamily: F.regular,

    color: C.secondary,

    textAlign: 'center',

    marginTop: 7,

    maxWidth: 260,
  },
});

