import { useNavigate } from 'react-router-dom';
import { useState } from "react";

export function Register() {
    const [login, setLogin] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ login, username, email, password }), // role не отправляется
        });

        if (response.ok) {
            console.log('User registered successfully');
            navigate('/auth');  // Перенаправление на страницу входа
        } else if (response.status === 409) {
            console.error('Username is already taken');
            alert('Логин уже занят. Пожалуйста, выберите другой.');
        } else if (response.status === 400) {
            console.error('Password cannot be empty');
            alert('Пароль не может быть пустым.');
        } else {
            console.error('Registration failed');
            alert('Произошла ошибка при регистрации. Попробуйте позже.');
        }
    };

    return (
        <div className="container">
            <h2>Регистрация</h2>
            <input
                type="text"
                placeholder="Логин"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
            />
            <input
                type="text"
                placeholder="Имя пользователя"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button className={"button"} onClick={handleRegister}>Зарегистрироваться</button>
        </div>
    );
}
