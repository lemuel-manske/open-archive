import type { CaptureFormProps } from './types';

const captureFormProps: CaptureFormProps = {
  busy: false,
  profiles: [],
  profileId: '',
  session: null,
  profileBusy: false,
  onSelectProfile: () => {},
  onStartLogin: async () => true,
  onCancelLogin: async () => {},
  onDeleteProfile: async () => true,
  onSubmit: async () => true,
};

export { captureFormProps };
