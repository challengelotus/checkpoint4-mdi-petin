import {
    Image,
    Pressable,
    StyleSheet,
    View,
} from 'react-native';

import { colors } from '@/theme';

import { Typography } from '@/components/Typography/Typography';

import { Pet } from '@/types/pet';

interface PetCardProps {
    pet: Pet;
    onPress?: () => void;
}

export function PetCard({
    pet,
    onPress,
}: PetCardProps) {
    const status = pet.status ?? 'Em Dia';

    return (
        <Pressable
            onPress={onPress}
            style={[
                styles.container,
                getStatusStyle(status),
            ]}
        >
            {pet.fotoLink ? (
                <Image
                    source={{
                        uri: pet.fotoLink,
                    }}
                    style={styles.image}
                />
            ) : (
                <View style={styles.placeholder} />
            )}

            <View style={styles.info}>
                <Typography
                    variant="bodyMedium"
                    color={colors.brown}
                >
                    {pet.nome}
                </Typography>

                <Typography
                    variant="caption"
                    color={colors.brownLight}
                >
                    {pet.especie}
                    {pet.raca
                        ? ` - ${pet.raca}`
                        : ''}
                </Typography>
            </View>

            <View
                style={[
                    styles.status,
                    getStatusBackground(status),
                ]}
            >
                <Typography
                    variant="captionMedium"
                    color={getStatusTextColor(status)}
                >
                    {status}
                </Typography>
            </View>
        </Pressable>
    );
}

function getStatusStyle(status: Pet['status']) {
    switch (status) {
        case 'Atenção':
            return styles.attentionBorder;

        case 'Atrasado':
            return styles.lateBorder;

        default:
            return styles.onTimeBorder;
    }
}

function getStatusBackground(
    status: Pet['status']
) {
    switch (status) {
        case 'Atenção':
            return styles.attentionBackground;

        case 'Atrasado':
            return styles.lateBackground;

        default:
            return styles.onTimeBackground;
    }
}

function getStatusTextColor(
    status: Pet['status']
) {
    switch (status) {
        case 'Atenção':
            return colors.warning;

        case 'Atrasado':
            return colors.error;

        default:
            return colors.success;
    }
}

const styles = StyleSheet.create({
    container: {
        minHeight: 72,

        flexDirection: 'row',
        alignItems: 'center',

        paddingHorizontal: 16,

        borderRadius: 14,

        backgroundColor:
            colors.backgroundLight,

        borderLeftWidth: 5,
    },

    image: {
        width: 42,
        height: 42,

        borderRadius: 21,
    },

    placeholder: {
        width: 42,
        height: 42,

        borderRadius: 21,

        backgroundColor: '#D9D9D9',
    },

    info: {
        flex: 1,
        marginLeft: 12,
    },

    status: {
        paddingHorizontal: 10,
        paddingVertical: 5,

        borderRadius: 12,
    },

    onTimeBorder: {
        borderLeftColor:
            colors.success,
    },

    attentionBorder: {
        borderLeftColor:
            colors.warning,
    },

    lateBorder: {
        borderLeftColor:
            colors.error,
    },

    onTimeBackground: {
        backgroundColor: '#E1E8C9',
    },

    attentionBackground: {
        backgroundColor: '#F8E4BA',
    },

    lateBackground: {
        backgroundColor: '#F0C7BD',
    },
});