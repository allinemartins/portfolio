import { useEffect, useState } from "react";
import { useClub } from "../clubs/ClubProvider";
import { addMember, listMembers, removeMember, type MemberResponse, type MemberRole } from "../api/members";

export function Members() {
  const { selectedClub, isLoading: isLoadingClub } = useClub();
  const clubId = selectedClub?.clubId;

  const isAdmin = selectedClub?.role === "ADMIN";

  const [members, setMembers] = useState<MemberResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  // form
  const [userId, setUserId] = useState("");
  const [displayName, setDisplayName] = useState("");

  async function load() {
    if (!clubId) return;
    setLoading(true);
    setError("");
    try {
      const data = await listMembers(clubId);
      setMembers(data);
    } catch (e: any) {
      setError(e?.message ?? "Erro ao carregar membros");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isLoadingClub) return;
    if (!clubId) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingClub, clubId]);

  async function onAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!clubId) return;

    setError("");

    try {
      await addMember(clubId, { userId, displayName });
      setUserId("");
      setDisplayName("");
      await load();
    } catch (e: any) {
      setError(e?.message ?? "Erro ao adicionar membro");
    }
  }

  async function onRemove(memberId: string) {
    if (!clubId) return;

    setBusyId(memberId);
    setError("");

    try {
      await removeMember(clubId, memberId);
      await load();
    } catch (e: any) {
      setError(e?.message ?? "Erro ao remover membro");
    } finally {
      setBusyId(null);
    }
  }

  if (isLoadingClub) return <div style={{ color: "#666" }}>Carregando clube…</div>;
  if (!selectedClub) return <div style={{ color: "#666" }}>Nenhum clube selecionado.</div>;

  return (
    <div>
      <h2 style={{ margin: 0 }}>Membros</h2>
      <p style={{ color: "#666", marginTop: 6 }}>
        Clube: <b>{selectedClub.clubName}</b> · Seu papel: <b>{selectedClub.role}</b>
      </p>

      {error && (
        <div style={{ marginTop: 12, padding: 12, border: "1px solid #f5c2c7", borderRadius: 8 }}>
          <b>Erro:</b> {error}
        </div>
      )}

      {/* Form */}
      {isAdmin && (
        <section
          style={{
            marginTop: 16,
            padding: 16,
            border: "1px solid #eee",
            borderRadius: 12,
            background: "white",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Adicionar membro</h3>
          <form onSubmit={onAdd} style={{ display: "grid", gap: 10, maxWidth: 520 }}>
            <input
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="UserId do Keycloak (UUID)"
              required
              style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
            />

            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              placeholder="Nome de exibição"
              style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
            />

            <button
              type="submit"
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #ddd",
                background: "white",
                cursor: "pointer",
                width: 220,
              }}
            >
              Adicionar
            </button>
            
          </form>
        </section>
      )}

      {/* Lista */}
      <section style={{ marginTop: 16 }}>
        {loading ? (
          <div style={{ color: "#666" }}>Carregando membros…</div>
        ) : members.length === 0 ? (
          <div style={{ color: "#666" }}>Nenhum membro encontrado.</div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {members.map((m) => {
              const busy = busyId === m.id;

              return (
                <div
                  key={m.id}
                  style={{
                    padding: 14,
                    border: "1px solid #eee",
                    borderRadius: 12,
                    background: "white",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800 }}>
                      {m.displayName || m.userId}
                    </div>
                    <div style={{ color: "#666", fontSize: 13 }}>
                      role: <b>{m.role}</b> · userId: <code>{m.userId}</code>
                    </div>
                  </div>

                  {/* Remove */}
                  {isAdmin && (
                    <button
                      disabled={busy}
                      onClick={() => onRemove(m.id)}
                      style={{
                        padding: "8px 10px",
                        borderRadius: 10,
                        border: "1px solid #f5c2c7",
                        background: "white",
                        cursor: "pointer",
                      }}
                    >
                      {busy ? "…" : "Remover"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* warning */}
      {!isAdmin && (
        <div style={{ marginTop: 14, fontSize: 13, color: "#666" }}>
          Apenas <b>ADMIN</b> pode adicionar ou remover membros.
        </div>
      )}
    </div>
  );
}
