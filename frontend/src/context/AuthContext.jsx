import React, { createContext, useState } from 'react';

const safeLocalStorage = {
    getItem(key) {
        try {
            return localStorage.getItem(key);
        } catch {
            return null;
        }
    },
    setItem(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch {
            // Ignore storage errors in private or restricted browser contexts.
        }
    },
    removeItem(key) {
        try {
            localStorage.removeItem(key);
        } catch {
            // Ignore storage errors in private or restricted browser contexts.
        }
    }
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = safeLocalStorage.getItem('userInfo');
        return storedUser ? JSON.parse(storedUser) : null;
    });
          
    const login = (userData) => {
        setUser(userData);
        safeLocalStorage.setItem('userInfo', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        safeLocalStorage.removeItem('userInfo');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
