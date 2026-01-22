import { apiFetch } from "./apiFetch";

export type MemberRole = "ADMIN" | "MEMBER";

export type MemberResponse = {
  id: string;
  clubId: string;
  userId: string;
  role: MemberRole;
  displayName?: string | null;
  createdAt?: string;
};

export type MemberCreateRequest = {
  userId: string;
  displayName: string;
};

export function listMembers(clubId: string) {
  return apiFetch<MemberResponse[]>(`/api/clubs/${clubId}/members`);
}

export function addMember(clubId: string, payload: MemberCreateRequest) {
  return apiFetch<MemberResponse>(`/api/clubs/${clubId}/members`, {
    method: "POST",
    body: JSON.stringify({
      userId: payload.userId,
      displayName: payload.displayName,
    }),
  });
}

export function removeMember(clubId: string, memberId: string) {
  return apiFetch<void>(`/api/clubs/${clubId}/members/${memberId}`, {
    method: "DELETE",
  });
}
