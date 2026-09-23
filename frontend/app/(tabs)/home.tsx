import {
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';

import { router } from 'expo-router';

import {
    MaterialCommunityIcons,
} from '@expo/vector-icons';

import { colors } from '@/theme';

import { PetCard } from '@/components/PetCard/PetCard';
import { Typography } from '@/components/Typography/Typography';

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <View>
                        <Typography variant="h2">
                            Meus pets
                        </Typography>

                        <Typography
                            variant="caption"
                            color={colors.textSecondary}
                            style={styles.subtitle}
                        >
                            3 pets cadastrados
                        </Typography>
                    </View>

                    <View style={styles.actions}>
                        <Pressable
                            style={styles.emergencyButton}
                            onPress={() =>
                                router.push('/emergencia')
                            }
                        >
                            <MaterialCommunityIcons
                                name="phone-in-talk"
                                size={20}
                                color={colors.backgroundLight}
                            />
                        </Pressable>

                        <Pressable
                            style={styles.addButton}
                            onPress={() =>
                                router.push('/cadastrar-pet')
                            }
                        >
                            <MaterialCommunityIcons
                                name="plus"
                                size={25}
                                color={colors.backgroundLight}
                            />
                        </Pressable>
                    </View>
                </View>

                <View style={styles.pets}>
                    <PetCard
                        name="Chico"
                        species="Cachorro"
                        breed="Spitz Alemão"
                        status="em-dia"
                    />

                    <PetCard
                        name="Violeta"
                        species="Gato"
                        breed="SRD"
                        status="atencao"
                    />

                    <PetCard
                        name="Lisa"
                        species="Gato"
                        breed="SRD"
                        status="em-dia"
                    />

                    <PetCard
                        name="Jorge"
                        species="Ave"
                        breed="Papagaio"
                        status="atrasado"
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

    content: {
        paddingHorizontal: 20,
        paddingTop: 56,
        paddingBottom: 24,
    },

    header: {
        flexDirection: 'row',

        alignItems: 'center',
        justifyContent: 'space-between',
    },

    subtitle: {
        marginTop: 4,
    },

    actions: {
        flexDirection: 'row',

        gap: 10,
    },

    emergencyButton: {
        width: 38,
        height: 38,

        borderRadius: 10,

        backgroundColor: colors.brownLight,

        alignItems: 'center',
        justifyContent: 'center',
    },

    addButton: {
        width: 38,
        height: 38,

        borderRadius: 10,

        backgroundColor: colors.brown,

        alignItems: 'center',
        justifyContent: 'center',
    },

    pets: {
        marginTop: 18,

        gap: 14,
    },
});