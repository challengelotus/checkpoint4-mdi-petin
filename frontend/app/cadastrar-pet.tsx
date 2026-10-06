import { useState } from 'react';

import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';

import { router } from 'expo-router';

import { colors } from '@/theme';

import { Typography } from '@/components/Typography/Typography';
import { FormInput } from '@/components/FormInput/FormInput';
import { Button } from '@/components/Button/Button';
import { PawIcon } from '@/components/PawIcon/PawIcon';

import { useAuth } from '@/contexts/AuthContext';
import { petService } from '@/services/supabase/petService';
import { ehLimitePlano } from '@/utils/planoLimite';
import { Header } from '@/components/Header/Header';

export default function CadastroPetScreen() {
    const { usuario } = useAuth();

    const [nome, setNome] = useState('');
    const [especie, setEspecie] = useState('');
    const [raca, setRaca] = useState('');
    const [dataNascimento, setDataNascimento] =
        useState('');
    const [peso, setPeso] = useState('');
    const [microchip, setMicrochip] = useState('');

    const [loading, setLoading] = useState(false);

    async function handleCadastrarPet() {
        if (!usuario?.id) {
            Alert.alert(
                'Sessão expirada',
                'Faça login novamente para cadastrar um pet.'
            );

            router.replace('/(auth)/login');

            return;
        }

        const nomePet = nome.trim();
        const especiePet = especie.trim();
        const racaPet = raca.trim();
        const microchipPet = microchip.trim();

        if (!nomePet) {
            Alert.alert(
                'Atenção',
                'Digite o nome do pet.'
            );

            return;
        }

        if (!especiePet) {
            Alert.alert(
                'Atenção',
                'Informe a espécie do pet.'
            );

            return;
        }

        let pesoNumerico: number | undefined;

        if (peso.trim()) {
            pesoNumerico = Number(
                peso.replace(',', '.')
            );

            if (
                Number.isNaN(pesoNumerico) ||
                pesoNumerico <= 0
            ) {
                Alert.alert(
                    'Atenção',
                    'Digite um peso válido.'
                );

                return;
            }
        }

        try {
            setLoading(true);

            await petService.cadastrar({
                usuarioId: usuario.id,
                nome: nomePet,
                especie: especiePet,
                raca: racaPet || undefined,
                dataNascimento:
                    dataNascimento.trim() ||
                    undefined,
                peso: pesoNumerico,
                microchip:
                    microchipPet || undefined,
            });

            Alert.alert(
                'Pet cadastrado!',
                `${nomePet} foi cadastrado com sucesso.`,
                [
                    {
                        text: 'Continuar',
                        onPress: () =>
                            router.replace(
                                '/(tabs)/home'
                            ),
                    },
                ]
            );
        } catch (error) {
            // Limite do plano: o service já levou o usuário à tela de assinatura
            if (ehLimitePlano(error)) {
                return;
            }

            console.error(
                'Erro ao cadastrar pet:',
                error
            );

            const message =
                error instanceof Error
                    ? error.message
                    : 'Não foi possível cadastrar o pet.';

            Alert.alert(
                'Erro',
                message
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Header
                    title="Cadastrar pet"
                    onBack={() => router.back()}
                    titleColor={colors.backgroundLight}
                    fontSize="h2"
                />
            </View>

            <KeyboardAvoidingView
                style={styles.contentWrapper}
                behavior={
                    Platform.OS === 'ios'
                        ? 'padding'
                        : undefined
                }
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <FormInput
                        label="Nome"
                        value={nome}
                        onChangeText={setNome}
                        placeholder="Ex.: Chico"
                        autoCapitalize="words"
                        autoCorrect={false}
                    />

                    <FormInput
                        label="Espécie"
                        value={especie}
                        onChangeText={setEspecie}
                        placeholder="Ex.: Cachorro"
                        autoCapitalize="words"
                    />

                    <FormInput
                        label="Raça"
                        value={raca}
                        onChangeText={setRaca}
                        placeholder="Ex.: Rottweiler"
                        autoCapitalize="words"
                    />

                    <FormInput
                        label="Data de nascimento"
                        value={dataNascimento}
                        onChangeText={setDataNascimento}
                        placeholder="AAAA-MM-DD"
                        keyboardType="numbers-and-punctuation"
                    />

                    <FormInput
                        label="Peso (kg)"
                        value={peso}
                        onChangeText={setPeso}
                        placeholder="Ex.: 12,5"
                        keyboardType="decimal-pad"
                    />

                    <FormInput
                        label="Microchip"
                        value={microchip}
                        onChangeText={setMicrochip}
                        placeholder="Opcional"
                        keyboardType="numeric"
                    />

                    <Button
                        title="Cadastrar pet"
                        onPress={handleCadastrarPet}
                        loading={loading}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
    },

    header: {
        paddingTop: 54,
        paddingHorizontal: 24,
        paddingBottom: 24,
        flexDirection: 'row',
        alignItems: 'center',

        gap: 8,
    },

    backButton: {
        alignSelf: 'flex-start',
        marginBottom: 16,
    },

    headerIcon: {
        marginBottom: 8,
    },

    title: {
        marginBottom: 8,
    },

    contentWrapper: {
        flex: 1,
        backgroundColor: colors.background,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
    },

    content: {
        paddingHorizontal: 24,
        paddingTop: 28,
        paddingBottom: 40,
        gap: 18,
    },
});