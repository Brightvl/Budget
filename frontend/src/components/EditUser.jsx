import {useState} from "react";
import {validateEmail, checkLoginExists} from "../utils/validation.js";

function EditUser({selectedUser, setSelectedUser, handleUpdateUser, handleDeleteUser}) {
    const [loginError, setLoginError] = useState('');
    const [emailError, setEmailError] = useState('');

    const handleLoginChange = async (e) => {
        const login = e.target.value;
        setSelectedUser({...selectedUser, login});
        const loginValidationError = await checkLoginExists(login, () => {});
        setLoginError(loginValidationError);
    };

    const handleEmailChange = (e) => {
        const email = e.target.value;
        setSelectedUser({...selectedUser, email});
        const emailValidationError = validateEmail(email);
        setEmailError(emailValidationError);
    };

    return (
        <div className="editUser">
            <h3>Редактирование пользователя</h3>
            <label>Логин:</label>
            <input
                type="text"
                value={selectedUser.login}
                onChange={handleLoginChange}
                placeholder="Логин"
                className={loginError ? 'error-border' : ''}
            />
            {loginError && <p className="error-text">{loginError}</p>}

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
                onChange={handleEmailChange}
                placeholder="Email"
                className={emailError ? 'error-border' : ''}
            />
            {emailError && <p className="error-text">{emailError}</p>}

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
                    onClick={handleUpdateUser}
                    disabled={!!loginError || !!emailError}>Сохранить
                </button>
                <button
                    className="deleteButton"
                    onClick={handleDeleteUser}>Удалить пользователя
                </button>
            </div>
        </div>
    );
}

export default EditUser;
