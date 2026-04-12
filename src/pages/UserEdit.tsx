import React, { useEffect, useState, SyntheticEvent } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const UserEdit: React.FC = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';

    const [nome, setNome] = useState('');
    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');
    const [email, setEmail] = useState('');
    const [tipo, setTipo] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(''); // Adicionado para mensagens do backend

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        
        axios.get(`${apiUrl}/usuarios/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            // Garante que pega do objeto 'user' retornado pelo seu Go
            const u = res.data.user;
            if (u) {
                setNome(u.Nome || '');
                setLogin(u.Login || '');
                setSenha(u.Senha || '');
                setEmail(u.Email || '');
                setTipo(u.Tipo || '');
            }
            setLoading(false);
        })
        .catch(err => {
            console.error("Erro ao carregar usuário:", err);
            // Se der erro 401 ou 404, volta para a lista
            navigate('/usuarios');
        });
    }, [id, apiUrl, navigate]);

    const submit = async (e: SyntheticEvent) => {
        e.preventDefault();
        setError('');
        const token = localStorage.getItem('jwt');

        try {
            await axios.put(`${apiUrl}/usuarios/${id}`, {
                Nome: nome,
                Login: login,
                Senha: senha,
                Email: email,
                Tipo: tipo
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert('Usuário atualizado com sucesso!');
            navigate('/usuarios'); 
        } catch (err: any) {
            console.error(err);
            // Captura a mensagem real do seu backend em Go
            const msg = err.response?.data?.error || err.response?.data?.message || 'Erro ao atualizar usuário.';
            setError(msg);
        }
    };

    if (loading) return <div className="container mt-5 text-center">Carregando dados...</div>;

    return (
        <div className="container mt-5" style={{ maxWidth: '700px' }}>
            <div className="card shadow-sm border-dark p-4">
                <h2 className="mb-4">Alterar Usuário #{id}</h2>

                {error && <div className="alert alert-danger py-2">{error}</div>}

                <form onSubmit={submit}>
                    <div className="mb-3">
                        <label className="form-label small fw-bold">Nome Completo</label>
                        <input 
                            className="form-control" 
                            value={nome} 
                            onChange={e => setNome(e.target.value)} 
                            required 
                        />
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label small fw-bold">Login</label>
                            <input 
                                className="form-control" 
                                value={login} 
                                onChange={e => setLogin(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label small fw-bold">Senha (Nova ou Atual)</label>
                            <input 
                                type="password"
                                className="form-control" 
                                value={senha} 
                                onChange={e => setSenha(e.target.value)} 
                                required 
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label small fw-bold">E-mail</label>
                        <input 
                            type="email"
                            className="form-control" 
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                            required 
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label small fw-bold">Tipo de Acesso</label>
                        <select 
                            className="form-select" 
                            value={tipo} 
                            onChange={e => setTipo(e.target.value)}
                            required
                        >
                            <option value="">Selecione...</option>
                            <option value="admin">Administrador</option>
                            <option value="user">Usuário Comum</option>
                        </select>
                    </div>

                    <div className="d-flex justify-content-between">
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/usuarios')}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-dark">
                            Salvar Alterações
                        </button>
                    </div>
                </form>
            </div>
            
            <div className="text-center mt-4">
                <button 
                    className="btn btn-link text-decoration-none text-secondary" 
                    onClick={() => navigate('/usuarios/menu')}
                >
                    ← Voltar para Menu de Usuários
                </button>
            </div>
        </div>
    );
};

export default UserEdit;
