import styles from "./styles/Dashboard.module.css";
import { useClub } from "../clubs/ClubProvider";
import { DashboardHeader } from "../components/DashboardHeader";
import { DashboardBanner } from "../components/DashboardBanner";
import { DashboardError } from "../components/DashboardError";
import { CurrentBookSection } from "../components/CurrentBookSection";
import { StatsSection } from "../components/StatsSection";
import { useDashboardData } from "../hooks/useDashboardData";
import { UI_TEXTS } from "../constants/uiTexts";

export function Dashboard() {
  const { selectedClub, isLoading: isLoadingClub } = useClub();
  const clubId = selectedClub?.clubId;

  const vm = useDashboardData({ clubId, isLoadingClub });

  if (isLoadingClub) {
    return <div className={styles.state}>{UI_TEXTS.messages.loading}</div>;
  }

  if (!selectedClub) {
    return <div className={styles.state}>{UI_TEXTS.messages.noClubSelected}</div>;
  }

  return (
    <div className={styles.page}>
      <DashboardHeader clubName={selectedClub.clubName} />

      <DashboardBanner text={vm.banner} />
      <DashboardError message={vm.error} />

      <CurrentBookSection
        isLoading={vm.isLoading}
        current={vm.current}
        summary={vm.summary}
        busyAction={vm.busyAction}
        onFinish={vm.onFinish}
        onRate={vm.onRate}
      />

      <StatsSection isLoading={vm.isLoading} stats={vm.stats} />
    </div>
  );
}
