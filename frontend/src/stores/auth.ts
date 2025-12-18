import { defineStore } from 'pinia';
import api from '@/services/api';
import router from '@/router';



interface UserInfo {
    username: string;
    userId: number;
}

interface AuthState {
    accessToken: string | null;
    user: UserInfo | null;
    loginError: string | null;
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        accessToken: localStorage.getItem('accessToken'),
        user: null,
        loginError: null,
    }),

    getters: {
        isAuthenticated: (state) => !!state.accessToken,
    },

    actions: {
        async login(credentials: any) {
            this.loginError = null;
            try {
                const response = await api.post('/auth/login', credentials);
                const { accessToken, username, userId } = response.data;

                this.accessToken = accessToken;
                localStorage.setItem('accessToken', accessToken);

                this.user = { username, userId };

                router.push('/dashboard');
            } catch (error: any) {
                const errorMessage = error.response?.data?.message || 'error de conexion, intentelo de nuevo.';
                this.loginError = errorMessage;
                this.logout();
                throw new Error(errorMessage);
            }
        },

        async fetchProfile() {
            if (!this.isAuthenticated) return;

            try {
                const response = await api.get('/auth/me');
                this.user = response.data;
            } catch (error) {
                console.error('Error al obtener perfil. Token inválido o expirado.', error);
                this.logout();
            }
        },

        logout() {
            this.accessToken = null;
            this.user = null;
            localStorage.removeItem('accessToken');
            router.push('/login');
        }
    },
});

