import {
    Pressable,
    StyleSheet,
    View,
} from 'react-native';

import { router } from 'expo-router';

import { colors } from '@/theme';
import { Typography } from '@/components/Typography/Typography';
import { PawIcon } from '@/components/PawIcon/PawIcon';

export default function SplashScreen() {
    return (
        <Pressable
            style={styles.container}
            onPress={() => router.replace('/(auth)/login')}
        >
            <View style={styles.logoCircle}>
                <PawIcon
                    size={64}
                    color={colors.brown}
                />
            </View>

            <Typography
                variant="h2"
                color={colors.backgroundLight}
                style={styles.title}
            >
                Petin
            </Typography>

            <Typography
                variant="body"
                color={colors.backgroundLight}
                style={styles.subtitle}
            >
                Toque para começar
            </Typography>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

        backgroundColor: colors.primary,

        alignItems: 'center',
        justifyContent: 'center',
    },

    logoCircle: {
        width: 150,
        height: 150,

        borderRadius: 75,

        backgroundColor: colors.background,

        alignItems: 'center',
        justifyContent: 'center',

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 6,

        elevation: 4,
    },

    title: {
        marginTop: 28,
    },

    subtitle: {
        marginTop: 28,
    },
});