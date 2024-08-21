import React, { createContext, useState, useEffect } from 'react';
import { validateToken, fetchUserData } from '../services/apiService';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            validateToken(token).then(isValid => {
                if (isValid) {
                    fetchUserData(token).then(userData => {
                        setUser({ ...userData, token });
                        setRole(userData.role);  // Сохраняем роль пользователя
                    }).catch(() => {
                        localStorage.removeItem('token');
                        setUser(null);
                        setRole(null);
                    });
                } else {
                    localStorage.removeItem('token');
                    setUser(null);
                    setRole(null);
                }
            });
        }
    }, []);

    const loginUser = (userData, token) => {
        setUser({ ...userData, token });
        setRole(userData.role);  // Сохраняем роль пользователя
        localStorage.setItem('token', token);
    };

    const logoutUser = () => {
        setUser(null);
        setRole(null);  // Очищаем роль пользователя
        localStorage.removeItem('token');
    };
    const updateUserInContext = (updatedUser) => {
        setUser((prevUser) => ({
            ...prevUser,
            ...updatedUser,
        }));
        if (updatedUser.role) {
            setRole(updatedUser.role);
        }
    };

    return (
        <UserContext.Provider value={{ user, role, loginUser, logoutUser, updateUserInContext }}>
            {children}
        </UserContext.Provider>
    );
};
