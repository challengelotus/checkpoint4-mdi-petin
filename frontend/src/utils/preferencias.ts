import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PreferenciasUsuario {
  lembretesVacinas: boolean;
  lembretesConsultas: boolean;
}

const PADRAO: PreferenciasUsuario = {
  lembretesVacinas: true,
  lembretesConsultas: true,
};

const chave = (usuarioId: string) => `@petin:preferencias:${usuarioId}`;

/** Preferências ficam no aparelho (não há colunas para elas no Supabase). */
export async function carregarPreferencias(usuarioId: string): Promise<PreferenciasUsuario> {
  try {
    const raw = await AsyncStorage.getItem(chave(usuarioId));
    return raw ? { ...PADRAO, ...JSON.parse(raw) } : PADRAO;
  } catch {
    return PADRAO;
  }
}

export async function salvarPreferencias(
  usuarioId: string,
  prefs: PreferenciasUsuario
): Promise<void> {
  await AsyncStorage.setItem(chave(usuarioId), JSON.stringify(prefs));
}
