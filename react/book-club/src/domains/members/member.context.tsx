import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import type { Member } from './Member';

const users = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
];

interface MemberContextData {  
  addMember(name: string): void;
}

const MemberContext = createContext<MemberContextData | null>(null);

export function MemberProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<Member[]>(
    users
  );

  function addMember(name: string) {
    setMembers(prev => [
      ...prev,
      { id: crypto.randomUUID(), name }
    ]);
  }

  return (
    <MemberContext.Provider value={{ members, addMember }}>
      {children}
    </MemberContext.Provider>
  );
}

export function useMembers() {
  const context = useContext(MemberContext);
  if (!context) {
    throw new Error('useMembers must be used within MemberProvider');
  }
  return context;
}