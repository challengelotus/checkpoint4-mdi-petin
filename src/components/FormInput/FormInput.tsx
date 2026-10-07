import {
    StyleSheet,
    TextInput,
    TextInputProps,
    View,
} from 'react-native';

import { colors, typography } from '@/theme';
import { Typography } from '@/components/Typography/Typography';

interface FormInputProps extends TextInputProps {
    label: string;
}

export function FormInput({
    label,
    ...props
}: FormInputProps) {
    return (
        <View style={styles.container}>
            <Typography
                variant="caption"
                color={colors.textSecondary}
            >
                {label}
            </Typography>

            <TextInput
                {...props}
                style={styles.input}
                placeholderTextColor={colors.textSecondary}
                selectionColor={colors.primary}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },

    input: {
        height: 42,

        marginTop: 4,
        paddingHorizontal: 0,

        borderBottomWidth: 1.5,
        borderBottomColor: colors.orange,

        fontFamily: typography.body.fontFamily,
        fontSize: 12,

        color: colors.brown,
    },
});