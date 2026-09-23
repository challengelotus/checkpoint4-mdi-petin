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

interface HeaderProps {
    title: string;
    subtitle?: string;
    onBack?: () => void;
    rightIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
    onRightPress?: () => void;
}

export function Header({
    title,
    subtitle,
    onBack,
    rightIcon,
    onRightPress,
}: HeaderProps) {
    return (
        <View style={styles.container}>
            <View style={styles.left}>
                {onBack && (
                    <Pressable
                        onPress={onBack}
                        style={styles.backButton}
                    >
                        <MaterialCommunityIcons
                            name="chevron-left"
                            size={26}
                            color={colors.brown}
                        />
                    </Pressable>
                )}

                <View>
                    <Typography variant="h3">
                        {title}
                    </Typography>

                    {subtitle && (
                        <Typography
                            variant="caption"
                            color={colors.textSecondary}
                            style={styles.subtitle}
                        >
                            {subtitle}
                        </Typography>
                    )}
                </View>
            </View>

            {rightIcon && (
                <Pressable
                    onPress={onRightPress}
                    style={styles.rightButton}
                >
                    <MaterialCommunityIcons
                        name={rightIcon}
                        size={22}
                        color={colors.backgroundLight}
                    />
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    left: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    backButton: {
        marginRight: 4,
    },

    subtitle: {
        marginTop: 2,
    },

    rightButton: {
        width: 42,
        height: 42,

        borderRadius: 10,

        backgroundColor: colors.brown,

        alignItems: 'center',
        justifyContent: 'center',
    },
});