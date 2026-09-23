import {
    Pressable,
    StyleSheet,
    View,
} from 'react-native';

import { router } from 'expo-router';

import { colors } from '@/theme';

import { ContactCard } from '@/components/ContactCard/ContactCard';
import { PawIcon } from '@/components/PawIcon/PawIcon';
import { Typography } from '@/components/Typography/Typography';

export default function EmergenciaScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Pressable
                    onPress={() => router.back()}
                    style={styles.back}
                >
                    <Typography
                        variant="h2"
                        color={colors.backgroundLight}
                    >
                        ‹
                    </Typography>
                </Pressable>

                <Typography
                    variant="h2"
                    color={colors.backgroundLight}
                >
                    Emergência
                </Typography>

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