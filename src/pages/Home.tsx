import React from 'react';
import { useNavigate } from 'react-router-dom';

type UserProps = {
    user: {
        Nome: string;
        Login: string;
        Email?: string;
    } | null;
};

const Home: React.FC<UserProps> = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4 text-center">API-Manager</h2>
      
      <div className="row">
        {user ? (
          <>
            {/* Card Superior: Consultas e Logs */}
            <div className="col-12 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-dark">Monitoramento</h5>
                  <p className="card-text text-muted small">Acompanhe o histórico de atividades e logs do sistema.</p>
                  
                  <button 
                    className="btn btn-dark btn-lg w-100 shadow-sm" 
                    onClick={() => navigate('/logs')}
                  >
                    Gestão de Logs
                  </button>
                </div>
              </div>
            </div>

            {/* Card Inferior: Ações de Gestão */}
            <div className="col-12">
              <div className="card shadow-sm border-dark">
                <div className="card-body">
                  <h5 className="card-title text-dark">Administração</h5>
                  <p className="card-text text-muted small">Gerencie os cadastros de usuários e serviços cadastrados.</p>
                  
                  <div className="d-flex flex-column gap-3">
                    <button 
                      className="btn btn-dark btn-lg w-100 shadow-sm" 
                      onClick={() => navigate('/usuarios/menu')}
                    >
                      Gestão de Usuários
                    </button>
                    
                    <button 
                      className="btn btn-dark btn-lg w-100 shadow-sm" 
                      onClick={() => navigate('/servicos/menu')}
                    >
                      Gestão de Serviços
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-4">
                <p className="text-muted small">
                  Olá, <strong>{user.Nome}</strong>. Conectado como: <strong>{user.Login}</strong>
                </p>
            </div>
          </>
        ) : (
          /* Card para usuário deslogado */
          <div className="col-12">
            <div className="card shadow-sm text-center p-4 border-danger">
              <h5 className="text-danger">Acesso Restrito</h5>
              <p className="fs-6 text-muted mb-4">Por favor, realize o login para acessar o painel administrativo.</p>
              <button 
                className="btn btn-dark btn-lg w-100" 
                onClick={() => navigate('/login')}
              >
                Fazer Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
