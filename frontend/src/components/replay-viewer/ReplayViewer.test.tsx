import { expect, test } from "@openarchive/config-playwright";

import { completedCapture } from "../../types/capture.test-fixture";

import { ReplayViewer } from "./ReplayViewer";

test("ReplayViewer moves focus to the archived content region", async ({ render }) => {
  const viewer = await render(<ReplayViewer capture={completedCapture} onClose={() => {}} />);

  await expect(viewer).toBeFocused();
});

test("ReplayViewer exposes a close action", async ({ render }) => {
  let closed = false;

  const viewer = await render(
    <ReplayViewer
      capture={completedCapture}
      onClose={() => {
        closed = true;
      }}
    />,
  );

  await viewer.getByRole("button", { name: "Fechar reprodução" }).click();

  await expect.poll(() => closed).toBe(true);
});
