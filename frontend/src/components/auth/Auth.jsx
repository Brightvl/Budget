import {useState} from "react";
import {useNavigate} from "react-router-dom";

export function Auth() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ login, password }),
        });

        if (response.ok) {
            const jwtResponse = await response.json(); // Получаем JwtResponse из ответа
            const userData = jwtResponse.user; // Достаем данные пользователя из JwtResponse
            const token = jwtResponse.token; // Достаем токен из JwtResponse

            console.log('Login successful:', userData);

            // Сохраняем данные пользователя и токен
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userId', userData.id);
            localStorage.setItem('userName', userData.username);
            localStorage.setItem('userLogin', userData.login);
            localStorage.setItem('userEmail', userData.email);
            localStorage.setItem('userRole', userData.role);
            localStorage.setItem('token', token); // Сохраняем токен в localStorage

            // Перенаправляем пользователя в зависимости от роли
            if (userData.role === 'ADMIN') {
                console.log('Redirecting to admin dashboard');
                navigate('/admin'); // Перенаправляем администратора
            } else {
                console.log('Redirecting to user dashboard');
                navigate('/dashboard'); // Перенаправляем обычного пользователя
            }
        } else if (response.status === 401) {
            console.error('Invalid login credentials');
            alert('Неверный логин или пароль. Попробуйте еще раз.');
        } else {
            console.error('Login failed with status:', response.status);
            alert('Произошла ошибка. Пожалуйста, попробуйте позже.');
        }
    };

    const handleRegister = () => {
        navigate('/register');  // Перенаправление на страницу регистрации
    };

    return (
        <div className="container">
            <h2>Авторизация</h2>
            <div className="auth-form">
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
            </div>
        </div>
    );
}
