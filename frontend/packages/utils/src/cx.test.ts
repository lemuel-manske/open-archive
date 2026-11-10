import { expect, test } from "@openarchive/config-jest/globals";

import { cx } from "./cx";

test("cx combines base classes", () => {
  expect(cx("button", "custom")).toBe("button custom");
});

test("cx includes enabled modifiers", () => {
  expect(cx("button", { active: true })).toBe("button active");
});

test("cx omits disabled modifiers", () => {
  expect(cx("button", { active: false })).toBe("button");
});

test("cx ignores optional classes", () => {
  expect(cx("button", null, false, undefined)).toBe("button");
});

test("cx supports an empty input", () => {
  expect(cx()).toBe("");
});
