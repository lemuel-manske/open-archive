import { expect, test } from "@lemuel-manske/config-playwright";

import { CaptureListHook } from "./useCaptureList.test-fixture";

test("useCaptureList matches URLs without case sensitivity", async ({ render }) => {
  const collection = await render(<CaptureListHook />);

  await collection.getByRole("textbox").fill("  EXAMPLE.ORG  ");

  await expect(collection.getByRole("status")).toHaveText("1 resultados");
});
