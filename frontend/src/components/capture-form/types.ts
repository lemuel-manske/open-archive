import type { BrowserProfile, CaptureRequest, LoginSession } from "../../types/capture";

interface CaptureFormProps {
  busy: boolean;

  profiles: BrowserProfile[];

  profileId: string;

  session: LoginSession | null;

  profileBusy: boolean;

  onSelectProfile: (id: string) => void;

  onStartLogin: (url: string) => Promise<boolean>;

  onCancelLogin: () => Promise<void>;

  onDeleteProfile: (id: string) => Promise<boolean>;

  onSubmit: (request: CaptureRequest) => Promise<unknown>;
}

export type { CaptureFormProps };
