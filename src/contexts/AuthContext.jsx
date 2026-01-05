import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    setPersistence,
    browserLocalPersistence
} from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Signup with email/password
    const signup = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    // Login with email/password
    // Login with email/password
    const login = async (email, password) => {
        await setPersistence(auth, browserLocalPersistence);
        return signInWithEmailAndPassword(auth, email, password);
    };

    // Login with Google
    // Login with Google
    const loginWithGoogle = async () => {
        await setPersistence(auth, browserLocalPersistence);
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
    };

    // Logout
    const logout = () => {
        return signOut(auth);
    };

    // Reset Password
    const resetPassword = (email) => {
        return sendPasswordResetEmail(auth, email);
    };

    // Listen to auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        signup,
        login,
        loginWithGoogle,
        logout,
        resetPassword
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
