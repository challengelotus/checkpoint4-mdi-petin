import { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import {
  router,
  useLocalSearchParams,
} from 'expo-router';

import { colors } from '@/theme';

import { Typography } from '@/components/Typography/Typography';
import { FormInput } from '@/components/FormInput/FormInput';
import { Button } from '@/components/Button/Button';
import { Header } from '@/components/Header/Header';
import { Avatar } from '@/components/Avatar/Avatar';

import { petService } from '@/services/supabase/petService';
import { Pet } from '@/types/pet';

import {
  ImagemEscolhida,
  escolherOrigemEImagem,
} from '@/utils/imagem';

import {
  dataBRparaISO,
  isoParaDataBR,
  mascaraData,
  mensagemErro,
} from '@/utils/date';

const ESPECIES = ['Cachorro', 'Gato'] as const;

export default function EditarPetScreen() {
  const { petId } = useLocalSearchParams<{
    petId?: string;
  }>();

  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [foto, setFoto] = useState<ImagemEscolhida | null>(null);

  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [weight, setWeight] = useState('');
  const [microchip, setMicrochip] = useState('');

  // Espécie: um dos botões OU o texto livre do campo "Outro"
  const [species, setSpecies] = useState<string>('');
  const [otherSpecies, setOtherSpecies] = useState('');

  useEffect(() => {
    async function carregar() {
      if (!petId) {
        Alert.alert('Erro', 'Pet não identificado.');
        router.back();
        return;
      }

      try {
        const dados = await petService.buscarPorId(petId);

        if (!dados) {
          Alert.alert('Erro', 'Pet não encontrado.');
          router.back();
          return;
        }

        setPet(dados);
        setName(dados.nome);
        setBreed(dados.raca ?? '');
        setBirthDate(isoParaDataBR(dados.dataNascimento));
        setWeight(dados.peso != null ? String(dados.peso) : '');
        setMicrochip(dados.microchip ?? '');

        if ((ESPECIES as readonly string[]).includes(dados.especie)) {
          setSpecies(dados.especie);
        } else {
          setOtherSpecies(dados.especie);
        }
      } catch (error) {
        console.error('Erro ao carregar pet:', error);
        Alert.alert(
          'Erro',
          mensagemErro(error, 'Não foi possível carregar o pet.')
        );
        router.back();
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, [petId]);

  async function alterarFoto() {
    const imagem = await escolherOrigemEImagem();
    if (imagem) setFoto(imagem);
  }

  async function handleSave() {
    if (!pet) return;

    if (!name.trim()) {
      Alert.alert('Atenção', 'Digite o nome do pet.');
      return;
    }

    const especie = species || otherSpecies.trim();

    if (!especie) {
      Alert.alert('Atenção', 'Informe a espécie do pet.');
      return;
    }

    let dataNascimento: string | undefined;

    if (birthDate.trim()) {
      const iso = dataBRparaISO(birthDate);

      if (!iso) {
        Alert.alert('Atenção', 'Data de nascimento inválida. Use dd/mm/aaaa.');
        return;
      }

      dataNascimento = iso;
    }

    let pesoNumerico: number | undefined;

    if (weight.trim()) {
      pesoNumerico = Number(weight.replace(',', '.').replace(/[^\d.]/g, ''));

      if (Number.isNaN(pesoNumerico) || pesoNumerico <= 0) {
        Alert.alert('Atenção', 'Digite um peso válido.');
        return;
      }
    }

    try {
      setSaving(true);

      // Foto só é enviada ao salvar; cancelar a edição descarta a escolha
      if (foto) {
        await petService.uploadFotoPerfil(pet.id, foto.buffer, foto.extensao);
      }

      await petService.atualizar(pet.id, {
        nome: name.trim(),
        especie,
        raca: breed.trim(),
        dataNascimento,
        // Só envia o peso se mudou, para não gerar histórico duplicado
        peso: pesoNumerico !== pet.peso ? pesoNumerico : undefined,
        microchip: microchip.trim(),
      });

      router.back();
    } catch (error) {
      console.error('Erro ao atualizar pet:', error);
      Alert.alert(
        'Erro',
        mensagemErro(error, 'Não foi possível salvar as alterações.')
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header
          title={pet?.nome ?? 'Editar pet'}
          onBack={() => router.back()}
          fontSize="h2"
        />
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        <View style={styles.photoWrapper}>
          <Avatar
            uri={foto?.uri ?? pet?.fotoLink}
            nome={name || pet?.nome}
            size={90}
          />

          <Pressable onPress={alterarFoto} hitSlop={10}>
            <Typography
              variant="captionMedium"
              color={colors.primary}
              style={styles.changePhoto}
            >
              Alterar foto
            </Typography>
          </Pressable>
        </View>

        <View style={styles.form}>
          <FormInput
            label="Nome"
            value={name}
            onChangeText={setName}
          />

          <Typography
            variant="caption"
            color={colors.textSecondary}
          >
            Espécie
          </Typography>

          <View style={styles.speciesContainer}>
            {ESPECIES.map((opcao) => (
              <Pressable
                key={opcao}
                onPress={() => {
                  setSpecies(opcao);
                  setOtherSpecies('');
                }}
                style={[
                  styles.speciesButton,
                  species === opcao &&
                    styles.selectedSpecies,
                ]}
              >
                <Typography
                  variant="bodySemiBold"
                  color={
                    species === opcao
                      ? colors.backgroundLight
                      : colors.brown
                  }
                >
                  {opcao}
                </Typography>
              </Pressable>
            ))}
          </View>

          <FormInput
            label="Outro"
            value={otherSpecies}
            onChangeText={(t) => {
              setOtherSpecies(t);
              if (t) setSpecies('');
            }}
          />

          <FormInput
            label="Raça"
            value={breed}
            onChangeText={setBreed}
          />

          <FormInput
            label="Data de nascimento"
            value={birthDate}
            onChangeText={(t) =>
              setBirthDate(mascaraData(t))
            }
            placeholder="dd/mm/aaaa"
            keyboardType="number-pad"
            maxLength={10}
          />

          <FormInput
            label="Peso (kg)"
            value={weight}
            onChangeText={setWeight}
            keyboardType="decimal-pad"
          />

          <FormInput
            label="Microchip"
            value={microchip}
            onChangeText={setMicrochip}
          />

          <Button
            title="Salvar alterações"
            onPress={handleSave}
            loading={saving}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: colors.background,
  },

  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  header: {
    paddingTop: 54,
    paddingHorizontal: 30,

    flexDirection: 'row',
    alignItems: 'center',

    gap: 8,
  },

  content: {
    paddingHorizontal: 42,
    paddingBottom: 40,
  },

  photoWrapper: {
    marginTop: 24,

    alignItems: 'center',
  },

  changePhoto: {
    marginTop: 10,
  },

  form: {
    marginTop: 24,
    gap: 20,
  },

  speciesContainer: {
    flexDirection: 'row',
    gap: 12,

    marginTop: -12,
  },

  speciesButton: {
    flex: 1,

    height: 40,

    borderRadius: 22,

    backgroundColor: colors.backgroundLight,

    alignItems: 'center',
    justifyContent: 'center',
  },

  selectedSpecies: {
    backgroundColor: colors.brown,
  },
});
