import {
    StyleProp,
    StyleSheet,
    Text,
    TextProps,
    TextStyle,
} from 'react-native';

import { colors, typography } from '@/theme';

type TypographyVariant =
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'body'
    | 'bodyMedium'
    | 'bodySemiBold'
    | 'caption'
    | 'captionMedium';

interface TypographyProps extends TextProps {
    variant?: TypographyVariant;
    color?: string;
    style?: StyleProp<TextStyle>;
}

export function Typography({
    variant = 'body',
    color = colors.brown,
    style,
    children,
    ...props
}: TypographyProps) {
    return (
        <Text
            style={[
                styles.base,
                styles[variant],
                { color },
                style,
            ]}
            {...props}
        >
            {children}
        </Text>
    );
}

const styles = StyleSheet.create({
    base: {
        includeFontPadding: false,
    },

    h1: {
        fontFamily: typography.h1.fontFamily,
        fontSize: typography.h1.fontSize,
    },

    h2: {
        fontFamily: typography.h2.fontFamily,
        fontSize: typography.h2.fontSize,
    },

    h3: {
        fontFamily: typography.h3.fontFamily,
        fontSize: typography.h3.fontSize,
    },

    h4: {
        fontFamily: typography.h4.fontFamily,
        fontSize: typography.h4.fontSize,
    },

    body: {
        fontFamily: typography.body.fontFamily,
        fontSize: typography.body.fontSize,
    },

    bodyMedium: {
        fontFamily: typography.bodyMedium.fontFamily,
        fontSize: typography.bodyMedium.fontSize,
    },

    bodySemiBold: {
        fontFamily: typography.bodySemiBold.fontFamily,
        fontSize: typography.bodySemiBold.fontSize,
    },

    caption: {
        fontFamily: typography.caption.fontFamily,
        fontSize: typography.caption.fontSize,
    },

    captionMedium: {
        fontFamily: typography.captionMedium.fontFamily,
        fontSize: typography.captionMedium.fontSize,
    },
});