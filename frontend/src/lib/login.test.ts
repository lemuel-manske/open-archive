import { expect, test } from "@openarchive/config-jest/globals";

import { runningLogin } from "../types/capture.test-fixture";

import { isLoginActive } from "./login";

test("isLoginActive blocks capture while login is running", () => {
  expect(isLoginActive(runningLogin)).toBe(true);
});

test("isLoginActive releases capture after login completes", () => {
  expect(isLoginActive({ ...runningLogin, status: "completed" })).toBe(false);
});

test("isLoginActive allows public captures without a login", () => {
  expect(isLoginActive(null)).toBe(false);
});
