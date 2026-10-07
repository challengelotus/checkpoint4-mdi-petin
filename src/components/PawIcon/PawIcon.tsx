import {
    MaterialCommunityIcons,
} from '@expo/vector-icons';

import { colors } from '@/theme';

interface PawIconProps {
    size?: number;
    color?: string;
}

export function PawIcon({
    size = 40,
    color = colors.brown,
}: PawIconProps) {
    return (
        <MaterialCommunityIcons
            name="paw"
            size={size}
            color={color}
        />
    );
}