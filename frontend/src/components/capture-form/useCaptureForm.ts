import { useState } from 'react';

import type { SyntheticEvent } from 'react';

import { isLoginActive } from '../../lib/login';

import type { CaptureFormProps } from './types';

function useCaptureForm({ busy, profileBusy, session, profileId, onSubmit }: CaptureFormProps) {
  const [url, setUrl] = useState('');

  const [depth, setDepth] = useState('1');

  const [limit, setLimit] = useState('20');

  const loginActive = isLoginActive(session);

  const submitDisabled = busy || profileBusy || loginActive;

  async function submit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitDisabled) return;

    const result = await onSubmit({
      url: url.trim(),
      depth: Number(depth),
      limit: Number(limit),
      profile_id: profileId || null,
    });

    if (result) setUrl('');
  }

  return { url, setUrl, depth, setDepth, limit, setLimit, loginActive, submitDisabled, submit };
}

export { useCaptureForm };
