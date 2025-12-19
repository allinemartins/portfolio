import type { Member } from '../members/Member';

export async function fakeLogin(member: Member) {
  // Simulate an asynchronous login operation
  return new Promise<{ user: Member; token: string }>(resolve => {
    setTimeout(() => {
      resolve({
        user: member,
        token: 'fake-token',
      });
    }, 500);
  });
}