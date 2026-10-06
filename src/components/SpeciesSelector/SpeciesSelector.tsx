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

export type Species =
    | 'cachorro'
    | 'gato';

interface SpeciesSelectorProps {
    value: Species;
    onChange: (value: Species) => void;
}

export function SpeciesSelector({
    value,
    onChange,
}: SpeciesSelectorProps) {
    return (
        <View style={styles.container}>
            <Pressable
                onPress={() => onChange('cachorro')}
                style={[
                    styles.option,
                    value === 'cachorro' && styles.selected,
                ]}
            >
                <MaterialCommunityIcons
                    name="dog"
                    size={18}
                    color={
                        value === 'cachorro'
                            ? colors.backgroundLight
                            : colors.brown
                    }
                />

                <Typography
                    variant="bodySemiBold"
                    color={
                        value === 'cachorro'
                            ? colors.backgroundLight
                            : colors.brown
                    }
                >
                    Cachorro
                </Typography>
            </Pressable>

            <Pressable
                onPress={() => onChange('gato')}
                style={[
                    styles.option,
                    value === 'gato' && styles.selected,
                ]}
            >
                <MaterialCommunityIcons
                    name="cat"
                    size={18}
                    color={
                        value === 'gato'
                            ? colors.backgroundLight
                            : colors.brown
                    }
                />

                <Typography
                    variant="bodySemiBold"
                    color={
                        value === 'gato'
                            ? colors.backgroundLight
                            : colors.brown
                    }
                >
                    Gato
                </Typography>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 10,
    },

    option: {
        flex: 1,
        height: 42,

        borderRadius: 24,

        backgroundColor: colors.backgroundLight,

        alignItems: 'center',
        justifyContent: 'center',

        flexDirection: 'row',
        gap: 6,
    },

    selected: {
        backgroundColor: colors.brown,
    },
});