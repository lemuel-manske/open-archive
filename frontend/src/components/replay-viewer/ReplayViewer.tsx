import { createElement } from "react";

import { Button, ButtonVariant } from "@lemuel-manske/components";

import { ArchiveSection } from "../archive-section/ArchiveSection";

import type { ReplayViewerProps } from "./types";

import { useReplayViewer } from "./useReplayViewer";

import styles from "./ReplayViewer.module.css";

function ReplayViewer(props: ReplayViewerProps) {
  const viewer = useReplayViewer(props);

  return (
    <ArchiveSection
      id="replay"
      title="Reprodução do arquivo"
      description={props.capture.url}
      sectionRef={viewer.sectionRef}
      actions={
        <Button variant={ButtonVariant.SECONDARY} onClick={props.onClose}>
          <Button.Label>Fechar reprodução</Button.Label>
        </Button>
      }
    >
      {createElement("replay-web-page", { ...viewer.replay, className: styles.frame })}
    </ArchiveSection>
  );
}

export { ReplayViewer };
