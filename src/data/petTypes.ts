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


const normalizePetType = (type?: string): string =>
  (type || '').toLocaleLowerCase('tr-TR').trim();

export function getMainAnimalType(type?: string): string {
  const value = normalizePetType(type);

  for (const [mainType, subtypes] of Object.entries(ANIMAL_SUBTYPES)) {
    if (normalizePetType(mainType) === value) {
      return mainType;
    }

    if (subtypes.some(sub => normalizePetType(sub) === value)) {
      return mainType;
    }
  }

  return '';
}

export function getDefaultPetImage(type?: string) {
  const value = normalizePetType(type);
  const mainType = getMainAnimalType(type);

  if (mainType === 'Kedi' || value.includes('kedi') || value.includes('cat')) {
    return require('../assets/images/pets/default-cat-pixel.png');
  }

  if (
    mainType === 'Köpek' ||
    value.includes('köpek') ||
    value.includes('kopek') ||
    value.includes('dog')
  ) {
    return require('../assets/images/pets/default-dog-pixel.png');
  }

  if (
    mainType === 'Kuş' ||
    value.includes('kuş') ||
    value.includes('kus') ||
    value.includes('bird') ||
    value.includes('tavuk') ||
    value.includes('horoz')
  ) {
    return require('../assets/images/pets/default-bird-pixel.png');
  }

  if (
    mainType === 'Tavşan' ||
    value.includes('tavşan') ||
    value.includes('tavsan') ||
    value.includes('rabbit')
  ) {
    return require('../assets/images/pets/default-rabbit-pixel.png');
  }

  if (mainType === 'Kemirgen' || value.includes('hamster')) {
    return require('../assets/images/pets/default-hamster-pixel.png');
  }

  if (
    mainType === 'Balık' ||
    value.includes('balık') ||
    value.includes('balik') ||
    value.includes('fish')
  ) {
    return require('../assets/images/pets/default-fish-pixel.png');
  }

  if (
    value.includes('amfibi') ||
    value.includes('kurbağa') ||
    value.includes('kurbaga') ||
    value.includes('semender') ||
    value.includes('aksolotl')
  ) {
    return require('../assets/images/pets/default-amfibi-pixel-head.png');
  }

  if (
    mainType === 'Sürüngen' ||
    value.includes('sürüngen') ||
    value.includes('surungen') ||
    value.includes('kaplumbağa') ||
    value.includes('kaplumbaga') ||
    value.includes('yılan') ||
    value.includes('yilan') ||
    value.includes('kertenkele') ||
    value.includes('iguana') ||
    value.includes('geko') ||
    value.includes('bukalemun')
  ) {
    return require('../assets/images/pets/default-reptile-pixel.png');
  }

  if (value.includes('inek') || value.includes('cow')) {
    return require('../assets/images/pets/default-cow-pixel.png');
  }

  return require('../assets/images/pets/default-other-pixel.png');
}
