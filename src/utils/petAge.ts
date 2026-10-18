
/** Shared age calculations. Supports existing birthYear-only documents. */
export type PetBirthInfo = {
  birthDate?: string;
  birthDatePrecision?: 'day' | 'month' | 'year';
  birthYear?: number;
  age?: number;
};

export function getPetAgeParts(pet: PetBirthInfo, today = new Date()) {
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const value = String(pet.birthDate || '').trim();
  const precision = pet.birthDatePrecision;
  let birthYear: number | undefined;
  let birthMonth: number | undefined;
  let birthDay: number | undefined;

  if (precision === 'day') {
    const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value);
    if (match) {
      birthDay = Number(match[1]);
      birthMonth = Number(match[2]);
      birthYear = Number(match[3]);
      const valid = new Date(birthYear, birthMonth - 1, birthDay);
      if (
        valid.getFullYear() !== birthYear ||
        valid.getMonth() + 1 !== birthMonth ||
        valid.getDate() !== birthDay
      ) {
        birthYear = undefined;
      }
    }
  } else if (precision === 'month') {
    const match = /^(\d{2})\.(\d{4})$/.exec(value);
    if (match) {
      birthMonth = Number(match[1]);
      birthYear = Number(match[2]);
      if (birthMonth < 1 || birthMonth > 12) {
        birthYear = undefined;
      }
    }
  } else if (precision === 'year' && /^\d{4}$/.test(value)) {
    birthYear = Number(value);
  }

  if (birthYear !== undefined && (birthYear < 1900 || birthYear > year)) {
    birthYear = undefined;
  }

  if (
    birthYear === undefined &&
    typeof pet.birthYear === 'number' &&
    pet.birthYear >= 1900 &&
    pet.birthYear <= year
  ) {
    birthYear = pet.birthYear;
    birthMonth = undefined;
    birthDay = undefined;
  }

  if (birthYear === undefined) {
    return {
      years: Math.max(0, Math.floor(pet.age || 0)),
      months: 0,
      precise: false,
    };
  }

  if (birthMonth === undefined) {
    return {
      years: Math.max(0, year - birthYear),
      months: 0,
      precise: false,
    };
  }

  let totalMonths = (year - birthYear) * 12 + (month - birthMonth);

  if (birthDay !== undefined && day < birthDay) {
    totalMonths -= 1;
  }

  totalMonths = Math.max(0, totalMonths);

  return {
    years: Math.floor(totalMonths / 12),
    months: totalMonths % 12,
    precise: true,
  };
}

export function formatPetAge(pet: PetBirthInfo, today = new Date()) {
  const {years, months, precise} = getPetAgeParts(pet, today);

  if (!precise) {
    return `${years} yaş`;
  }

  if (years === 0) {
    return months === 0 ? '1 aydan küçük' : `${months} aylık`;
  }

  return months
    ? `${years} yaş ${months} aylık`
    : `${years} yaş`;
}

/** Approximate month/year birth date for an age manually entered in the edit form. */
export function birthFromAgeParts(
  years: number,
  months: number,
  today = new Date(),
) {
  const total = years * 12 + months;
  const date = new Date(
    today.getFullYear(),
    today.getMonth() - total,
    1,
  );

  return {
    birthYear: date.getFullYear(),
    birthDate: `${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`,
    birthDatePrecision: 'month' as const,
  };
}
