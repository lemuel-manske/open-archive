import { Variant } from '@lemuel-manske/design-tokens';

import { useTranslation } from '@lemuel-manske/i18n/react';

import { AUTH_CLOSE, AUTH_CONNECT, AUTH_INVALID_URL } from '../../i18n/message-ids';

import { useEffect, useRef, useState } from 'react';

import type { ButtonProps } from '@lemuel-manske/components';

import { useAccessibility } from '@lemuel-manske/utils';

import { isLoginActive } from '../../lib/login';

import type { BrowserProfile } from '../../types/capture';

import type { CaptureAuthenticationProps } from './types';

function useCaptureAuthentication({
  url,
  session,
  busy,
  profiles,
  profileId,
  onStart,
  onDelete,
}: CaptureAuthenticationProps) {
  const { t } = useTranslation();

  const [connecting, setConnecting] = useState(false);

  const [loginUrl, setLoginUrl] = useState('');

  const [error, setError] = useState<string | null>(null);

  const [profileToDelete, setProfileToDelete] = useState<BrowserProfile | null>(null);

  const profileControlRef = useRef<HTMLSelectElement>(null);

  const returnFocus = useRef(false);

  const { id: connectionId } = useAccessibility();

  const active = isLoginActive(session);

  const targetUrl = loginUrl.trim() || url.trim();

  const connectButton = {
    children: connecting ? t(AUTH_CLOSE) : t(AUTH_CONNECT),
    variant: Variant.TERTIARY,
    disabled: busy || active,
    onClick: () => setConnecting((current) => !current),
    'aria-expanded': connecting,
    'aria-controls': connectionId,
  } satisfies ButtonProps;

  useEffect(() => {
    if (!profileToDelete && returnFocus.current) {
      profileControlRef.current?.focus();

      returnFocus.current = false;
    }
  }, [profileToDelete]);

  async function start() {
    if (busy || active || !targetUrl) return;

    setError(null);

    try {
      const parsed = new URL(targetUrl);

      if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Invalid protocol');
    } catch {
      setError(t(AUTH_INVALID_URL));

      return;
    }

    const created = await onStart(targetUrl);

    if (created) {
      setLoginUrl('');

      setConnecting(false);
    }
  }

  function requestRemoval() {
    setProfileToDelete(profiles.find((profile) => profile._id === profileId) ?? null);
  }

  async function remove() {
    if (!profileToDelete) return false;

    const removed = await onDelete(profileToDelete._id);

    if (removed) returnFocus.current = true;

    return removed;
  }

  return {
    connecting,
    connectionId,
    connectButton,
    loginUrl,
    setLoginUrl,
    error,
    active,
    canStart: !busy && !active && Boolean(targetUrl),
    start,
    profileToDelete,
    requestRemoval,
    remove,
    closeRemoval: () => setProfileToDelete(null),
    profileControlRef,
  };
}

export { useCaptureAuthentication };
