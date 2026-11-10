import { expect, test } from "@lemuel-manske/config-playwright";

import { ArchiveLayout } from "../archive-layout/ArchiveLayout";

import { ConfirmationDialog } from "./ConfirmationDialog";

test("ConfirmationDialog only performs its action after confirmation", async ({ render }) => {
  let confirmed = false;

  const dialog = await render(
    <ConfirmationDialog
      open
      title="Excluir captura?"
      description="Esta ação é permanente."
      confirmLabel="Excluir"
      onConfirm={async () => {
        confirmed = true;
        return true;
      }}
      onClose={() => {}}
    />,
  );

  await dialog.getByRole("button", { name: "Excluir", exact: true }).click();

  await expect.poll(() => confirmed).toBe(true);
});

test("ConfirmationDialog shows failures inside the modal", async ({ render }) => {
  const dialog = await render(
    <ConfirmationDialog
      open
      title="Excluir captura?"
      description="Esta ação é permanente."
      confirmLabel="Excluir"
      onConfirm={async () => false}
      onClose={() => {}}
    />,
  );

  await dialog.getByRole("button", { name: "Excluir", exact: true }).click();

  await expect(dialog.getByRole("alert")).toHaveText(
    "Não foi possível concluir a exclusão. Tente novamente.",
  );
});

test("ConfirmationDialog has no accessibility violations", async ({ render, page }) => {
  await render(
    <ArchiveLayout>
      <ConfirmationDialog
        open
        title="Excluir captura?"
        description="Esta ação é permanente."
        confirmLabel="Excluir"
        onConfirm={async () => true}
        onClose={() => {}}
      />
    </ArchiveLayout>,
  );

  await expect(page).noAccessibilityViolations();
});
