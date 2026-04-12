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
import { startHealthCheck } from "./utils/healthCheck";
import UserList from "./pages/UserList"; 
import UserEdit from "./pages/UserEdit"; 
import ServiceList from "./pages/ServiceList"
import ServiceEdit from "./pages/ServiceEdit";
import ServiceCreate from "./pages/ServiceCreate";

  interface User {
    id: number;
    name: string;
    loginUser: string;
    email: string;
  }

  function App() {
    const [user, setUser] = useState<User | null>(null);
    const [login, setLoginOk] = useState(false);
  
    // Configuração global do axios
    axios.defaults.withCredentials = true;
    const apiBaseUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";
  
    // Health Check Effect
    useEffect(() => {
      startHealthCheck();
    }, []);
  
    // User Authentication Effect
    useEffect(() => {
      const token = localStorage.getItem("jwt");
  
      if (token) {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "*/*",
            "Content-Type": "application/json",
          },
        };
  
        console.log("Fetching user with token:", token);
        console.log("URL usada:", `${apiBaseUrl}/api/user`);
  
        axios
          .get(`${apiBaseUrl}/api/user`, config)
          .then((response) => {
            console.log("Resposta da API /user:", response.data);
            setUser(response.data);
          })
          .catch((error) => {
            console.error("Erro ao buscar o usuário:", error);
            setUser(null);
            localStorage.removeItem("jwt");
          });
      }
    }, [login, apiBaseUrl]);

    return (
      <div className="App">
        <Router>
          <Nav user={user} setLogin={() => setLoginOk(false)} />
          <Routes>
            <Route path="/login" element={<Login setLoginOk={() => setLoginOk(true)} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/usuarios" element={<UserList />} />
            <Route path="/usuarios/editar/:id" element={<UserEdit />} />
            <Route path="/servicos" element={<ServiceList />} />
            <Route path="/servicos/editar/:id" element={<ServiceEdit />} />
            <Route path="/servicos/novo" element={<ServiceCreate />} />
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