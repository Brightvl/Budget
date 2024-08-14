// src/utils/authUtils.js

/**
 * Удаляем запись о том что пользователь авторизован
 * @param navigate переход на главную
 */
export const handleLogout = (navigate) => {
    localStorage.removeItem('isLoggedIn');
    navigate('/');
};

