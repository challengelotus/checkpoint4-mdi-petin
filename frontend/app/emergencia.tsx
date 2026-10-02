import {
    Pressable,
    StyleSheet,
    View,
} from 'react-native';

import { router } from 'expo-router';

import { colors } from '@/theme';

import { ContactCard } from '@/components/ContactCard/ContactCard';
import { Header } from '@/components/Header/Header';
import { Typography } from '@/components/Typography/Typography';

export default function EmergenciaScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Header
                        title="Emergência"
                        onBack={() => router.back()}
                        titleColor={colors.backgroundLight}
                        fontSize="h2"
                    />
                </View>

                <Typography
                    variant="body"
                    color={colors.backgroundLight}
                    style={styles.subtitle}
                >
                    Contatos rápidos
                </Typography>

                <View style={styles.contacts}>
                    <ContactCard
                        name="Dra. Ana - Clínica Amigo Fiel"
                        description="Veterinário de confiança"
                        onPress={() => { }}
                    />

                    <ContactCard
                        name="PetSaúde 24h"
                        description="Emergência 24 horas"
                        onPress={() => { }}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

        backgroundColor: colors.primary,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',

        gap: 8,
    },

    content: {
        paddingHorizontal: 24,
        paddingTop: 48,
    },

    back: {
        width: 30,
        height: 30,

        justifyContent: 'center',

        marginBottom: 8,
    },

    subtitle: {
        marginTop: 6,
    },

    contacts: {
        marginTop: 18,

        gap: 14,
    },
});