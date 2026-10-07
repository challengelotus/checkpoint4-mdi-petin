import {
    Pressable,
    StyleSheet,
    Text,
} from 'react-native';

import { colors, typography } from '@/theme';

interface PrimaryButtonProps {
    title: string;
    onPress: () => void;
}

export function PrimaryButton({
    title,
    onPress,
}: PrimaryButtonProps) {
    return (
        <Pressable
            style={styles.container}
            onPress={onPress}
        >
            <Text style={styles.text}>
                {title}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 42,

        borderRadius: 24,

        alignItems: 'center',
        justifyContent: 'center',

        backgroundColor: colors.brown,
    },

    text: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 12,

        color: colors.backgroundLight,
    },
});