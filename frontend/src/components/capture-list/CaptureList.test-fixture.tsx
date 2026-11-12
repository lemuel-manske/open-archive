import type { CaptureListProps } from './types';

import { completedCapture } from '../../types/capture.test-fixture';

const captureListProps: CaptureListProps = {
  captures: [completedCapture],
  loading: false,
  selectedId: null,
  deletingId: null,
  onSelect: () => {},
  onDelete: async () => true,
  onRefresh: async () => {},
};

export { captureListProps };
