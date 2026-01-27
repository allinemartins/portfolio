import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getMyMemberships, type Membership } from "../api/memberships";

type ClubContextValue = {
  memberships: Membership[];
  selectedClub?: Membership;
  selectClubById: (clubId: string) => void;
  isLoading: boolean;
};

const ClubContext = createContext<ClubContextValue | undefined>(undefined);

const STORAGE_KEY = "bookclub:selectedClubId";

export function ClubProvider({ children }: { children: React.ReactNode }) {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [selectedClubId, setSelectedClubId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  /*const auth = useAuth();
  if (!auth.user) {
    return <>{children}</>;
  }*/

  useEffect(() => {
    
    (async () => {
      try {
        const data = await getMyMemberships();
        setMemberships(data);

        const saved = localStorage.getItem(STORAGE_KEY) || undefined;
        const initial =
          (saved && data.find(m => m.clubId === saved)?.clubId) ||
          data[0]?.clubId;

        setSelectedClubId(initial);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const selectClubById = (clubId: string) => {
    setSelectedClubId(clubId);
    localStorage.setItem(STORAGE_KEY, clubId);
  };

  const selectedClub = useMemo(
    () => memberships.find(m => m.clubId === selectedClubId),
    [memberships, selectedClubId]
  );

  const value = useMemo(
    () => ({ memberships, selectedClub, selectClubById, isLoading }),
    [memberships, selectedClub, isLoading]
  );

  return <ClubContext.Provider value={value}>{children}</ClubContext.Provider>;
}

export function useClub() {
  const ctx = useContext(ClubContext);
  if (!ctx) throw new Error("useClub must be used within ClubProvider");
  return ctx;
}
