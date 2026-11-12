import { archiveTheme, createTheme, Size, Weight } from '@lemuel-manske/design-tokens';

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

import { Heading, Link, LinkAppearance, Text, Theme } from '@lemuel-manske/components';

import { ArchiveArtwork } from './ArchiveArtwork';

import styles from './ArchiveLayout.module.css';

interface ArchiveLayoutProps {
  children: ReactNode;
}

const heroTheme = createTheme(archiveTheme, {
  text: { display: 'clamp(3.65rem, 7.6vw, 7.4rem)' },
  leading: { display: '0.94' },
  tracking: { display: '-0.055em' },
});

function ArchiveLayout({ children }: ArchiveLayoutProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.layout}>
      <a href="#main-content" className={styles.skipLink}>
        {t(LAYOUT_SKIP)}
      </a>

      <header className={styles.header}>
        <div className={styles.identity}>
          <a href="/" className={styles.brand} aria-label={t(LAYOUT_HOME)}>
            OpenArquive
            <span aria-hidden="true" className={styles.brandMark}>
              ◈
            </span>
          </a>
          <span className={styles.institution}>{t(LAYOUT_INSTITUTION)}</span>
        </div>

        <nav aria-label={t(LAYOUT_NAVIGATION)} className={styles.navigation}>
          <Link href="#collection" appearance={LinkAppearance.ACTION} size={Size.SMALL}>
            {t(LAYOUT_COLLECTION)}
          </Link>

          <Link href="#new-capture" appearance={LinkAppearance.ACTION} size={Size.SMALL}>
            {t(LAYOUT_ARCHIVE)}
          </Link>
        </nav>
      </header>

      <main id="main-content" tabIndex={-1} className={styles.main}>
        <header className={styles.introduction}>
          <div className={styles.heroCopy}>
            <div className={styles.eyebrow}>
              <Text size={Size.SMALL} tone="accent">
                {t(LAYOUT_EYEBROW)} / {t(LAYOUT_DIVISION)}
              </Text>
            </div>

            <div className={styles.title}>
              <Theme theme={heroTheme}>
                <Heading level={1} size={Size.XLARGE} weight={Weight.REGULAR} tone="accent">
                  <span className={styles.titleLine}>{t(LAYOUT_TITLE_OPENING)}</span>{' '}
                  <em className={styles.titleLine}>{t(LAYOUT_TITLE_ENDING)}</em>
                </Heading>
              </Theme>
            </div>

            <div className={styles.heroDescription}>
              <Text size={Size.LARGE} tone="secondary">
                {t(LAYOUT_DESCRIPTION)}
              </Text>
            </div>
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

        <Text size={Size.SMALL} tone="secondary">
          {t(LAYOUT_FOOTER)}
        </Text>

        <span className={styles.institution}>{t(LAYOUT_INSTITUTION)}</span>
      </footer>
    </div>
  );
}

export { ArchiveLayout };
