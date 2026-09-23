import {
    Pressable,
    StyleSheet,
    View,
} from 'react-native';

import { colors } from '@/theme';

interface SwitchProps {
    value: boolean;
    onValueChange: (value: boolean) => void;
}

export function Switch({
    value,
    onValueChange,
}: SwitchProps) {
    return (
        <Pressable
            onPress={() => onValueChange(!value)}
            style={[
                styles.container,
                {
                    backgroundColor: value
                        ? colors.brown
                        : colors.backgroundLight,
                },
            ]}
        >
            <View
                style={[
                    styles.thumb,
                    {
                        transform: [
                            {
                                translateX: value ? 10 : -10,
                            },
                        ],
                    },
                ]}
            />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 32,
        height: 16,

        borderRadius: 10,

        alignItems: 'center',
        justifyContent: 'center',
    },

    thumb: {
        width: 12,
        height: 12,

        borderRadius: 6,

        backgroundColor: colors.backgroundLight,
    },
});