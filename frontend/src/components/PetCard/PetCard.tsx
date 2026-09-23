import {
    Image,
    StyleSheet,
    View,
} from 'react-native';

import { colors } from '@/theme';
import { Typography } from '@/components/Typography/Typography';
import {
    PetStatus,
    StatusBadge,
} from '@/components/StatusBadge/StatusBadge';

interface PetCardProps {
    name: string;
    species: string;
    breed: string;
    status: PetStatus;
    image?: string;
}

export function PetCard({
    name,
    species,
    breed,
    status,
    image,
}: PetCardProps) {
    const statusColor = {
        'em-dia': colors.success,
        atencao: colors.warning,
        atrasado: colors.error,
    }[status];

    return (
        <View
            style={[
                styles.container,
                {
                    borderLeftColor: statusColor,
                },
            ]}
        >
            {image ? (
                <Image
                    source={{ uri: image }}
                    style={styles.avatar}
                />
            ) : (
                <View style={styles.avatarPlaceholder}>
                    <Typography
                        variant="h4"
                        color={colors.brownLight}
                    >
                        🐾
                    </Typography>
                </View>
            )}

            <View style={styles.info}>
                <Typography
                    variant="captionMedium"
                    color={colors.brown}
                >
                    {name}
                </Typography>

                <Typography
                    variant="caption"
                    color={colors.textSecondary}
                >
                    {species} - {breed}
                </Typography>
            </View>

            <StatusBadge status={status} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        minHeight: 60,

        paddingHorizontal: 12,

        borderLeftWidth: 4,
        borderRadius: 12,

        backgroundColor: colors.backgroundLight,

        flexDirection: 'row',
        alignItems: 'center',

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.06,
        shadowRadius: 4,

        elevation: 2,
    },

    avatar: {
        width: 38,
        height: 38,

        borderRadius: 19,

        marginRight: 10,
    },

    avatarPlaceholder: {
        width: 38,
        height: 38,

        borderRadius: 19,

        marginRight: 10,

        alignItems: 'center',
        justifyContent: 'center',

        backgroundColor: colors.gray,
    },

    info: {
        flex: 1,
    },
});