import type { CaptureFormProps } from './types';

import { captureFormProps } from './CaptureForm.test-fixture';

import { useCaptureForm } from './useCaptureForm';

function CaptureFormHook(props: Partial<CaptureFormProps>) {
  const form = useCaptureForm({ ...captureFormProps, ...props });

  return (
    <form onSubmit={(event) => void form.submit(event)}>
      <label>
        URL
        <input
          type="url"
          required
          value={form.url}
          onChange={(event) => form.setUrl(event.target.value)}
        />
      </label>

      <button disabled={form.submitDisabled}>Enviar</button>
    </form>
  );
}

export { CaptureFormHook };
