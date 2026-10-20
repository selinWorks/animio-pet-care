export type PetType = {
  name: string;
  image: any;
  bgGradient: string[];
  badgeColor: string;
};

export const PET_TYPES: PetType[] = [
  {
    name: 'Kedi',
    image: require('../assets/images/pets/default-cat-pixel.png'),
    bgGradient: ['#E6E0FF', '#D6CBFF'],
    badgeColor: '#7C3AED',
  },
  {
    name: 'Köpek',
    image: require('../assets/images/pets/default-dog-pixel.png'),
    bgGradient: ['#FFE4E6', '#FECDD3'],
    badgeColor: '#FF7675',
  },
  {
    name: 'Kuş',
    image: require('../assets/images/pets/default-bird-pixel.png'),
    bgGradient: ['#FEF3C7', '#FDE68A'],
    badgeColor: '#FDCB6E',
  },
  {
    name: 'Kemirgen',
    image: require('../assets/images/pets/default-hamster-pixel.png'),
    bgGradient: ['#FDEBD0', '#F8D9B0'],
    badgeColor: '#C98A4B',
  },
  {
    name: 'Tavşan',
    image: require('../assets/images/pets/default-rabbit-pixel.png'),
    bgGradient: ['#F3E8FF', '#E9D5FF'],
    badgeColor: '#A855F7',
  },
  {
    name: 'Balık',
    image: require('../assets/images/pets/default-fish-pixel.png'),
    bgGradient: ['#DBEAFE', '#BFDBFE'],
    badgeColor: '#3B82F6',
  },
  {
    name: 'Sürüngen',
    image: require('../assets/images/pets/default-reptile-pixel.png'),
    bgGradient: ['#DCFCE7', '#BBF7D0'],
    badgeColor: '#22C55E',
  },
];

export const ANIMAL_SUBTYPES: Record<string, string[]> = {
  Kedi: [
    'British Shorthair',
    'Scottish Fold',
    'Siyam',
    'İran Kedisi',
    'Maine Coon',
    'Ragdoll',
    'Van Kedisi',
    'Tekir',
    'Sfenks',
    'Bengal',
    'Birman',
    'Abyssinian',
    'Diğer',
  ],

  Köpek: [
    'Golden Retriever',
    'Labrador Retriever',
    'Alman Kurdu',
    'French Bulldog',
    'Poodle',
    'Chihuahua',
    'Beagle',
    'Husky',
    'Pomeranian',
    'Rottweiler',
    'Cocker Spaniel',
    'Dachshund',
    'Maltese',
    'Shih Tzu',
    'Border Collie',
    'Diğer',
  ],

  Kuş: [
    'Muhabbet Kuşu',
    'Papağan',
    'Kanarya',
    'Sultan Papağanı',
    'Sevda Papağanı',
    'İspinoz',
    'Güvercin',
    'Serçe',
    'Bülbül',
    'Hint Bülbülü',
    'Diğer',
  ],

  Kemirgen: [
    'Hamster',
    'Kobay',
    'Çinçilla',
    'Fare',
    'Sıçan',
    'Gerbil',
    'Diğer',
  ],

  Tavşan: [
    'Tavşan',
  ],

  Balık: [
    'Japon Balığı',
    'Beta',
    'Lepistes',
    'Melek Balığı',
    'Koi',
    'Çöpçü Balığı',
    'Neon Tetra',
    'Moli',
    'Plati',
    'Diğer',
  ],

  Sürüngen: [
    'Kaplumbağa',
    'Yılan',
    'Kertenkele',
    'İguana',
    'Geko',
    'Sakallı Ejder',
    'Bukalemun',
    'Diğer',
  ],
};