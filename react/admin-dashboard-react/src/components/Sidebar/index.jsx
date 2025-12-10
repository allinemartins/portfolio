import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">Admin</div>

      <nav className="sidebar-menu">
        <a href="/dashboard">Dashboard</a>
        <a href="#">Users</a>
        <a href="#">Reports</a>
        <a href="#">Settings</a>
      </nav>
    </aside>
  );
}