import {useState} from "react";
import {validatePassword} from "../utils/validation.js";

function ResetPasswordSection({newPassword, setNewPassword, handleResetPassword}) {
    const [passwordError, setPasswordError] = useState('');

    const handlePasswordChange = (e) => {
        const password = e.target.value;
        setNewPassword(password);
        const passwordValidationError = validatePassword(password);
        setPasswordError(passwordValidationError);
    };

    return (
        <div className="resetPasswordSection">
            <h3>Сброс пароля</h3>
            <input
                type="password"
                value={newPassword}
                onChange={handlePasswordChange}
                placeholder="Введите новый пароль"
                className={passwordError ? 'error-border' : ''}
            />
            {passwordError && <p className="error-text">{passwordError}</p>}
            <button
                onClick={handleResetPassword}
                className="resetPasswordButton"
                disabled={!!passwordError}>Сбросить пароль
            </button>
        </div>
    );
}

export default ResetPasswordSection;
