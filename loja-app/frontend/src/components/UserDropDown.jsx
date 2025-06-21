import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../services/AuthContext";
import { useNavigate } from "react-router-dom";
import "./userDropdown.css";
import UserL from "../assets/icone/UserL.png"; // Caminho do ícone padrão

export default function UserDropdown() {
  const { user, setUser } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };

  if (!user) {
    return (
      <button className="login-button" onClick={() => navigate("/login")}>
        Cadastre-se
      </button>
    );
  }

  const userImage = user.fotoUrl || UserL;

  return (
    <div className="user-dropdown" ref={ref}>
      <img
        src={userImage}
        alt="User"
        className="user-avatar"
        onClick={() => setOpen((prev) => !prev)}
      />
      {open && (
        <div className="dropdown-menu">
          <div className="menu-header">
            <div>{user.nome || "Usuário"}</div>
            <div>{user.email || "sem@email.com"}</div>
          </div>
          <ul>
            <button className="logout-button"
              onClick={() => {
                setOpen(false); // Fecha o dropdown
                navigate("/settings");
              }}
            >
              Settings
            </button>
          </ul>
          <button onClick={handleLogout} className="logout-button">
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
