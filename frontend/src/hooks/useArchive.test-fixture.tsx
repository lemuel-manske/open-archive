import { useArchive } from './useArchive';

function ArchiveHook() {
  const archive = useArchive();

  return (
    <div>
      <button
        disabled={!archive.collection.captures[0]}
        onClick={() => archive.selectCapture(archive.collection.captures[0]._id)}
      >
        Selecionar
      </button>

      <button onClick={archive.closeReplay}>Fechar</button>

      <p role="status">{archive.selectedCapture?.url ?? 'Nenhuma captura selecionada.'}</p>
    </div>
  );
}

export { ArchiveHook };
