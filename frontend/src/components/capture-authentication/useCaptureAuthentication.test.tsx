import { expect, test } from "@lemuel-manske/config-playwright";

import { AuthenticationHook } from "./useCaptureAuthentication.test-fixture";

test("useCaptureAuthentication prefers an explicit login URL", async ({ render }) => {
  let started = "";

  const authentication = await render(
    <AuthenticationHook
      onStart={async (url) => {
        started = url;
        return true;
      }}
    />,
  );

  await authentication.getByRole("textbox").fill("https://accounts.example.org/login");

  await authentication.getByRole("button").click();

  await expect.poll(() => started).toBe("https://accounts.example.org/login");
});

test("useCaptureAuthentication rejects unsupported URL protocols", async ({ render }) => {
  const authentication = await render(<AuthenticationHook />);

  await authentication.getByRole("textbox").fill("file:///tmp/login");

  await authentication.getByRole("button").click();

  await expect(authentication.getByRole("alert")).toHaveText(
    "Informe uma URL válida, começando com http:// ou https://.",
  );
});
