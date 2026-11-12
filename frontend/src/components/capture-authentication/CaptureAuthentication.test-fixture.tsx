import type { CaptureAuthenticationProps } from './types';

const authenticationProps: CaptureAuthenticationProps = {
  url: 'https://example.org/',
  profiles: [],
  profileId: '',
  session: null,
  busy: false,
  onSelect: () => {},
  onStart: async () => true,
  onCancel: async () => {},
  onDelete: async () => true,
};

export { authenticationProps };
