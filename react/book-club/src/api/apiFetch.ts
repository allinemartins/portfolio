import { keycloak } from "../auth/keycloak";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);

  if (keycloak.authenticated) {
    await keycloak.updateToken(30).catch(() => false);
    if (keycloak.token) headers.set("Authorization", `Bearer ${keycloak.token}`);
  }

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }

  if (res.status === 204) return undefined as T;

  const ct = res.headers.get("content-type") || "";
  return (ct.includes("application/json") ? res.json() : res.text()) as T;
}
