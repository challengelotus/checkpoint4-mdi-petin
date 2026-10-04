import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react';

import { supabase } from '@/services/supabase/client';
import { authService } from '@/services/supabase/authService';
import { Usuario } from '@/types/auth';

interface AuthContextData {
    usuario: Usuario | null;
    carregando: boolean;
    autenticado: boolean;
    login: (
        email: string,
        senha: string
    ) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>(
    {} as AuthContextData
);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({
    children,
}: AuthProviderProps) {
    const [usuario, setUsuario] =
        useState<Usuario | null>(null);

    const [carregando, setCarregando] =
        useState(true);

    useEffect(() => {
        carregarSessao();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                if (!session) {
                    setUsuario(null);
                    return;
                }

                const usuarioAtual =
                    await authService.obterUsuarioAtual();

                setUsuario(usuarioAtual);
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    async function carregarSessao() {
        try {
            const usuarioAtual =
                await authService.obterUsuarioAtual();

            setUsuario(usuarioAtual);
        } finally {
            setCarregando(false);
        }
    }

    async function login(
        email: string,
        senha: string
    ) {
        const resposta =
            await authService.login({
                email,
                senha,
            });

        setUsuario(resposta.usuario);
    }

    async function logout() {
        await authService.logout();
        setUsuario(null);
    }

    return (
        <AuthContext.Provider
            value={{
                usuario,
                carregando,
                autenticado: !!usuario,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}