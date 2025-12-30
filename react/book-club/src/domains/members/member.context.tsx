import { createContext, useContext, useState } from 'react';
import type { Member } from './Member';

type MemberContextType = {
  members: Member[];
  currentMember: Member | null;
  loginWithEmail: (email: string) => void;
};

const MemberContext = createContext<MemberContextType | undefined>(undefined);

const STORAGE_KEY = 'bookclub:member';
const MEMBERS_KEY = 'bookclub:members';

export function MemberProvider({ children }: { children: React.ReactNode }) {
  const [members, setMembers] = useState<Member[]>(() => {
    const stored = localStorage.getItem(MEMBERS_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const [currentMember, setCurrentMember] = useState<Member | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  function loginWithEmail(email: string) {
    const normalizedEmail = email.trim().toLowerCase();

    let member = members.find(m => m.email === normalizedEmail);

    if (!member) {
      member = {
        email: normalizedEmail,
        name: normalizedEmail.split('@')[0],
      };

      const updated = [...members, member];
      setMembers(updated);
      localStorage.setItem(MEMBERS_KEY, JSON.stringify(updated));
    }

    setCurrentMember(member);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(member));
  }

  return (
    <MemberContext.Provider
      value={{ members, currentMember, loginWithEmail }}
    >
      {children}
    </MemberContext.Provider>
  );
}

export function useMemberContext() {
  const ctx = useContext(MemberContext);
  if (!ctx) {
    throw new Error('useMemberContext must be used within MemberProvider');
  }
  return ctx;
}
