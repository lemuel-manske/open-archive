import { Emphasis, Size, Variant, Weight } from '@lemuel-manske/design-tokens';

import { useLocale } from '../../i18n/useLocale';

import { useTranslation } from '@lemuel-manske/i18n/react';

import {
  CAPTURE_REMOVE_CONFIRM,
  CAPTURE_REMOVE_DESCRIPTION,
  CAPTURE_REMOVE_FALLBACK,
  CAPTURE_REMOVE_TITLE,
  COLLECTION_COUNT,
  COLLECTION_KICKER,
  COLLECTION_VERSIONS,
  COLLECTION_LATEST,
  LAYOUT_DOCUMENT_TYPE,
  COLLECTION_DESCRIPTION,
  COLLECTION_EMPTY,
  COLLECTION_LOADING,
  COLLECTION_NO_RESULTS,
  COLLECTION_PLACEHOLDER,
  COLLECTION_REFRESH,
  COLLECTION_SEARCH,
  COLLECTION_TIMELINE,
  COLLECTION_TITLE,
} from '../../i18n/message-ids';

import {
  Button,
  Field,
  Heading,
  Input,
  Link,
  Spinner,
  Text,
  Timeline,
} from '@lemuel-manske/components';

import { formatDate } from '../../lib/dates';

import { ArchiveSection } from '../archive-section/ArchiveSection';

import { ConfirmationDialog } from '../confirmation-dialog/ConfirmationDialog';

import { CaptureVersion } from './CaptureVersion';

import type { CaptureListProps } from './types';

import { useCaptureList } from './useCaptureList';

import styles from './CaptureList.module.css';

function CaptureList(props: CaptureListProps) {
  const { t } = useTranslation();

  const locale = useLocale();

  const collection = useCaptureList(props);

  return (
    <ArchiveSection
      id="collection"
      title={t(COLLECTION_TITLE)}
      kicker={t(COLLECTION_KICKER)}
      description={t(COLLECTION_DESCRIPTION)}
      sectionRef={collection.sectionRef}
      actions={
        <Button variant={Variant.TERTIARY} onClick={() => void props.onRefresh()}>
          <Button.Label>{t(COLLECTION_REFRESH)}</Button.Label>
        </Button>
      }
    >
      <div className={styles.tools}>
        <div className={styles.search}>
          <Field>
            <Field.Label>{t(COLLECTION_SEARCH)}</Field.Label>

            <Field.Control>
              <Input
                type="search"
                value={collection.query}
                onChange={(event) => collection.setQuery(event.target.value)}
                placeholder={t(COLLECTION_PLACEHOLDER)}
              />
            </Field.Control>
          </Field>
        </div>

        <p role="status" className={styles.count}>
          {t(COLLECTION_COUNT, { sites: collection.totalGroups, captures: props.captures.length })}
        </p>
      </div>

      {props.loading && props.captures.length === 0 ? (
        <Spinner label={t(COLLECTION_LOADING)} />
      ) : collection.groups.length === 0 ? (
        <Text>{collection.totalGroups === 0 ? t(COLLECTION_EMPTY) : t(COLLECTION_NO_RESULTS)}</Text>
      ) : (
        <div className={styles.groups}>
          {collection.groups.map((group) => (
            <section key={group.url} aria-label={group.url} className={styles.group}>
              <header className={styles.recordHeader}>
                <Text size={Size.SMALL} tone="accent">
                  {t(LAYOUT_DOCUMENT_TYPE)}
                </Text>

                <Heading level={3} size={Size.MEDIUM} weight={Weight.REGULAR}>
                  {new URL(group.url).hostname}
                </Heading>

                <div className={styles.url}>
                  <Link href={group.url} target="_blank" size={Size.SMALL}>
                    {group.url}
                  </Link>
                </div>

                <Text size={Size.SMALL} tone="secondary" emphasis={Emphasis.ITALIC}>
                  {t(COLLECTION_VERSIONS, { count: group.versions.length })}
                </Text>

                <dl className={styles.facts}>
                  <div>
                    <dt>{t(COLLECTION_LATEST)}</dt>
                    <dd>
                      <time dateTime={group.versions[0].created_at}>
                        {formatDate(group.versions[0].created_at, locale)}
                      </time>
                    </dd>
                  </div>
                </dl>
              </header>

              <Timeline aria-label={t(COLLECTION_TIMELINE, { url: group.url })}>
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
              </Timeline>
            </section>
          ))}
        </div>
      )}

      <ConfirmationDialog
        open={collection.captureToDelete !== null}
        title={t(CAPTURE_REMOVE_TITLE)}
        description={
          collection.captureToDelete
            ? t(CAPTURE_REMOVE_DESCRIPTION, {
                date: formatDate(collection.captureToDelete.created_at, locale),
              })
            : t(CAPTURE_REMOVE_FALLBACK)
        }
        confirmLabel={t(CAPTURE_REMOVE_CONFIRM)}
        onConfirm={collection.remove}
        onClose={collection.closeRemoval}
      />
    </ArchiveSection>
  );
}

export { CaptureList };
