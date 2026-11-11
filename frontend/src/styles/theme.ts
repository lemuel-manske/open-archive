import { archiveTheme } from '@lemuel-manske/design-tokens';
import type { DesignTokens } from '@lemuel-manske/design-tokens';

const openArchiveTheme: DesignTokens = {
  ...archiveTheme,
  color: {
    ...archiveTheme.color,
    background: '#F6F3EB',
    surface: '#EFEBE0',
    'surface-muted': '#E5E8DD',
    border: '#858577',
    'text-primary': '#252B27',
    'text-secondary': '#596057',
  },
  action: {
    ...archiveTheme.action,
    primary: '#254F46',
    'primary-hover': '#193E36',
    'secondary-foreground': '#254F46',
    'secondary-hover': '#E5E8DD',
  },
  state: { ...archiveTheme.state, focus: '#254F46', success: '#254F46' },
};

export { openArchiveTheme };
