import { useState } from "react";

import { useRequest } from "./useRequest";

function RequestHook() {
  const request = useRequest();

  const [result, setResult] = useState("");

  async function load() {
    const response = await request.execute(async (signal) => {
      const response = await fetch("/request-test", { signal });

      if (!response.ok) throw new Error("Falha ao carregar.");

      return response.text();
    });

    if (response) setResult(response.data);
  }

  return (
    <div>
      <button onClick={() => void load()}>Carregar</button>

      <button onClick={request.cancel}>Cancelar</button>

      <p role="status">{request.pending ? "Carregando" : result || "Pronto"}</p>

      {request.error && <p role="alert">{request.error}</p>}
    </div>
  );
}

export { RequestHook };
