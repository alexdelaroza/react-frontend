import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Forgot from "./pages/Forgot";
import Reset from "./pages/Reset";
import Nav from "./components/Nav";
import UserMenu from "./pages/UserMenu";
import UserList from "./pages/UserList"; 
import UserEdit from "./pages/UserEdit"; 
import ServiceMenu from "./pages/ServiceMenu";
import ServiceList from "./pages/ServiceList";
import ServiceEdit from "./pages/ServiceEdit";
import ServiceCreate from "./pages/ServiceCreate";
import LogList from "./pages/LogList";

// Interface baseada no que o seu banco de dados retorna
interface User {
  Nome: string;
  Login: string;
  Email?: string;
  Codigo?: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [login, setLoginOk] = useState(false);

  // Define a porta do Go (3000 conforme conversamos)
  const apiBaseUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";

  // Efeito de autenticação: Busca o usuário logado
  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (token) {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      // Rota alterada para bater com o seu backend Go: app.Get("/user", ...)
      axios
        .get(`${apiBaseUrl}/user`, config)
        .then((response) => {
          console.log("Usuário autenticado com sucesso:", response.data);
          
          // Captura o objeto dentro da chave 'user' enviada pelo Go
          if (response.data && response.data.user) {
            setUser(response.data.user);
          } else {
            setUser(response.data);
          }
        })
        .catch((error) => {
          console.error("Erro na validação do token:", error);
          setUser(null);
          localStorage.removeItem("jwt");
        });
    } else {
      setUser(null);
    }
  }, [login, apiBaseUrl]);

return (
    <div className="App">
      <Router>
        <Nav user={user} setLogin={() => setLoginOk(false)} />
        <Routes>
          <Route path="/login" element={<Login setLoginOk={() => setLoginOk(true)} />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/usuarios/menu" element={<UserMenu />} />
          <Route path="/usuarios" element={<UserList />} />
          <Route path="/usuarios/editar/:id" element={<UserEdit />} />
          
          {/* Ajuste importante: mudei para /servicos/lista para evitar o conflito que tivemos */}
          <Route path="/servicos/menu" element={<ServiceMenu />} />
          <Route path="/servicos/lista" element={<ServiceList />} />
          <Route path="/servicos/editar/:id" element={<ServiceEdit />} />
          <Route path="/servicos/novo" element={<ServiceCreate />} />

          <Route path="/logs" element={<LogList />} />
          
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/reset/:token" element={<Reset />} />
          
          <Route path="/" element={<Home user={user} />} />
          <Route path="*" element={<Home user={user} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
