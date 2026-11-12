import { useCaptures } from './useCaptures';

function CapturesHook() {
  const collection = useCaptures();

  return (
    <div>
      <button onClick={() => void collection.refresh()}>Atualizar</button>

      <button
        disabled={collection.creating}
        onClick={() =>
          void collection.submit({ url: 'https://new.example.org/', depth: 1, limit: 20 })
        }
      >
        Criar
      </button>

      <button
        disabled={!collection.captures[0] || collection.deletingId !== null}
        onClick={() => void collection.remove(collection.captures[0]._id)}
      >
        Excluir
      </button>

      <p role="status">
        {collection.loading ? 'Carregando' : `${collection.captures.length} capturas`}
      </p>

      {collection.error && <p role="alert">{collection.error}</p>}
    </div>
  );
}

export { CapturesHook };
