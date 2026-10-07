import {
    StyleSheet,
    View,
} from 'react-native';

import { colors } from '@/theme';
import { Typography } from '@/components/Typography/Typography';

export type PetStatus =
    | 'em-dia'
    | 'atencao'
    | 'atrasado';

interface StatusBadgeProps {
    status: PetStatus;
}

const statusConfig = {
    'em-dia': {
        label: 'Em dia',
        color: colors.success,
        background: colors.successLight,
    },

    atencao: {
        label: 'Atenção',
        color: colors.warning,
        background: colors.warningLight,
    },

    atrasado: {
        label: 'Atrasado',
        color: colors.error,
        background: colors.errorLight,
    },
};

export function StatusBadge({
    status,
}: StatusBadgeProps) {
    const config = statusConfig[status];

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: config.background,
                },
            ]}
        >
            <Typography
                variant="captionMedium"
                color={config.color}
            >
                {config.label}
            </Typography>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 9,
        paddingVertical: 4,

        borderRadius: 12,
    },
});