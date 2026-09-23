import {
    Pressable,
    StyleSheet,
    View,
} from 'react-native';

import {
    MaterialCommunityIcons,
} from '@expo/vector-icons';

import { colors } from '@/theme';
import { Typography } from '@/components/Typography/Typography';

interface ContactCardProps {
    name: string;
    description: string;
    onPress?: () => void;
}

export function ContactCard({
    name,
    description,
    onPress,
}: ContactCardProps) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.container,
                pressed && styles.pressed,
            ]}
        >
            <View style={styles.info}>
                <Typography variant="bodyMedium">
                    {name}
                </Typography>

                <Typography
                    variant="caption"
                    color={colors.textSecondary}
                    style={styles.description}
                >
                    {description}
                </Typography>
            </View>

            <MaterialCommunityIcons
                name="phone-in-talk"
                size={20}
                color={colors.brown}
            />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        minHeight: 60,

        paddingHorizontal: 14,
        paddingVertical: 10,

        borderRadius: 12,

        backgroundColor: colors.backgroundLight,

        flexDirection: 'row',
        alignItems: 'center',
    },

    info: {
        flex: 1,
    },

    description: {
        marginTop: 2,
    },

    pressed: {
        opacity: 0.8,
    },
});