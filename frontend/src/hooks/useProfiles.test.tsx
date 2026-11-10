import { expect, test } from "@lemuel-manske/config-playwright";

import { mockArchiveApi } from "../App.test-fixture";

import { runningLogin, savedProfile } from "../types/capture.test-fixture";

import { ProfilesHook } from "./useProfiles.test-fixture";

test("useProfiles loads saved accounts", async ({ render, page }) => {
  await mockArchiveApi(page, [], [savedProfile]);

  const authentication = await render(<ProfilesHook />);

  await authentication.getByRole("combobox").selectOption(savedProfile._id);

  await expect(authentication.getByRole("combobox")).toHaveValue(savedProfile._id);
});

test("useProfiles clears the selected account after deleting it", async ({ render, page }) => {
  await mockArchiveApi(page, [], [savedProfile]);

  const authentication = await render(<ProfilesHook />);

  await authentication.getByRole("combobox").selectOption(savedProfile._id);

  await authentication.getByRole("button", { name: "Remover" }).click();

  await expect(authentication.getByRole("combobox")).toHaveValue("");
});

test("useProfiles restores a pending login session", async ({ render, page }) => {
  await mockArchiveApi(page);

  await page.evaluate(() => window.sessionStorage.setItem("openarchive.loginSession", "login-1"));

  await page.route("**/login-sessions/login-1", (route) => route.fulfill({ json: runningLogin }));

  const authentication = await render(<ProfilesHook />);

  await expect(authentication.getByRole("status")).toHaveText("running");
});

test("useProfiles starts a login session", async ({ render, page }) => {
  await mockArchiveApi(page);

  await page.route("**/login-sessions**", (route) => route.fulfill({ json: runningLogin }));

  const authentication = await render(<ProfilesHook />);

  await authentication.getByRole("button", { name: "Conectar" }).click();

  await expect(authentication.getByRole("status")).toHaveText("running");
});

test("useProfiles requests cancellation of an active login", async ({ render, page }) => {
  await mockArchiveApi(page);

  await page.route("**/login-sessions**", (route) =>
    route.request().method() === "DELETE"
      ? route.fulfill({ status: 204 })
      : route.fulfill({ json: runningLogin }),
  );

  const authentication = await render(<ProfilesHook />);

  await authentication.getByRole("button", { name: "Conectar" }).click();

  await expect(authentication.getByRole("status")).toHaveText("running");

  await authentication.getByRole("button", { name: "Cancelar" }).click();

  await expect(authentication.getByRole("status")).toHaveText("cancelling");
});

test("useProfiles reports account API failures", async ({ render, page }) => {
  await mockArchiveApi(page);

  await page.route("**/profiles**", (route) => route.fulfill({ status: 500 }));

  const authentication = await render(<ProfilesHook />);

  await expect(authentication.getByRole("alert")).toContainText("HTTP 500");
});
