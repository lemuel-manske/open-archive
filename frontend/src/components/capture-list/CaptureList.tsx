import { Button, ButtonVariant, Form, Spinner, Text, TextSize } from "@lemuel-manske/components";

import { formatDate } from "../../lib/dates";

import { ArchiveSection } from "../archive-section/ArchiveSection";

import { ConfirmationDialog } from "../confirmation-dialog/ConfirmationDialog";

import { CaptureVersion } from "./CaptureVersion";

import type { CaptureListProps } from "./types";

import { useCaptureList } from "./useCaptureList";

import styles from "./CaptureList.module.css";

function CaptureList(props: CaptureListProps) {
  const collection = useCaptureList(props);

  return (
    <ArchiveSection
      id="collection"
      title="Sites arquivados"
      description="Expanda um site para consultar e gerenciar suas versões."
      sectionRef={collection.sectionRef}
      actions={
        <Button variant={ButtonVariant.TERTIARY} onClick={() => void props.onRefresh()}>
          <Button.Label>Atualizar histórico</Button.Label>
        </Button>
      }
    >
      <div className={styles.tools}>
        <Form.Field>
          <Form.Field.Label>Buscar no acervo</Form.Field.Label>

          <Form.Field.Control>
            <Form.Input
              type="search"
              value={collection.query}
              onChange={(event) => collection.setQuery(event.target.value)}
              placeholder="URL do site"
            />
          </Form.Field.Control>
        </Form.Field>

        <p role="status" className={styles.count}>
          {collection.totalGroups}{" "}
          {collection.totalGroups === 1 ? "site preservado" : "sites preservados"} ·{" "}
          {props.captures.length} {props.captures.length === 1 ? "captura" : "capturas"}
        </p>
      </div>

      {props.loading && props.captures.length === 0 ? (
        <Spinner label="Carregando histórico…" />
      ) : collection.groups.length === 0 ? (
        <Text>
          {collection.totalGroups === 0
            ? "Ainda não há capturas. Comece arquivando uma URL."
            : "Nenhum site encontrado para esta busca."}
        </Text>
      ) : (
        <ul className={styles.groups}>
          {collection.groups.map((group) => (
            <li key={group.url}>
              <details className={styles.group}>
                <summary className={styles.summary}>
                  <span className={styles.groupHeading}>
                    <span className={styles.url}>{group.url}</span>

                    <Text as="span" size={TextSize.SMALL}>
                      {group.versions.length} {group.versions.length === 1 ? "versão" : "versões"} ·
                      Última captura: {formatDate(group.versions[0].created_at)}
                    </Text>
                  </span>

                  <span aria-hidden="true" className={styles.chevron}>
                    ›
                  </span>
                </summary>

                <ul className={styles.versions}>
                  {group.versions.map((capture) => (
                    <CaptureVersion
                      key={capture._id}
                      capture={capture}
                      selected={props.selectedId === capture._id}
                      deletingId={props.deletingId}
                      onSelect={props.onSelect}
                      onRequestRemoval={collection.requestRemoval}
                    />
                  ))}
                </ul>
              </details>
            </li>
          ))}
        </ul>
      )}

      <ConfirmationDialog
        open={collection.captureToDelete !== null}
        title="Excluir captura?"
        description={
          collection.captureToDelete
            ? `A captura de ${formatDate(collection.captureToDelete.created_at)} e seu arquivo WACZ serão removidos permanentemente.`
            : "O arquivo WACZ será removido permanentemente."
        }
        confirmLabel="Excluir captura"
        onConfirm={collection.remove}
        onClose={collection.closeRemoval}
      />
    </ArchiveSection>
  );
}

export { CaptureList };
