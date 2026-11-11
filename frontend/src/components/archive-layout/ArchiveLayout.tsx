import { useTranslation } from '@lemuel-manske/i18n/react';

import {
  LAYOUT_ARCHIVE,
  LAYOUT_COLLECTION,
  LAYOUT_DESCRIPTION,
  LAYOUT_EYEBROW,
  LAYOUT_FOOTER,
  LAYOUT_HOME,
  LAYOUT_NAVIGATION,
  LAYOUT_SKIP,
  LAYOUT_TITLE_OPENING,
  LAYOUT_TITLE_ENDING,
  LAYOUT_INSTITUTION,
  LAYOUT_DIVISION,
  LAYOUT_DOCUMENT_TYPE,
  LAYOUT_PRINCIPLE,
} from '../../i18n/message-ids';

import type { ReactNode } from 'react';

import { Heading, HeadingSize, HeadingWeight, Link, Text } from '@lemuel-manske/components';

import { ArchiveArtwork } from './ArchiveArtwork';

import styles from './ArchiveLayout.module.css';

interface ArchiveLayoutProps {
  children: ReactNode;
}

function ArchiveLayout({ children }: ArchiveLayoutProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.layout}>
      <Link href="#main-content" className={styles.skipLink}>
        {t(LAYOUT_SKIP)}
      </Link>

      <header className={styles.header}>
        <div className={styles.identity}>
          <Link href="/" className={styles.brand} aria-label={t(LAYOUT_HOME)}>
            OpenArquive
            <span aria-hidden="true" className={styles.brandMark}>
              ◈
            </span>
          </Link>
          <span className={styles.institution}>{t(LAYOUT_INSTITUTION)}</span>
        </div>

        <nav aria-label={t(LAYOUT_NAVIGATION)} className={styles.navigation}>
          <Link href="#collection">{t(LAYOUT_COLLECTION)}</Link>

          <Link href="#new-capture">{t(LAYOUT_ARCHIVE)}</Link>
        </nav>
      </header>

      <main id="main-content" tabIndex={-1} className={styles.main}>
        <header className={styles.introduction}>
          <div className={styles.heroCopy}>
            <Text className={styles.eyebrow}>
              {t(LAYOUT_EYEBROW)} / {t(LAYOUT_DIVISION)}
            </Text>
            <Heading
              level={1}
              size={HeadingSize.LARGE}
              weight={HeadingWeight.REGULAR}
              className={styles.title}
            >
              <span>{t(LAYOUT_TITLE_OPENING)}</span> <em>{t(LAYOUT_TITLE_ENDING)}</em>
            </Heading>
            <Text className={styles.heroDescription}>{t(LAYOUT_DESCRIPTION)}</Text>
          </div>
          <div className={styles.heroArt}>
            <ArchiveArtwork />
          </div>
          <div className={styles.heroIndex}>
            <span>{t(LAYOUT_DOCUMENT_TYPE)}</span>
            <span>{t(LAYOUT_PRINCIPLE)}</span>
          </div>
        </header>

        {children}
      </main>

      <footer className={styles.footer}>
        <span className={styles.footerBrand}>OpenArquive</span>
        <Text>{t(LAYOUT_FOOTER)}</Text>
        <span className={styles.institution}>{t(LAYOUT_INSTITUTION)}</span>
      </footer>
    </div>
  );
}

export { ArchiveLayout };
