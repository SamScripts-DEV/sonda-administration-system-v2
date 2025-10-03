import { createContext, useContext, useEffect, useState } from "react";
import { login, logout, userData, UserPayload } from "@/features/auth";
import { usePathname, useRouter } from "next/navigation";




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
    const [sessionExpired, setSessionExpired] = useState(false);
    const [manualLogout, setManualLogout] = useState(false)

    const pathname = typeof window !== "undefined" ? window.location.pathname : "";
    const router = useRouter();

    useEffect(() => {
        const publicPaths = ["/auth/login", "/auth/forgot-password", "/auth/reset-password"];
        if (publicPaths.some(path => pathname.startsWith(path))) {
            setLoading(false);
            setManualLogout(false)
            return;
        }
        userData()
            .then(res => setUser(res.data ?? null))
            .catch(() => {
                setUser(null);
                setSessionExpired(true);
            })
            .finally(() => setLoading(false));
    }, [pathname, router]);

    useEffect(() => {
        if (!sessionExpired || manualLogout) return;
        const handlePopState = () => {
            window.location.href = "/auth/login";
        };
        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, [sessionExpired, manualLogout]);


    const loginAuth = async (identifier: string, password: string) => {
        await login({ identifier, password });
        const res = await userData();
        setUser(res.data ?? null);
    }


    const logoutAuth = async () => {
        setManualLogout(true);
        await logout();
        setUser(null);
        window.location.href = "/auth/login";
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
            {sessionExpired && (
                <div style={{
                    position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
                    background: "rgba(0,0,0,0.7)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                    <div style={{
                        background: "#fff", padding: 32, borderRadius: 8, textAlign: "center", minWidth: 300
                    }}>
                        <h2>Sesión caducada</h2>
                        <p>Tu sesión ha expirado. Por favor, inicia sesión de nuevo.</p>
                        <button
                            style={{ marginTop: 16, padding: "8px 24px" }}
                            onClick={() => {
                                setSessionExpired(false);
                                window.location.href = "/auth/login";
                            }}
                        >
                            Aceptar
                        </button>
                    </div>
                </div>
            )}
            {children}
        </ AuthContext.Provider>
    )
}


export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");

    return context;
}