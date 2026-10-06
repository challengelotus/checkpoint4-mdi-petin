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

interface BottomTabBarProps {
    active: 'inicio' | 'calendario' | 'localizar';
    onChange: (
        tab: 'inicio' | 'calendario' | 'localizar'
    ) => void;
}

const tabs = [
    {
        id: 'inicio' as const,
        label: 'Início',
        icon: 'home',
    },

    {
        id: 'calendario' as const,
        label: 'Calendário',
        icon: 'calendar-month',
    },

    {
        id: 'localizar' as const,
        label: 'Localizar',
        icon: 'map-marker',
    },
];

export function BottomTabBar({
    active,
    onChange,
}: BottomTabBarProps) {
    return (
        <View style={styles.container}>
            {tabs.map((tab) => {
                const selected = active === tab.id;

                return (
                    <Pressable
                        key={tab.id}
                        onPress={() => onChange(tab.id)}
                        style={styles.tab}
                    >
                        <MaterialCommunityIcons
                            name={
                                tab.icon as keyof typeof MaterialCommunityIcons.glyphMap
                            }
                            size={20}
                            color={
                                selected
                                    ? colors.brown
                                    : colors.brownLight
                            }
                        />

                        <Typography
                            variant="captionMedium"
                            color={
                                selected
                                    ? colors.brown
                                    : colors.brownLight
                            }
                        >
                            {tab.label}
                        </Typography>
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 56,

        borderTopWidth: 1,
        borderTopColor: '#E8D9C8',

        backgroundColor: colors.backgroundLight,

        flexDirection: 'row',
    },

    tab: {
        flex: 1,

        alignItems: 'center',
        justifyContent: 'center',

        gap: 2,
    },
});