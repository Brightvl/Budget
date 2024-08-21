// src/pages/AuthPage.jsx
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export function AuthPage() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { loginUser } = useContext(UserContext);

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

                console.log('Login successful:', userData);

                // Сохраняем данные пользователя и токен в контексте
                loginUser(userData, token);

                // Проверка перенаправления
                console.log('Navigating to dashboard...');
                if (userData.role === 'ADMIN') {
                    navigate('/admin');
                } else {
                    navigate('/dashboard');
                }
            } else {
                console.error('Login failed with status:', response.status);
                setErrorMessage('Произошла ошибка. Возможно неверный логин или пароль.');
            }
        } catch (error) {
            console.error('Error during login:', error);
            setErrorMessage('Произошла ошибка при выполнении входа.');
        }
    };

    const handleRegister = () => {
        navigate('/register');
    };

    return (
        <div className="auth-box">
            <div className="container">
                <h2>Авторизация</h2>
                <div className="auth-box-list">
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Login"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            className="auth-input"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="auth-input"
                        />
                    </div>
                    <div className="button-group">
                        <button onClick={handleLogin} className="button">Login</button>
                        <button onClick={handleRegister} className="button">Register</button>
                    </div>
                    {errorMessage && <p className="error-text">{errorMessage}</p>}
                </div>
            </div>
        </div>
    );
}
