import { expect, test } from "@openarchive/config-playwright";

import { mockArchiveApi } from "../App.test-fixture";

import { CapturesHook } from "./useCaptures.test-fixture";

test("useCaptures loads the collection", async ({ render, page }) => {
  await mockArchiveApi(page);

  const collection = await render(<CapturesHook />);

  await expect(collection.getByRole("status")).toHaveText("1 capturas");
});

test("useCaptures refreshes the collection after creating a capture", async ({ render, page }) => {
  await mockArchiveApi(page, []);

  const collection = await render(<CapturesHook />);

  await collection.getByRole("button", { name: "Criar" }).click();

  await expect(collection.getByRole("status")).toHaveText("1 capturas");
});

test("useCaptures removes a deleted capture from its collection", async ({ render, page }) => {
  await mockArchiveApi(page);

  const collection = await render(<CapturesHook />);

  await collection.getByRole("button", { name: "Excluir" }).click();

  await expect(collection.getByRole("status")).toHaveText("0 capturas");
});

test("useCaptures exposes API failures", async ({ render, page }) => {
  await page.route("**/captures**", (route) => route.fulfill({ status: 500 }));

  const collection = await render(<CapturesHook />);

  await expect(collection.getByRole("alert")).toContainText("HTTP 500");
});
