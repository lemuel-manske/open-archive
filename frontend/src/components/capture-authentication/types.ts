import type { BrowserProfile, LoginSession } from "../../types/capture";

interface CaptureAuthenticationProps {
  url: string;

  profiles: BrowserProfile[];

  profileId: string;

  session: LoginSession | null;

  busy: boolean;

  onSelect: (id: string) => void;

  onStart: (url: string) => Promise<boolean>;

  onCancel: () => Promise<void>;

  onDelete: (id: string) => Promise<boolean>;
}

export type { CaptureAuthenticationProps };
