import {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {UserContext} from "../../context/UserContext.jsx";
import {deleteUser, fetchUserByLogin, resetPassword, updateUser, validateToken} from "../../services/apiService.js";
import "./AdminDashboardPage.scss"
import LogoutButton from "../../components/LogoutButton.jsx";
import EditUser from "../../components/EditUser";
import ResetPasswordSection from "../../components/ResetPasswordSection.jsx";

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
        logoutUser();
        navigate('/auth');
    };

    const handleUpdateUser = async () => {
        if (selectedUser) {
            try {
                const token = localStorage.getItem('token');
                const updatedUser = await updateUser(selectedUser.id, selectedUser, token);
                setSelectedUser(updatedUser);
                setErrorMessage('Данные пользователя обновлены.');
            } catch (error) {
                setErrorMessage('Не удалось обновить данные пользователя.');
            }
        }
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
                    </div>

                    {selectedUser && (
                        <>
                            <EditUser
                                selectedUser={selectedUser}
                                setSelectedUser={setSelectedUser}
                                handleUpdateUser={handleUpdateUser}
                                handleDeleteUser={handleDeleteUser}
                            />
                            <ResetPasswordSection
                                newPassword={newPassword}
                                setNewPassword={setNewPassword}
                                handleResetPassword={handleResetPassword}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboardPage;
