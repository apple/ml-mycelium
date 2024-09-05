// For licensing see accompanying LICENSE file.
// Copyright (C) 2024 Apple Inc. All Rights Reserved.

export const colors = {
  black: '#000000',
  white: '#ffffff',
  foreground: {
    blue: '#0066CC',
    red: '#E30000',
    orange: '#BF4800',
    yellow: '#D08B00',
    green: '#008009',
    purple: '#6D56D6',
    gray: '#1D1D1F',
    graySecondary: '#6E6E73',
    graySecondaryAlt: '#515154',
    grayTertiary: '#86868B',
  },
  background: {
    gray: 'rgb(250, 250, 250)',
    darkGray: 'rgb(51,51,51)',
  },
} as const;

export const font = {
  family: 'SF Mono, ui-monospace, monospace',
  weight: {
    regular: 200,
    semibold: 500,
    bold: 600,
  },
} as const;

export const spacing = {
  y: 8,
  x: 4,
} as const;
