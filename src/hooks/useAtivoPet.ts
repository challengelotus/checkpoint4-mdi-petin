import { useCallback, useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';

import { useAuth } from '@/contexts/AuthContext';
import { petService } from '@/services/supabase/petService';
import { Pet } from '@/types/pet';

/**
 * Resolve o pet "ativo" de uma tela: usa o parâmetro `petId` da rota
 * quando existir; caso contrário, o primeiro pet do usuário logado.
 */
export function useAtivoPet() {
  const { usuario } = useAuth();
  const { petId: petIdParam } = useLocalSearchParams<{ petId?: string }>();

  const [pets, setPets] = useState<Pet[]>([]);
  const [petId, setPetId] = useState<string | null>(petIdParam ?? null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (petIdParam) setPetId(petIdParam);
  }, [petIdParam]);

  const carregar = useCallback(async () => {
    if (!usuario?.id) {
      setCarregando(false);
      return;
    }
    try {
      const lista = await petService.listarPorUsuario(usuario.id);
      setPets(lista);
      setPetId((atual) =>
        atual && lista.some((p) => p.id === atual) ? atual : lista[0]?.id ?? null
      );
    } catch (error) {
      console.error('Erro ao carregar pets:', error);
    } finally {
      setCarregando(false);
    }
  }, [usuario?.id]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const pet = pets.find((p) => p.id === petId) ?? null;

  return { pets, pet, petId, setPetId, carregando };
}
