import { captureListProps } from "./CaptureList.test-fixture";

import { useCaptureList } from "./useCaptureList";

function CaptureListHook() {
  const collection = useCaptureList(captureListProps);

  return (
    <div>
      <label>
        Busca
        <input
          value={collection.query}
          onChange={(event) => collection.setQuery(event.target.value)}
        />
      </label>

      <p role="status">{collection.groups.length} resultados</p>
    </div>
  );
}

export { CaptureListHook };
