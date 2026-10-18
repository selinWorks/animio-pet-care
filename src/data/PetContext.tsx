
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import {Pet} from '../types/Pet';

import {
  getPetsFromFirestore,
  deletePetFromFirestore,
  updatePetInFirestore,
} from '../services/firestore';

import {useAuth} from './AuthContext';

type PetContextType = {
  pets: Pet[];
  addPet: (pet: Pet) => void;
  removePet: (
    id: string,
    newOwnerId?: string,
  ) => Promise<void>;
  deletePet: (id: string) => Promise<void>;
  updatePet: (updatedPet: Pet) => Promise<void>;
  reloadPets: () => Promise<void>;
};

const PetContext = createContext<PetContextType | undefined>(
  undefined,
);

export const PetProvider: React.FC<{
  children: React.ReactNode;
}> = ({children}) => {
  const {user} = useAuth();

  const [pets, setPets] = useState<Pet[]>([]);

  // FIREBASE'DEN HAYVANLARI YÜKLE
  const loadPets = useCallback(async () => {
    if (!user?.uid) {
      setPets([]);
      return;
    }

    try {
      const data = await getPetsFromFirestore(user.uid);
      setPets(data as Pet[]);
    } catch (error) {
      console.log('Petler yüklenemedi:', error);
    }
  }, [user?.uid]);

  useEffect(() => {
    loadPets();
  }, [loadPets]);

  // HAYVAN EKLE
  const addPet = useCallback((pet: Pet) => {
    setPets(prev => {
      const existingIndex = prev.findIndex(
        item => item.id === pet.id,
      );

      if (existingIndex !== -1) {
        return prev.map(item =>
          item.id === pet.id ? {...item, ...pet} : item,
        );
      }

      return [...prev, pet];
    });
  }, []);

  // AİLEDEN AYRIL / ÜYELİKTEN ÇIK
  const removePet = async (
    id: string,
    newOwnerId?: string,
  ) => {
    if (!user?.uid) {
      throw new Error('Kullanıcı oturumu bulunamadı.');
    }

    try {
      await deletePetFromFirestore(
        id,
        user.uid,
        newOwnerId ?? null,
      );

      setPets(prev =>
        prev.filter(pet => pet.id !== id),
      );
    } catch (error) {
      console.log(
        'Pet üyeliğinden ayrılma hatası:',
        error,
      );
      throw error;
    }
  };

  // HAYVANI TAMAMEN SİL
  const deletePet = async (id: string) => {
    if (!user?.uid) {
      throw new Error('Kullanıcı oturumu bulunamadı.');
    }

    try {
      await deletePetFromFirestore(
        id,
        user.uid,
        null,
        true,
      );

      setPets(prev =>
        prev.filter(pet => pet.id !== id),
      );
    } catch (error) {
      console.log('Dost silme hatası:', error);
      throw error;
    }
  };

  // HAYVAN BİLGİLERİNİ GÜNCELLE
  const updatePet = async (updatedPet: Pet) => {
    if (!user?.uid) {
      throw new Error('Kullanıcı oturumu bulunamadı.');
    }

    try {
      await updatePetInFirestore(
        updatedPet,
        user.uid,
      );

      setPets(prev =>
        prev.map(pet => {
          if (pet.id !== updatedPet.id) {
            return pet;
          }

          const memberIds = new Set([
            ...(updatedPet.petMembers ??
              pet.petMembers ??
              []),
            user.uid,
          ]);

          return {
            ...pet,
            ...updatedPet,
            petMembers: Array.from(memberIds),
          };
        }),
      );
    } catch (error) {
      console.log('Güncelleme hatası:', error);
      throw error;
    }
  };

  return (
    <PetContext.Provider
      value={{
        pets,
        addPet,
        removePet,
        deletePet,
        updatePet,
        reloadPets: loadPets,
      }}>
      {children}
    </PetContext.Provider>
  );
};

export const usePets = () => {
  const context = useContext(PetContext);

  if (!context) {
    throw new Error(
      'usePets must be used within PetProvider',
    );
  }

  return context;
};
