import { expect, test } from "@openarchive/config-playwright";

import { RequestHook } from "./useRequest.test-fixture";

test("useRequest returns a successful response", async ({ render, page }) => {
  await page.route("**/request-test", (route) => route.fulfill({ body: "Carregado" }));

  const request = await render(<RequestHook />);

  await request.getByRole("button", { name: "Carregar" }).click();

  await expect(request.getByRole("status")).toHaveText("Carregado");
});

test("useRequest reports request failures", async ({ render, page }) => {
  await page.route("**/request-test", (route) => route.fulfill({ status: 500 }));

  const request = await render(<RequestHook />);

  await request.getByRole("button", { name: "Carregar" }).click();

  await expect(request.getByRole("alert")).toHaveText("Falha ao carregar.");
});

test("useRequest ignores another call while a request is pending", async ({ render, page }) => {
  let calls = 0;

  await page.route("**/request-test", () => {
    calls++;
  });

  const request = await render(<RequestHook />);

  await request.getByRole("button", { name: "Carregar" }).click();

  await request.getByRole("button", { name: "Carregar" }).click();

  expect(calls).toBe(1);
});

test("useRequest aborts a cancelled request", async ({ render, page }) => {
  await page.route("**/request-test", () => {});

  const request = await render(<RequestHook />);

  await request.getByRole("button", { name: "Carregar" }).click();

  const aborted = page.waitForEvent("requestfailed");

  await request.getByRole("button", { name: "Cancelar" }).click();

  expect((await aborted).failure()).not.toBeNull();
});

test("useRequest aborts its pending request on unmount", async ({ render, page }) => {
  await page.route("**/request-test", () => {});

  const request = await render(<RequestHook />);

  await request.getByRole("button", { name: "Carregar" }).click();

  const aborted = page.waitForEvent("requestfailed");

  await request.unmount();

  expect((await aborted).failure()).not.toBeNull();
});
