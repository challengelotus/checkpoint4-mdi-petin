import { useCallback, useState } from 'react';

import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';

import { router, useFocusEffect } from 'expo-router';

import { colors } from '@/theme';

import { Typography } from '@/components/Typography/Typography';
import { PetCard } from '@/components/PetCard/PetCard';

import { useAuth } from '@/contexts/AuthContext';
import { petService } from '@/services/supabase/petService';

import { Pet } from '@/types/pet';

export default function HomeScreen() {
    const { usuario } = useAuth();

    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] =
        useState(false);

    const carregarPets = useCallback(
        async (refresh = false) => {
            if (!usuario?.id) {
                setPets([]);
                setLoading(false);
                return;
            }

            try {
                if (refresh) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                const petsUsuario =
                    await petService.listarPorUsuario(
                        usuario.id
                    );

                setPets(petsUsuario);
            } catch (error) {
                console.error(
                    'Erro ao carregar pets:',
                    error
                );

                Alert.alert(
                    'Erro',
                    'Não foi possível carregar seus pets.'
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [usuario?.id]
    );

    useFocusEffect(
        useCallback(() => {
            carregarPets();
        }, [carregarPets])
    );

    function abrirPet(pet: Pet) {
        router.push({
            pathname: '/dashboard-pet',
            params: {
                petId: pet.id,
            },
        });
    }

    function adicionarPet() {
        router.push('/cadastrar-pet');
    }

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator
                    size="large"
                    color={colors.primary}
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() =>
                            carregarPets(true)
                        }
                    />
                }
            >
                <View style={styles.header}>
                    <Typography
                        variant="caption"
                        color={colors.brown}
                    >
                        Olá,
                    </Typography>

                    <Typography
                        variant="h2"
                        color={colors.brown}
                    >
                        {usuario?.nome ?? 'Petin'}
                    </Typography>
                </View>

                <View style={styles.titleContainer}>
                    <Typography
                        variant="h3"
                        color={colors.brown}
                    >
                        Meus pets
                    </Typography>
                </View>

                {pets.length === 0 ? (
                    <View
                        style={styles.emptyContainer}
                    >
                        <Typography
                            variant="body"
                            color={colors.brown}
                        >
                            Você ainda não cadastrou
                            nenhum pet.
                        </Typography>

                        <Typography
                            variant="caption"
                            color={colors.brownLight}
                            style={styles.emptyText}
                        >
                            Cadastre seu primeiro pet
                            para começar a acompanhar
                            a saúde dele.
                        </Typography>
                    </View>
                ) : (
                    <View style={styles.petList}>
                        {pets.map((pet) => (
                            <PetCard
                                key={pet.id}
                                pet={pet}
                                onPress={() =>
                                    abrirPet(pet)
                                }
                            />
                        ))}
                    </View>
                )}

                <View style={styles.addContainer}>
                    <Typography
                        variant="bodyMedium"
                        color={colors.brown}
                        onPress={adicionarPet}
                    >
                        + Adicionar pet
                    </Typography>
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

    content: {
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 32,
    },

    header: {
        marginTop: 24,
        marginBottom: 32,
    },

    titleContainer: {
        marginBottom: 16,
    },

    petList: {
        gap: 12,
    },

    emptyContainer: {
        padding: 24,
        borderRadius: 16,
        backgroundColor: colors.backgroundLight,
        alignItems: 'center',
    },

    emptyText: {
        marginTop: 8,
        textAlign: 'center',
    },

    addContainer: {
        alignItems: 'center',
        marginTop: 24,
    },

    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background,
    },
});