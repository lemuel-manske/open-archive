import { expect, test } from "@lemuel-manske/config-playwright";

import type { CaptureRequest } from "../../types/capture";

import { runningLogin } from "../../types/capture.test-fixture";

import { ArchiveLayout } from "../archive-layout/ArchiveLayout";

import { CaptureForm } from "./CaptureForm";

import { captureFormProps } from "./CaptureForm.test-fixture";

test("CaptureForm submits the capture options", async ({ render }) => {
  let request: CaptureRequest | null = null;

  const form = await render(
    <CaptureForm
      {...captureFormProps}
      onSubmit={async (value) => {
        request = value;
        return true;
      }}
    />,
  );

  await form.getByRole("textbox", { name: "URL inicial" }).fill("https://example.org/");

  await form.getByRole("spinbutton", { name: "Profundidade" }).fill("2");

  await form.getByRole("button", { name: "Arquivar URL" }).click();

  await expect
    .poll(() => request)
    .toEqual({ url: "https://example.org/", depth: 2, limit: 20, profile_id: null });
});

test("CaptureForm preserves native required validation", async ({ render }) => {
  const form = await render(<CaptureForm {...captureFormProps} />);

  await form.getByRole("button", { name: "Arquivar URL" }).click();

  await expect(form.getByRole("textbox", { name: "URL inicial" })).toBeFocused();
});

test("CaptureForm blocks submission while connecting an account", async ({ render }) => {
  const form = await render(<CaptureForm {...captureFormProps} session={runningLogin} />);

  await expect(form.getByRole("button", { name: "Arquivar URL" })).toBeDisabled();
});

test("CaptureForm has no accessibility violations", async ({ render, page }) => {
  await render(
    <ArchiveLayout>
      <CaptureForm {...captureFormProps} />
    </ArchiveLayout>,
  );

  await expect(page).noAccessibilityViolations();
});
