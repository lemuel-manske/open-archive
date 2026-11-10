import { expect, test } from "@lemuel-manske/config-playwright";

import { CaptureFormHook } from "./useCaptureForm.test-fixture";

test("useCaptureForm clears the URL after success", async ({ render }) => {
  const form = await render(<CaptureFormHook />);

  await form.getByRole("textbox").fill("https://example.org/");

  await form.getByRole("button").click();

  await expect(form.getByRole("textbox")).toHaveValue("");
});

test("useCaptureForm keeps the URL when the request fails", async ({ render }) => {
  const form = await render(<CaptureFormHook onSubmit={async () => null} />);

  await form.getByRole("textbox").fill("https://example.org/");

  await form.getByRole("button").click();

  await expect(form.getByRole("textbox")).toHaveValue("https://example.org/");
});

test("useCaptureForm blocks submission during a profile request", async ({ render }) => {
  const form = await render(<CaptureFormHook profileBusy />);

  await expect(form.getByRole("button")).toBeDisabled();
});
