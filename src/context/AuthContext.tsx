import { createContext, useContext, useEffect, useState } from "react";
import { login, logout, userData, UserPayload } from "@/features/auth";



interface AuthContextType {
    user: UserPayload | null;
    loading: boolean;
    loginAuth: (identifier: string, password: string) => Promise<void>;
    logoutAuth: () => Promise<void>;
    checkSession: () => Promise<boolean>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);


export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserPayload | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        userData()
            .then(res => setUser(res.data ?? null))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, [])

    const loginAuth = async (identifier: string, password: string) => {
        await login({ identifier, password });
        const res = await userData();
        setUser(res.data ?? null);
    }


    const logoutAuth = async () => {
        await logout();
        setUser(null);
    }

    const checkSession = async () => {
        try {
            await userData();
            return true;
        } catch (error) {
            setUser(null);
            return false;
        }
    }


    return (
        <AuthContext.Provider value={{ user, loading, loginAuth, logoutAuth, checkSession }}>
            {children}
        </ AuthContext.Provider>
    )
}


export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");

    return context;
}