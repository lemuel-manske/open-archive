import type { Capture } from "../../types/capture";

interface CaptureListProps {
  captures: Capture[];

  loading: boolean;

  selectedId: string | null;

  deletingId: string | null;

  onSelect: (id: string) => void;

  onDelete: (id: string) => Promise<boolean>;

  onRefresh: () => Promise<void>;
}

interface CaptureGroup {
  url: string;

  versions: Capture[];
}

export type { CaptureListProps, CaptureGroup };
