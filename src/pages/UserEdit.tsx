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
    const [error, setError] = useState(''); // Estado para a mensagem de erro

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        axios.get(`${apiUrl}/usuarios/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            const u = res.data.user;
            setNome(u.Nome || '');
            setLogin(u.Login || '');
            setSenha(u.Senha || '');
            setEmail(u.Email || '');
            setTipo(u.Tipo || '');
            setLoading(false);
        })
        .catch(err => {
            console.error("Erro ao carregar usuário:", err);
            setError("Não foi possível carregar os dados do usuário.");
            setLoading(false);
        });
    }, [id, apiUrl]);

    const submit = async (e: SyntheticEvent) => {
        e.preventDefault();
        setError(''); // Limpa erros anteriores
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
            // LÓGICA PARA TRAZER A MSG DO BACKEND:
            if (err.response && err.response.data) {
                // Tenta pegar 'error' ou 'message' do JSON enviado pelo Go
                const backendMsg = err.response.data.error || err.response.data.message || 'Erro ao atualizar usuário.';
                setError(backendMsg);
            } else {
                setError('Erro de conexão com o servidor.');
            }
        }
    };

    if (loading) return <div className="container mt-5">Carregando dados...</div>;

    return (
        <div className="container mt-5">
            <div className="card shadow p-4">
                <h2 className="mb-4">Alterar Usuário #{id}</h2>

                {/* EXIBIÇÃO DA MENSAGEM DE ERRO DO BACKEND */}
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={submit}>
                    <div className="mb-3">
                        <label className="form-label">Nome Completo</label>
                        <input 
                            className="form-control" 
                            value={nome} 
                            onChange={e => setNome(e.target.value)} 
                            required 
                        />
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Login</label>
                            <input 
                                className="form-control" 
                                value={login} 
                                onChange={e => setLogin(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Senha (Nova ou Atual)</label>
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
                        <label className="form-label">E-mail</label>
                        <input 
                            type="email"
                            className="form-control" 
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                            required 
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Tipo de Acesso</label>
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

                    <div className="mt-4">
                        <button type="submit" className="btn btn-primary me-2">Salvar Alterações</button>
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/usuarios')}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserEdit;
