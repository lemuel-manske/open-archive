import type { Weight } from "./enums";

interface DesignTokens {
  color: {
    background: string;
    surface: string;
    "surface-muted": string;
    border: string;
    "text-primary": string;
    "text-secondary": string;
    "text-muted": string;
    "dark-surface": string;
  };

  font: {
    body: string;
    display: string;
    mono: string;
  };

  text: {
    small: string;
    medium: string;
    large: string;
  };

  weight: Record<Weight, number>;

  space: Record<4 | 8 | 12 | 16 | 24 | 32 | 48 | 64 | 96, string>;

  control: {
    small: string;
    medium: string;
    large: string;
  };

  border: {
    width: string;
    radius: string;
  };
}

const archiveTheme = {
  color: {
    background: "#F6F3EB",
    surface: "#EEE9DF",
    "surface-muted": "#E7E0D3",
    border: "#C7BFB2",
    "text-primary": "#211F1B",
    "text-secondary": "#625C53",
    "text-muted": "#756D61",
    "dark-surface": "#34312C",
  },

  font: {
    body: '"EB Garamond", Georgia, serif',
    display: '"Cormorant Garamond", Georgia, serif',
    mono: '"IBM Plex Mono", monospace',
  },

  text: {
    small: "0.875rem",
    medium: "1rem",
    large: "1.125rem",
  },

  weight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  space: {
    4: "0.25rem",
    8: "0.5rem",
    12: "0.75rem",
    16: "1rem",
    24: "1.5rem",
    32: "2rem",
    48: "3rem",
    64: "4rem",
    96: "6rem",
  },

  control: {
    small: "2.75rem",
    medium: "3rem",
    large: "3.25rem",
  },

  border: {
    width: "1px",
    radius: "2px",
  },
} as const satisfies DesignTokens;

export { archiveTheme, type DesignTokens };
