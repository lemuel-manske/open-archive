import { expect, test } from "@openarchive/config-jest/globals";

import { completedCapture } from "../../types/capture.test-fixture";

import { groupCaptures } from "./groupCaptures";

test("groupCaptures groups versions by their full URL", () => {
  const older = { ...completedCapture, _id: "older", created_at: "2026-11-08T12:00:00Z" };

  expect(groupCaptures([older, completedCapture])).toEqual([
    { url: completedCapture.url, versions: [completedCapture, older] },
  ]);
});

test("groupCaptures orders sites by their newest capture", () => {
  const older = {
    ...completedCapture,
    url: "https://older.example.org/",
    created_at: "2026-11-08T12:00:00Z",
  };

  expect(groupCaptures([older, completedCapture])[0].url).toBe(completedCapture.url);
});

test("groupCaptures compares instants across timezone offsets", () => {
  const later = { ...completedCapture, _id: "later", created_at: "2026-11-09T10:00:00-03:00" };

  expect(groupCaptures([completedCapture, later])[0].versions[0]._id).toBe("later");
});
