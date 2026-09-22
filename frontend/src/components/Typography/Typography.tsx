import React from 'react';
import {
    StyleProp,
    StyleSheet,
    Text,
    TextProps,
    TextStyle,
} from 'react-native';

import { colors, typography } from '@/theme';

type Variant =
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'body'
    | 'caption';

interface TypographyProps extends TextProps {
    variant?: Variant;
    style?: StyleProp<TextStyle>;
}

export function Typography({
    variant = 'body',
    style,
    children,
    ...props
}: TypographyProps) {
    return (
        <Text
            style={[
                styles.base,
                styles[variant],
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
        color: colors.brown,
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

    caption: {
        fontFamily: typography.caption.fontFamily,
        fontSize: typography.caption.fontSize,
    },
});