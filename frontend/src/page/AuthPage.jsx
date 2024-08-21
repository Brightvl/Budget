import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext.jsx";
import { validateToken } from "../services/apiService"; // Предполагается, что эта функция проверяет токен

export function AuthPage() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { loginUser } = useContext(UserContext);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            validateToken(token).then(isValid => {
                if (isValid) {
                    // Если токен действителен, перенаправляем пользователя
                    navigate('/dashboard');
                }
            });
        }
    }, [navigate]);

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

                // Перенаправление на нужную страницу
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
            <button onClick={handleLogin}>Войти</button>
            {errorMessage && <p>{errorMessage}</p>}
        </div>
    );
}
