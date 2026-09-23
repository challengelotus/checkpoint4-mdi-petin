import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { colors, typography } from '@/theme';

type PetStatus = 'em-dia' | 'atencao' | 'atrasado';

interface PetStatusCardProps {
    name: string;
    species: string;
    breed: string;
    status: PetStatus;
}

const statusConfig = {
    'em-dia': {
        label: 'Em dia',
        color: colors.success,
        backgroundColor: '#E5E9D5',
    },

    atencao: {
        label: 'Atenção',
        color: colors.warning,
        backgroundColor: '#F8E7C4',
    },

    atrasado: {
        label: 'Atrasado',
        color: colors.error,
        backgroundColor: '#F0CEC5',
    },
};

export function PetStatusCard({
    name,
    species,
    breed,
    status,
}: PetStatusCardProps) {
    const config = statusConfig[status];

    return (
        <View
            style={[
                styles.container,
                {
                    borderLeftColor: config.color,
                },
            ]}
        >
            <View style={styles.avatar} />

            <View style={styles.info}>
                <Text style={styles.name}>
                    {name}
                </Text>

                <Text style={styles.description}>
                    {species} - {breed}
                </Text>
            </View>

            <View
                style={[
                    styles.badge,
                    {
                        backgroundColor: config.backgroundColor,
                    },
                ]}
            >
                <Text
                    style={[
                        styles.badgeText,
                        {
                            color: config.color,
                        },
                    ]}
                >
                    {config.label}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 56,

        flexDirection: 'row',
        alignItems: 'center',

        paddingHorizontal: 14,

        backgroundColor: colors.backgroundLight,

        borderLeftWidth: 4,
        borderRadius: 10,

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 4,

        elevation: 2,
    },

    avatar: {
        width: 34,
        height: 34,

        borderRadius: 17,

        backgroundColor: '#D9DADC',

        marginRight: 12,
    },

    info: {
        flex: 1,
    },

    name: {
        fontFamily: typography.h4.fontFamily,
        fontSize: 12,
        color: colors.brown,
    },

    description: {
        marginTop: 2,

        fontFamily: typography.caption.fontFamily,
        fontSize: 9,

        color: colors.brownLight,
    },

    badge: {
        paddingHorizontal: 10,
        paddingVertical: 5,

        borderRadius: 12,
    },

    badgeText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 9,
    },
});