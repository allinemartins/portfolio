import "./Card.css";

export default function Card({ title, value }) {
  return (
    <div className="card-element">
      <h4>{title}</h4>
      <p>{value}</p>
    </div>
  );
}
