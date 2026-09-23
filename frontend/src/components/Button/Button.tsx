import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
} from 'react-native';

import { colors } from '@/theme';
import { Typography } from '@/components/Typography/Typography';

interface ButtonProps {
    title: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
}

export function Button({
    title,
    onPress,
    loading = false,
    disabled = false,
}: ButtonProps) {
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled || loading}
            style={({ pressed }) => [
                styles.container,
                pressed && styles.pressed,
                (disabled || loading) && styles.disabled,
            ]}
        >
            {loading ? (
                <ActivityIndicator color={colors.backgroundLight} />
            ) : (
                <Typography
                    variant="bodySemiBold"
                    color={colors.backgroundLight}
                >
                    {title}
                </Typography>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 42,

        borderRadius: 24,

        alignItems: 'center',
        justifyContent: 'center',

        backgroundColor: colors.brown,
    },

    pressed: {
        opacity: 0.8,
    },

    disabled: {
        opacity: 0.5,
    },
});