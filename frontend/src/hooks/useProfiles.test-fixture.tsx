import { useProfiles } from "./useProfiles";

function ProfilesHook() {
  const authentication = useProfiles();

  return (
    <div>
      <label>
        Conta
        <select
          value={authentication.profileId}
          onChange={(event) => authentication.setProfileId(event.target.value)}
        >
          <option value="">Pública</option>

          {authentication.profiles.map((profile) => (
            <option key={profile._id} value={profile._id}>
              {profile.name}
            </option>
          ))}
        </select>
      </label>

      <button
        disabled={authentication.busy}
        onClick={() => void authentication.start("https://example.org/")}
      >
        Conectar
      </button>

      <button disabled={authentication.busy} onClick={() => void authentication.cancel()}>
        Cancelar
      </button>

      <button
        disabled={authentication.busy || !authentication.profileId}
        onClick={() => void authentication.remove(authentication.profileId)}
      >
        Remover
      </button>

      <p role="status">{authentication.session?.status ?? "Sem sessão"}</p>

      {authentication.error && <p role="alert">{authentication.error}</p>}
    </div>
  );
}

export { ProfilesHook };
