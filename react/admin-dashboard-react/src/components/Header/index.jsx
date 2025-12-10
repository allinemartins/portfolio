import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <h2>Dashboard</h2>

      <div className="header-user">
        <span>Alline Martins</span>
        <img 
          src="https://ui-avatars.com/api/?name=Alline+Martins&background=2563eb&color=fff"
          alt="User"
        />
      </div>
    </header>
  );
}