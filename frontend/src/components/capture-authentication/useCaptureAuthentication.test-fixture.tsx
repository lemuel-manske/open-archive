import type { CaptureAuthenticationProps } from './types';

import { authenticationProps } from './CaptureAuthentication.test-fixture';

import { useCaptureAuthentication } from './useCaptureAuthentication';

function AuthenticationHook(props: Partial<CaptureAuthenticationProps>) {
  const authentication = useCaptureAuthentication({ ...authenticationProps, ...props });

  return (
    <div>
      <label>
        URL de login
        <input
          value={authentication.loginUrl}
          onChange={(event) => authentication.setLoginUrl(event.target.value)}
        />
      </label>

      <button disabled={!authentication.canStart} onClick={() => void authentication.start()}>
        Conectar
      </button>

      {authentication.error && <p role="alert">{authentication.error}</p>}
    </div>
  );
}

export { AuthenticationHook };
