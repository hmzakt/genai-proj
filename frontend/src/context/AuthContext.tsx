"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
    User,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    IdTokenResult,
} from "firebase/auth";
import { auth } from "../services/firebase";
import { useRouter } from "next/navigation";
import api from "@/services/api";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string) => Promise<void>;
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
        await signInWithEmailAndPassword(auth, email, password);
        try {
            await api.post("/company/init");
        } catch (err) {
            console.error("Failed to init company", err);
            // Proceed anyway? Or block? 
            // If init fails, dashboard might fail too. 
            // But maybe it already exists and error is benign? 
            // The backend code says "if (!company) create... return company".
            // So it should be safe.
        }
        router.push("/dashboard");
    };

    const signup = async (email: string, password: string) => {
        await createUserWithEmailAndPassword(auth, email, password);
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
        <AuthContext.Provider value={{ user, loading, login, signup, logout, getToken }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
