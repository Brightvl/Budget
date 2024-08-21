import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { fetchUserByLogin, validateToken, deleteUser, updateUser, resetPassword } from "../services/apiService";

function AdminDashboardPage() {
    const navigate = useNavigate();
    const { role, logoutUser } = useContext(UserContext);
    const [login, setLogin] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        if (role !== 'ADMIN') {
            navigate('/auth');
            return;
        }

        const token = localStorage.getItem('token');
        if (token) {
            validateToken(token).then(isValid => {
                if (!isValid) {
                    navigate('/auth');
                }
            }).catch(() => {
                setErrorMessage('Ошибка при проверке токена.');
                navigate('/auth');
            });
        } else {
            navigate('/auth');
        }
    }, [navigate, role]);

    const handleSearch = async () => {
        try {
            setIsLoading(true);
            setErrorMessage('');
            const token = localStorage.getItem('token');
            const user = await fetchUserByLogin(login, token);
            setSelectedUser(user);
        } catch (error) {
            setErrorMessage('Пользователь не найден.');
            setSelectedUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        logoutUser(); // Очищаем контекст и localStorage
        navigate('/auth');
    };

    const handleDeleteUser = async () => {
        if (selectedUser) {
            try {
                const token = localStorage.getItem('token');
                await deleteUser(selectedUser.id, token);
                setSelectedUser(null);
                setErrorMessage('Пользователь удален.');
            } catch (error) {
                setErrorMessage('Не удалось удалить пользователя.');
            }
        }
    };

    const handleUpdateUser = async () => {
        if (selectedUser) {
            console.log('Updating user with data:', selectedUser); // Логирование данных
            try {
                const token = localStorage.getItem('token');
                await updateUser(selectedUser.id, selectedUser, token);
                setErrorMessage('Данные пользователя обновлены.');
            } catch (error) {
                setErrorMessage('Не удалось обновить данные пользователя.');
            }
        }
    };


    const handleResetPassword = async () => {
        if (selectedUser && newPassword) {
            try {
                const token = localStorage.getItem('token');
                await resetPassword(selectedUser.id, newPassword, token);
                setErrorMessage('Пароль пользователя сброшен.');
                setNewPassword('');
            } catch (error) {
                setErrorMessage('Не удалось сбросить пароль.');
            }
        }
    };

    return (
        <div className="container">
            <header className="dashboard-header">
                <h1>Административная панель</h1>
                <button onClick={handleLogout} className="button">Выйти</button>
            </header>
            <div className="dashboard-content">
                {errorMessage && <p className="error">{errorMessage}</p>}
                <div className="search-user">
                    <input
                        type="text"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        placeholder="Введите логин пользователя"
                    />
                    <button onClick={handleSearch} disabled={isLoading}>
                        {isLoading ? 'Поиск...' : 'Найти пользователя'}
                    </button>
                </div>
                {selectedUser && (
                    <div className="edit-user">
                        <h3>Редактирование пользователя</h3>
                        <label>Логин:</label>
                        <input
                            type="text"
                            value={selectedUser.login}
                            onChange={(e) => setSelectedUser({ ...selectedUser, login: e.target.value })}
                            placeholder="Логин"
                        />
                        <label>Имя пользователя:</label>
                        <input
                            type="text"
                            value={selectedUser.username}
                            onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value })}
                            placeholder="Имя пользователя"
                        />
                        <label>Email:</label>
                        <input
                            type="email"
                            value={selectedUser.email}
                            onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                            placeholder="Email"
                        />
                        <label>Роль:</label>
                        <select
                            value={selectedUser.role}
                            onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                        >
                            <option value="USER">USER</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                        <button onClick={handleUpdateUser}>Сохранить</button>
                        <button onClick={handleDeleteUser}>Удалить пользователя</button>

                        <h3>Сброс пароля</h3>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Введите новый пароль"
                        />
                        <button onClick={handleResetPassword}>Сбросить пароль</button>
                    </div>
                )}
            </div>
        </div>
    );

}

export default AdminDashboardPage;
