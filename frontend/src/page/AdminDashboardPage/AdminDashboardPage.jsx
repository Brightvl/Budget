import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext.jsx";
import { fetchUserByLogin, validateToken, deleteUser, updateUser, resetPassword } from "../../services/apiService.js";
import "./AdminDashboardPage.scss"

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
                const updatedUser = await updateUser(selectedUser.id, selectedUser, token);
                setSelectedUser(updatedUser); // Обновляем состояние с новыми данными
                // updateUserInContext(updatedUser); // Обновляем контекст с новыми данными, если нужно
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
        <div className={"container"}>
            <div className="adminDashboardPage">
                <header className="dashboardHeader">
                    <h1>Административная панель</h1>
                    <button onClick={handleLogout} className="button">Выйти</button>
                </header>
                <div className="dashboardContent">
                    {errorMessage && <p className="error">{errorMessage}</p>}
                    <div className="searchUser">
                        <input
                            type="text"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            placeholder="Введите логин пользователя"
                            className="searchInput"
                        />
                        <button onClick={handleSearch} disabled={isLoading} className="searchButton">
                            {isLoading ? 'Поиск...' : 'Найти пользователя'}
                        </button>
                    </div>
                    {selectedUser && (
                        <div className="editUser">
                            <h3>Редактирование пользователя</h3>
                            <label>Логин:</label>
                            <input
                                type="text"
                                value={selectedUser.login}
                                onChange={(e) => setSelectedUser({...selectedUser, login: e.target.value})}
                                placeholder="Логин"
                            />
                            <label>Имя пользователя:</label>
                            <input
                                type="text"
                                value={selectedUser.name}
                                onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})}
                                placeholder="Имя пользователя"
                            />
                            <label>Email:</label>
                            <input
                                type="email"
                                value={selectedUser.email}
                                onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                                placeholder="Email"
                            />
                            <label>Роль:</label>
                            <select
                                value={selectedUser.role}
                                onChange={(e) => setSelectedUser({...selectedUser, role: e.target.value})}
                            >
                                <option value="USER">USER</option>
                                <option value="ADMIN">ADMIN</option>
                            </select>
                            <div className="buttonGroup">
                                <button onClick={handleUpdateUser}>Сохранить</button>
                                <button onClick={handleDeleteUser} className="deleteButton">Удалить пользователя
                                </button>
                            </div>

                            <div className="resetPasswordSection">
                                <h3>Сброс пароля</h3>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Введите новый пароль"
                                    className="resetPasswordInput"
                                />
                                <button onClick={handleResetPassword} className="resetPasswordButton">Сбросить пароль
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

    );
}

export default AdminDashboardPage;
