import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import {
    validateEmail,
    validatePassword,
    checkLoginExists,
    checkEmailExists
} from '../utils/validation.js';

export function RegisterPage() {
    const [login, setLogin] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [generalErrors, setGeneralErrors] = useState([]);
    const [isLoginChecking, setIsLoginChecking] = useState(false);
    const [isEmailChecking, setIsEmailChecking] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async () => {
        const errors = [];

        if (!login) {
            errors.push('Пожалуйста, введите логин.');
        } else {
            const loginError = await checkLoginExists(login, setIsLoginChecking);
            if (loginError) {
                errors.push(loginError);
            }
        }

        if (!username) {
            errors.push('Пожалуйста, введите имя пользователя.');
        }

        const emailValidationError = validateEmail(email);
        if (emailValidationError) {
            setEmailError(emailValidationError);
            errors.push(emailValidationError);
        } else {
            setEmailError('');
            const emailExistsError = await checkEmailExists(email, setIsEmailChecking);
            if (emailExistsError) {
                errors.push(emailExistsError);
            }
        }

        const passwordValidationError = validatePassword(password);
        if (passwordValidationError) {
            setPasswordError(passwordValidationError);
            errors.push(passwordValidationError);
        } else {
            setPasswordError('');
        }

        if (password !== confirmPassword) {
            const passwordErrorText = 'Пароли не совпадают. Пожалуйста, попробуйте еще раз.';
            setPasswordError(passwordErrorText);
            errors.push(passwordErrorText);
        } else {
            setPasswordError('');
        }

        if (errors.length > 0) {
            setGeneralErrors(errors);
            return;
        } else {
            setGeneralErrors([]);
        }

        try {
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
            } else if (response.status === 400) {
                setGeneralErrors(['Пароль не может быть пустым.']);
            } else {
                setGeneralErrors(['Произошла ошибка при регистрации. Попробуйте позже.']);
            }
        } catch (error) {
            console.error('Registration failed:', error);
            setGeneralErrors(['Произошла ошибка при регистрации. Попробуйте позже.']);
        }
    };

    return (
        <div className="registration-box">
            <div className="container">
                <h2>Регистрация</h2>
                <div className="registration-box-list">
                    <input
                        type="text"
                        placeholder="Логин"
                        value={login}
                        onChange={(e) => {
                            setLogin(e.target.value);
                            setGeneralErrors(generalErrors.filter(error => error !== 'Пожалуйста, введите логин.'));
                        }}
                        className={generalErrors.includes('Пожалуйста, введите логин.') ? 'error-border' : ''}
                    />
                    <input
                        type="text"
                        placeholder="Имя пользователя"
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                            setGeneralErrors(generalErrors.filter(error => error !== 'Пожалуйста, введите имя пользователя.'));
                        }}
                        className={generalErrors.includes('Пожалуйста, введите имя пользователя.') ? 'error-border' : ''}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailError('');
                        }}
                        className={emailError ? 'error-border' : ''}
                    />
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setPasswordError('');
                        }}
                        className={passwordError ? 'error-border' : ''}
                    />
                    <input
                        type="password"
                        placeholder="Подтвердите пароль"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setPasswordError('');
                        }}
                        className={passwordError ? 'error-border' : ''}
                    />
                </div>
                <button className={"button"} onClick={handleRegister} disabled={isLoginChecking || isEmailChecking}>
                    {isLoginChecking || isEmailChecking ? 'Проверка...' : 'Зарегистрироваться'}
                </button>

                {generalErrors.length === 1 ? (
                    <p className="error-text">{generalErrors[0]}</p>
                ) : generalErrors.length > 1 ? (
                    <div>
                        <p className="error-text">Пожалуйста, исправьте ошибки в форме:</p>
                        <ul className="error-text">
                            {generalErrors.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
