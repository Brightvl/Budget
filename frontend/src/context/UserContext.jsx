import React, {createContext, useEffect, useState} from 'react';

export const UserContext = createContext();

// Создаем провайдер для управления состоянием пользователя
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // При загрузке приложения проверяем, есть ли данные в localStorage
    useEffect(() => {
        // Восстановление состояния пользователя из localStorage при загрузке страницы
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
        }
    }, []);

    // авторизация
    const loginUser = (userData, token) => {
        const userWithToken = { ...userData, token };
        setUser(userWithToken);
        localStorage.setItem('user', JSON.stringify(userWithToken));
    };

    const logoutUser = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <UserContext.Provider value={{ user, loginUser, logoutUser }}>
            {children}
        </UserContext.Provider>
    );
};
