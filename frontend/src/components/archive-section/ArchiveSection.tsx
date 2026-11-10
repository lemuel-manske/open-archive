import type { ReactNode, Ref } from "react";

import { Heading, Text } from "@lemuel-manske/components";

import styles from "./ArchiveSection.module.css";

interface ArchiveSectionProps {
  id: string;

  title: string;

  description?: string;

  actions?: ReactNode;

  children: ReactNode;

  sectionRef?: Ref<HTMLElement>;
}

function ArchiveSection({
  id,
  title,
  description,
  actions,
  children,
  sectionRef,
}: ArchiveSectionProps) {
  const titleId = `${id}-title`;

  return (
    <section
      id={id}
      ref={sectionRef}
      tabIndex={-1}
      aria-labelledby={titleId}
      className={styles.section}
    >
      <header className={styles.header}>
        <div className={styles.heading}>
          <Heading id={titleId}>{title}</Heading>

          {description && <Text className={styles.description}>{description}</Text>}
        </div>

        {actions && <div className={styles.actions}>{actions}</div>}
      </header>

      {children}
    </section>
  );
}

export { ArchiveSection };
