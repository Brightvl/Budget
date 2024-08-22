import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext.jsx";
import "./AuthPage.scss"
import Header from "../../components/Header.jsx";

export function AuthPage() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { loginUser, role } = useContext(UserContext);

    useEffect(() => {
        // Если пользователь уже авторизован и роль известна, перенаправляем
        if (role) {
            if (role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        }
    }, [role, navigate]);

    const handleLogin = async () => {
        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ login, password }),
            });

            if (response.ok) {
                const jwtResponse = await response.json();
                const token = jwtResponse.token;

                const userData = jwtResponse.user;

                // Сохраняем данные пользователя в контексте и токен в localStorage
                loginUser(userData, token);

                // Перенаправление в зависимости от роли
                if (userData.role === 'ADMIN') {
                    navigate('/admin');
                } else {
                    navigate('/dashboard');
                }
            } else {
                setErrorMessage('Неверный логин или пароль.');
            }
        } catch (error) {
            setErrorMessage('Ошибка при авторизации.');
        }
    };

    return (
        <div className="container">
            <div className="header">
                <h1>Добро пожаловать</h1>
            </div>
            <div className="authBox">
                <h2>Вход</h2>
                <input
                    type="text"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    placeholder="Логин"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Пароль"
                />
                <div className="buttonBlock">
                    <button className={"button"} onClick={handleLogin}>Войти</button>
                    <button className={"button"} onClick={() => navigate('/register')}>Регистрация</button>
                </div>
                {errorMessage && <p className={"error-text"}>{errorMessage}</p>}
            </div>
        </div>
    );
}
