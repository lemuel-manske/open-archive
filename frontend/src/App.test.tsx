import { expect, test } from "@openarchive/config-playwright";

import App from "./App";

import { mockArchiveApi, mockCompletedLogin } from "./App.test-fixture";

import { completedCapture, savedProfile } from "./types/capture.test-fixture";

test("App loads the archived collection", async ({ render, page }) => {
  await mockArchiveApi(page);

  const app = await render(<App />);

  await expect(app.getByText(completedCapture.url, { exact: true })).toBeVisible();
});

test("App submits a new capture through the application API", async ({ render, page }) => {
  await mockArchiveApi(page, []);

  const app = await render(<App />);

  await app.getByRole("textbox", { name: "URL inicial" }).fill("https://new.example.org/");

  await app.getByRole("button", { name: "Arquivar URL" }).click();

  await expect(app.getByText("https://new.example.org/", { exact: true })).toBeVisible();
});

test("App restores focus after closing a replay", async ({ render, page }) => {
  await mockArchiveApi(page);

  const app = await render(<App />);

  await app.getByText(completedCapture.url, { exact: true }).click();

  await app.getByRole("button", { name: "Reproduzir", exact: true }).click();

  await app.getByRole("button", { name: "Fechar reprodução" }).click();

  await expect(app.getByRole("button", { name: "Reproduzir", exact: true })).toBeFocused();
});

test("App deletes a capture after confirmation", async ({ render, page }) => {
  await mockArchiveApi(page);

  const app = await render(<App />);

  await app.getByText(completedCapture.url, { exact: true }).click();

  await app.getByRole("button", { name: "Excluir", exact: true }).click();

  await app.getByRole("dialog").getByRole("button", { name: "Excluir captura" }).click();

  await expect(app.getByText(completedCapture.url, { exact: true })).not.toBeVisible();
});

test("App has no accessibility violations", async ({ render, page }) => {
  await mockArchiveApi(page);

  const app = await render(<App />);

  await expect(app.getByText(completedCapture.url, { exact: true })).toBeVisible();

  await expect(page).noAccessibilityViolations();
});

test("App selects a saved profile after login finishes", async ({ render, page }) => {
  await mockArchiveApi(page);

  const releaseProfiles = await mockCompletedLogin(page);

  const app = await render(<App />);

  await app.getByRole("textbox", { name: "URL inicial" }).fill("https://example.org/");

  await app.getByRole("button", { name: "Conectar nova conta" }).click();

  await app.getByRole("button", { name: "Iniciar login" }).click();

  await expect(app.getByRole("status").filter({ hasText: "Sessão salva." })).toBeVisible();

  releaseProfiles();

  await expect(app.getByRole("combobox", { name: "Conta para esta captura" })).toHaveValue(
    savedProfile._id,
  );
});

test("App restores focus to the selector after removing an account", async ({ render, page }) => {
  await mockArchiveApi(page, [], [savedProfile]);

  const app = await render(<App />);

  await app
    .getByRole("combobox", { name: "Conta para esta captura" })
    .selectOption(savedProfile._id);

  await app.getByRole("button", { name: "Remover conta" }).click();

  await app.getByRole("dialog").getByRole("button", { name: "Excluir conta" }).click();

  await expect(app.getByRole("combobox", { name: "Conta para esta captura" })).toBeFocused();
});
