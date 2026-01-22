import { apiFetch } from "./apiFetch";

export type Membership = {
  clubId: string;
  clubName: string;
  role: "ADMIN" | "MEMBER";
};

export function getMyMemberships() {
  return apiFetch<Membership[]>("/api/me/memberships");
}
