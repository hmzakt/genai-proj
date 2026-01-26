"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
    User,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    sendEmailVerification,
    signInWithPopup,
    IdTokenResult,
} from "firebase/auth";
import { auth, googleProvider } from "../services/firebase";
import { useRouter } from "next/navigation";
import api from "@/services/api";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    getToken: () => Promise<string | undefined>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            setLoading(false);

            // Optional: Redirect logic can be here or in middleware/protected routes
            // If we want global redirect for unauthenticated users:
            // if (!currentUser && !window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/signup')) {
            //   router.push('/login');
            // }
        });
        return () => unsubscribe();
    }, [router]);

    const login = async (email: string, password: string) => {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        // Check if email is verified
        if (!userCredential.user.emailVerified) {
            await signOut(auth);
            throw new Error("Please verify your email before logging in. Check your inbox for the verification link.");
        }

        try {
            await api.post("/company/init");
        } catch (err) {
            console.error("Failed to init company", err);
        }
        router.push("/dashboard");
    };

    const signup = async (email: string, password: string) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Send verification email
        await sendEmailVerification(userCredential.user);

        // Sign out the user until they verify their email
        await signOut(auth);

        // Throw a special message that the signup page will catch
        throw new Error("VERIFICATION_EMAIL_SENT");
    };

    const signInWithGoogle = async () => {
        const result = await signInWithPopup(auth, googleProvider);

        // Google users are automatically verified
        try {
            await api.post("/company/init");
        } catch (err) {
            console.error("Failed to init company", err);
        }
        router.push("/dashboard");
    };

    const logout = async () => {
        await signOut(auth);
        router.push("/login");
    };

    const getToken = async () => {
        return user?.getIdToken();
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, signInWithGoogle, logout, getToken }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
