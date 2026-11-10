import { expect, test } from "@openarchive/config-playwright";

import { runningLogin, savedProfile } from "../../types/capture.test-fixture";

import { CaptureAuthentication } from "./CaptureAuthentication";

import { authenticationProps } from "./CaptureAuthentication.test-fixture";

test("CaptureAuthentication selects a saved profile", async ({ render }) => {
  let selected = "";

  const authentication = await render(
    <CaptureAuthentication
      {...authenticationProps}
      profiles={[savedProfile]}
      onSelect={(id) => {
        selected = id;
      }}
    />,
  );

  await authentication.getByRole("combobox").selectOption({ label: "example.org" });

  await expect.poll(() => selected).toBe(savedProfile._id);
});

test("CaptureAuthentication uses the capture URL for login", async ({ render }) => {
  let started = "";

  const authentication = await render(
    <CaptureAuthentication
      {...authenticationProps}
      onStart={async (url) => {
        started = url;
        return true;
      }}
    />,
  );

  await authentication.getByRole("button", { name: "Conectar nova conta" }).click();

  await authentication.getByRole("button", { name: "Iniciar login" }).click();

  await expect.poll(() => started).toBe(authenticationProps.url);
});

test("CaptureAuthentication cancels an active login", async ({ render }) => {
  let cancelled = false;

  const authentication = await render(
    <CaptureAuthentication
      {...authenticationProps}
      session={runningLogin}
      onCancel={async () => {
        cancelled = true;
      }}
    />,
  );

  await authentication.getByRole("button", { name: "Cancelar conexão" }).click();

  await expect.poll(() => cancelled).toBe(true);
});

test("CaptureAuthentication asks before removing a profile", async ({ render }) => {
  const authentication = await render(
    <CaptureAuthentication
      {...authenticationProps}
      profiles={[savedProfile]}
      profileId={savedProfile._id}
    />,
  );

  await authentication.getByRole("button", { name: "Remover conta" }).click();

  await expect(authentication.getByRole("dialog", { name: "Remover conta salva?" })).toBeVisible();
});

test("CaptureAuthentication exposes the login disclosure state", async ({ render }) => {
  const authentication = await render(<CaptureAuthentication {...authenticationProps} />);

  await authentication.getByRole("button", { name: "Conectar nova conta" }).click();

  await expect(authentication.getByRole("button", { name: "Fechar nova conexão" })).toHaveAttribute(
    "aria-expanded",
    "true",
  );
});
