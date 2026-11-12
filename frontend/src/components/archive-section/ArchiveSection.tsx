import type { ReactNode, Ref } from 'react';
import { Heading, Text } from '@lemuel-manske/components';
import { Size, Weight } from '@lemuel-manske/design-tokens';

import styles from './ArchiveSection.module.css';

interface ArchiveSectionProps {
  id: string;
  title: string;
  kicker?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  sectionRef?: Ref<HTMLElement>;
}

function ArchiveSection({
  id,
  title,
  kicker,
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
          {kicker && (
            <Text size={Size.SMALL} tone="accent">
              {kicker}
            </Text>
          )}

          <Heading id={titleId} weight={Weight.REGULAR}>
            {title}
          </Heading>

          {description && (
            <div className={styles.description}>
              <Text tone="secondary">{description}</Text>
            </div>
          )}
        </div>

        {actions && <div className={styles.actions}>{actions}</div>}
      </header>

      {children}
    </section>
  );
}

export { ArchiveSection };
