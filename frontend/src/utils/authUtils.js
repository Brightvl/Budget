// src/utils/authUtils.js

export const handleLogout = (navigate) => {
    // Удаляем запись о том, что пользователь залогинен
    localStorage.removeItem('isLoggedIn');
    // Перенаправляем пользователя на главную страницу
    navigate('/');
};

