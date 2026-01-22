import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "../../constants/navItems";
import styles from "./AppNav.module.css";

type Props = {
  variant: "sidebar" | "bottom";
  onNavigate?: () => void;
};

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`;

export function AppNav({ variant, onNavigate }: Props) {
  const iconOnly = variant === "bottom";

  return (
    <nav className={variant === "bottom" ? styles.bottomNav : styles.nav} onClick={onNavigate}>
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.to} to={item.to} className={navLinkClass}>
          <span aria-hidden className={styles.icon}>
            {item.icon}
          </span>
          {!iconOnly && <span className={styles.label}>{item.label}</span>}
        </NavLink>
      ))}
    </nav>
  );
}