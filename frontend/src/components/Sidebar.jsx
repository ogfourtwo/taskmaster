import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Tasks", path: "/tasks" },
    { label: "Inbox", path: "/inbox" },
    { label: "Meetings", path: "/meetings" },
    { label: "Calendar", path: "/calendar" },
  ];

  return (
    <div
      style={{
        width: "200px",
        backgroundColor: "#1e1e1e",
        color: "white",
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h2 style={{ marginBottom: "2rem" }}>🧠 TaskApp</h2>
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          style={{
            color: location.pathname === item.path ? "#61dafb" : "#fff",
            marginBottom: "1rem",
            textDecoration: "none",
            fontWeight: location.pathname === item.path ? "bold" : "normal",
          }}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;
