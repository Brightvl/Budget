import React, { createContext, useState } from 'react';

export const UserContext = createContext();

// Создаем провайдер для управления состоянием пользователя
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const loginUser = (userData, token) => {
        setUser({ ...userData, token });
    };

    const logoutUser = () => {
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, loginUser, logoutUser }}>
            {children}
        </UserContext.Provider>
    );
};
