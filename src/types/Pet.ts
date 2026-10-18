
export type WeightRecord = {
  id: string;

  /**
   * Ölçülen kilo değeri.
   * Örn: 4.25
   */
  weight: number;

  /**
   * Ölçümün yapıldığı tarih.
   * Örn: 2026-09-23T12:30:00.000Z
   */
  date: string;

  /**
   * Kilo kaydına eklenen isteğe bağlı açıklama.
   */
  note?: string;
};

export type Pet = {
  id: string;

  /**
   * Pet profilini oluşturan kullanıcının UID'si.
   * Eski kayıtlarla uyumluluk için korunur.
   */
  ownerId?: string;

  /**
   * Pet profiline erişebilen aile üyelerinin UID'leri.
   */
  petMembers?: string[];

  name: string;
  type: string;

  /**
   * Doğum yılı.
   *
   * Eski Firebase kayıtlarıyla uyumluluk için korunur.
   * Örn: 2026
   */
  birthYear?: number;

  /**
   * Dostun doğum tarihi.
   *
   * Tam tarih: 18.07.2026
   * Ay / Yıl: 07.2026
   * Yalnızca yıl: 2026
   */
  birthDate?: string;

  /**
   * Doğum tarihinin kesinlik düzeyi.
   *
   * day   = Gün / Ay / Yıl
   * month = Ay / Yıl
   * year  = Yalnızca yıl
   */
  birthDatePrecision?: 'day' | 'month' | 'year';

  /**
   * Eski sistemden gelen yaş bilgisi.
   *
   * Yeni sistemde yaş, doğum tarihinden hesaplanır.
   * Geriye dönük uyumluluk için tutulur.
   */
  age?: number;

  gender?: string;

  /**
   * Güncel kilo.
   *
   * Mevcut Firebase yapısıyla uyumluluk için
   * string olarak tutulmaya devam eder.
   */
  weight?: string;

  /**
   * Geçmiş kilo kayıtları.
   */
  weightHistory?: WeightRecord[];

  /**
   * Sağlık bilgileri.
   */
  vaccines?: string;
  lastVetVisit?: string;
  notes?: string;

  healthStatus?: string;
  medications?: string;
  allergies?: string;
  healthNotes?: string;

  /**
   * Profil fotoğrafı bilgileri.
   */
  photoUrl?: string;
  photoUri?: string;

  /**
   * Firebase kayıt zamanları.
   */
  createdAt?: any;
  updatedAt?: any;
};
