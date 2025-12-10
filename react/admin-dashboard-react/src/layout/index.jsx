import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "./Layout.css";

export default function Layout({ children }) {
  return (
    <div className="layout-container">
      <Sidebar />

      <div className="main-content">
        <Header />
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
}