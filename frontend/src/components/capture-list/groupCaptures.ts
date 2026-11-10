import type { Capture } from "../../types/capture";

import type { CaptureGroup } from "./types";

function groupCaptures(captures: Capture[]): CaptureGroup[] {
  const groups = new Map<string, Capture[]>();

  for (const capture of captures) {
    const versions = groups.get(capture.url) ?? [];

    versions.push(capture);

    groups.set(capture.url, versions);
  }

  return Array.from(groups, ([url, versions]) => ({
    url,
    versions: versions.sort(
      (first, second) => Date.parse(second.created_at) - Date.parse(first.created_at),
    ),
  })).sort(
    (first, second) =>
      Date.parse(second.versions[0].created_at) - Date.parse(first.versions[0].created_at),
  );
}

export { groupCaptures };
