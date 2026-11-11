import type { ReactNode, Ref } from 'react';

import { Heading, Text } from '@lemuel-manske/components';

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
          {kicker && <Text className={styles.kicker}>{kicker}</Text>}
          <Heading id={titleId} className={styles.title}>
            {title}
          </Heading>

          {description && <Text className={styles.description}>{description}</Text>}
        </div>

        {actions && <div className={styles.actions}>{actions}</div>}
      </header>

      {children}
    </section>
  );
}

export { ArchiveSection };
