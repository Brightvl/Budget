import React, { createContext, useEffect, useState } from 'react';
import { validateToken, fetchUserData } from '../services/apiService';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            validateToken(token).then(isValid => {
                if (isValid) {
                    fetchUserData(token)
                        .then(userData => {
                            setUser({ ...userData, token });
                        })
                        .catch(() => {
                            localStorage.removeItem('token');
                            setUser(null);
                        });
                } else {
                    localStorage.removeItem('token');
                    setUser(null);
                }
            });
        }
    }, []);

    const loginUser = (userData, token) => {
        setUser({ ...userData, token });
        localStorage.setItem('token', token);
    };

    const logoutUser = () => {
        setUser(null);
        localStorage.removeItem('token');
    };

    return (
        <UserContext.Provider value={{ user, loginUser, logoutUser }}>
            {children}
        </UserContext.Provider>
    );
};
