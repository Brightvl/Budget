import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export function AuthPage() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { loginUser } = useContext(UserContext); // Используем контекст

    const handleLogin = async () => {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ login, password }),
        });

        if (response.ok) {
            const jwtResponse = await response.json();
            const userData = jwtResponse.user;
            const token = jwtResponse.token;

            console.log('Login successful:', userData);

            loginUser(userData, token); // Сохраняем данные пользователя в контексте

            if (userData.role === 'ADMIN') {
                console.log('Redirecting to admin dashboard');
                navigate('/admin'); // Перенаправляем администратора
            } else {
                console.log('Redirecting to user dashboard');
                navigate('/dashboard'); // Перенаправляем обычного пользователя
            }
        } else {
            console.error('Login failed with status:', response.status);
            setErrorMessage('Произошла ошибка. Возможно неверный логин или пароль.');
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
                    {errorMessage && <p className="error-text">{errorMessage}</p>} {/* Вывод сообщения об ошибке */}
                </div>
            </div>
        </div>
    );
}
