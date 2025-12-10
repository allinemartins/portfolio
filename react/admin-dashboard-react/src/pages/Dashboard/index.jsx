import Layout from "../../layout";
import Card from "../../components/Card";
import "./Dashboard.css";

export default function Dashboard() {
  return (
    <Layout>
      <h1 className="dash-title">Dashboard</h1>

      <div className="cards-container">
        <Card title="Users" value="120" />
        <Card title="Revenue" value="$4,520" />
        <Card title="Sessions" value="8,934" />
      </div>
    </Layout>
  );
}