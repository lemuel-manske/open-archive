import type { ReactNode } from 'react';

import { Heading, HeadingSize, HeadingWeight, Link, Text } from '@lemuel-manske/components';

import styles from './ArchiveLayout.module.css';

interface ArchiveLayoutProps {
  children: ReactNode;
}

function ArchiveLayout({ children }: ArchiveLayoutProps) {
  return (
    <div className={styles.layout}>
      <Link href="#main-content" className={styles.skipLink}>
        Ir para o conteúdo
      </Link>

      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="OpenArquive — início">
          OpenArquive
        </Link>

        <nav aria-label="Navegação principal" className={styles.navigation}>
          <Link href="#collection">Coleção</Link>

          <Link href="#new-capture">Arquivar</Link>
        </nav>
      </header>

      <main id="main-content" tabIndex={-1} className={styles.main}>
        <header className={styles.introduction}>
          <Text className={styles.eyebrow}>Arquivo pessoal</Text>

          <Heading
            level={1}
            size={HeadingSize.LARGE}
            weight={HeadingWeight.SEMIBOLD}
            className={styles.title}
          >
            A web muda. Suas capturas permanecem.
          </Heading>

          <Text>Preserve páginas da web e revisite o que ficou registrado.</Text>
        </header>

        {children}
      </main>

      <footer className={styles.footer}>
        <Text>OpenArquive · Um acervo sob seus cuidados.</Text>
      </footer>
    </div>
  );
}

export { ArchiveLayout };
