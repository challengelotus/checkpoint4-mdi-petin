export const colors = {
    primary: '#BF7847',

    brown: '#5C3D29',

    background: '#F7F0E4',

    orange: '#E2B180',

    brownLight: '#B38471',

    backgroundLight: '#FFFAF2',

    success: '#7D8C4C',

    warning: '#D9A441',

    error: '#B5533C',

    white: '#FFFFFF',

    black: '#000000',
} as const;

export type Color = keyof typeof colors;