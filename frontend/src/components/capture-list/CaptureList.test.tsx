import { expect, test } from "@openarchive/config-playwright";

import { completedCapture } from "../../types/capture.test-fixture";

import { ArchiveLayout } from "../archive-layout/ArchiveLayout";

import { CaptureList } from "./CaptureList";

import { captureListProps } from "./CaptureList.test-fixture";

test("CaptureList filters archived URLs", async ({ render }) => {
  const collection = await render(<CaptureList {...captureListProps} />);

  await collection.getByRole("searchbox", { name: "Buscar no acervo" }).fill("missing.example");

  await expect(collection.getByText("Nenhum site encontrado para esta busca.")).toBeVisible();
});

test("CaptureList selects a completed capture for replay", async ({ render }) => {
  let selected = "";

  const collection = await render(
    <CaptureList
      {...captureListProps}
      onSelect={(id) => {
        selected = id;
      }}
    />,
  );

  await collection.getByText(completedCapture.url, { exact: true }).click();

  await collection.getByRole("button", { name: "Reproduzir" }).click();

  await expect.poll(() => selected).toBe(completedCapture._id);
});

test("CaptureList requires confirmation before deletion", async ({ render }) => {
  let removed = "";

  const collection = await render(
    <CaptureList
      {...captureListProps}
      onDelete={async (id) => {
        removed = id;
        return true;
      }}
    />,
  );

  await collection.getByText(completedCapture.url, { exact: true }).click();

  await collection.getByRole("button", { name: "Excluir", exact: true }).click();

  await collection.getByRole("dialog").getByRole("button", { name: "Cancelar" }).click();

  expect(removed).toBe("");
});

test("CaptureList blocks deletion while a capture is running", async ({ render }) => {
  const collection = await render(
    <CaptureList {...captureListProps} captures={[{ ...completedCapture, status: "running" }]} />,
  );

  await collection.getByText(completedCapture.url, { exact: true }).click();

  await expect(collection.getByRole("button", { name: "Excluir" })).toBeDisabled();
});

test("CaptureList preserves archive downloads", async ({ render }) => {
  const collection = await render(<CaptureList {...captureListProps} />);

  await collection.getByText(completedCapture.url, { exact: true }).click();

  await expect(collection.getByRole("link", { name: "Baixar WACZ" })).toHaveAttribute(
    "href",
    "/captures/capture-1/archive",
  );
});

test("CaptureList has no accessibility violations", async ({ render, page }) => {
  const layout = await render(
    <ArchiveLayout>
      <CaptureList {...captureListProps} />
    </ArchiveLayout>,
  );

  await layout.getByText(completedCapture.url, { exact: true }).click();

  await expect(page).noAccessibilityViolations();
});
