import {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {UserContext} from "../../context/UserContext.jsx";
import {deleteUser, fetchUserByLogin, resetPassword, updateUser, validateToken} from "../../services/apiService.js";
import "./AdminDashboardPage.scss"
import LogoutButton from "../../components/LogoutButton.jsx";

function AdminDashboardPage() {
    const navigate = useNavigate();
    const {role, logoutUser} = useContext(UserContext);
    const [login, setLogin] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [showLogoutWarning, setShowLogoutWarning] = useState(false);
    const [adminWarning, setAdminWarning] = useState('');

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
                } else {
                    checkAdminCredentials();
                }
            }).catch(() => {
                setErrorMessage('Ошибка при проверке токена.');
                navigate('/auth');
            });
        } else {
            navigate('/auth');
        }
    }, [navigate, role]);
    const checkAdminCredentials = async () => {
        const token = localStorage.getItem('token');
        try {
            const adminUser = await fetchUserByLogin('admin', token);
            if (adminUser && adminUser.login === 'admin' && adminUser.password === 'admin') {
                setAdminWarning('Логин и пароль администратора слишком простые. Пожалуйста, измените их.');
            }
        } catch (error) {
            console.error('Ошибка при проверке учетных данных администратора:', error);
        }
    };
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
                <LogoutButton
                    handleLogout={() => handleLogout(navigate, logoutUser)}
                    showLogoutWarning={showLogoutWarning}
                    setShowLogoutWarning={setShowLogoutWarning}
                />
                <header className="dashboardHeader">
                    <h1>Административная панель</h1>
                </header>
                <div className="dashboardContent">
                    {errorMessage && <p className="error">{errorMessage}</p>}
                    {adminWarning && <p className="warning">{adminWarning}</p>}


                    <div className="searchPanel">
                        <input
                            className="searchInput"
                            type="text"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            placeholder="Введите логин пользователя"
                        />
                        <button onClick={handleSearch} disabled={isLoading} className="searchButton">
                            {isLoading ? 'Поиск...' : 'Найти пользователя'}
                        </button>

                    </div>                        {selectedUser && (
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
                            <button
                                className={"button"}
                                onClick={handleUpdateUser}>Сохранить
                            </button>
                            <button
                                className="deleteButton"
                                onClick={handleDeleteUser}>Удалить пользователя
                            </button>
                        </div>


                    </div>
                )}

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
            </div>
        </div>

    );
}

export default AdminDashboardPage;
