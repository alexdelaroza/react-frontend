import React, { useState } from 'react';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Nav = ({ user, setLogin }: { user: any, setLogin: (loggedIn: boolean) => void }) => {
  const navigate = useNavigate();
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const apiBaseUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

  const logout = async () => {
    try {
      const token = localStorage.getItem('jwt');
      await axios.post(`${apiBaseUrl}/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Logout local efetuado.');
    } finally {
      localStorage.removeItem('jwt');
      delete axios.defaults.headers.common['Authorization'];
      setLogin(false);
      navigate('/login');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        {/* Logo como Menu */}
        <Link className="navbar-brand fw-bold" to="/">
          <span className="text-primary">☰</span> Menu
        </Link>

        <button className="navbar-toggler" type="button" onClick={handleNavCollapse}>
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {user ? (
              <>
                <li className="nav-item">
                  <span className="nav-link disabled text-light me-3">
                    Olá, <strong>{user.Nome}</strong>
                  </span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-danger btn-sm" onClick={logout}>Sair</button>
                </li>
              </>
            ) : (
              <>
                {/* Apenas opção de Entrar disponível */}
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Entrar</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
