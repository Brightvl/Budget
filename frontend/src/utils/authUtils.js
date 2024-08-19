// src/utils/authUtils.js
export const handleLogout = (navigate, logoutUser) => {
    if (typeof logoutUser === 'function') {
        logoutUser(); // Очищаем данные пользователя в контексте
        navigate('/auth');
    } else {
        console.error("logoutUser is not a function");
    }
};
