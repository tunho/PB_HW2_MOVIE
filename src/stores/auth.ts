import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
    const user = ref<{ id: string; password?: string } | null>(null);
    const isAuthenticated = ref(false);

    const loadUser = () => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            user.value = JSON.parse(storedUser);
            isAuthenticated.value = true;
        }
    };

    const login = (email: string, password: string): boolean => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const foundUser = users.find((u: any) => u.id === email && u.password === password);

        if (foundUser) {
            user.value = { id: email };
            isAuthenticated.value = true;
            localStorage.setItem('currentUser', JSON.stringify(user.value));
            // Also store API key if needed, as per assignment hint (password as key?)
            // localStorage.setItem('TMDb-Key', password); 
            return true;
        }
        return false;
    };

    const register = (email: string, password: string): boolean => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.some((u: any) => u.id === email)) {
            return false; // User exists
        }
        users.push({ id: email, password });
        localStorage.setItem('users', JSON.stringify(users));
        return true;
    };

    const logout = () => {
        user.value = null;
        isAuthenticated.value = false;
        localStorage.removeItem('currentUser');
        // router.push('/signin'); // Can't use router here easily without setup, handle in component
    };

    // Initialize
    loadUser();

    return {
        user,
        isAuthenticated,
        login,
        register,
        logout,
        loadUser
    };
});
