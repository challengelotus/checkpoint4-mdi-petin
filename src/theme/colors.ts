export const colors = {
    primary: '#BF7847',
    brown: '#5C3D29',
    background: '#F7F0E4',
    orange: '#E2B180',
    brownLight: '#B38471',
    backgroundLight: '#FFFAF2',

    success: '#7D8C4C',
    successLight: '#E4E8D4',

    warning: '#D9A441',
    warningLight: '#F7E7C5',

    error: '#B5533C',
    errorLight: '#F0CEC6',

    white: '#FFFFFF',
    black: '#000000',

    gray: '#D9D9D9',
    textSecondary: '#987F70',
} as const;

export type Color = keyof typeof colors;