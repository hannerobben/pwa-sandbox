import { ref, onMounted } from 'vue';
import { supabase } from './supabase';
import type { AuthError, User } from '@supabase/supabase-js';

export function useAuth() {
    const user = ref<User | null>(null);
    const loading = ref(true);
    const error = ref<AuthError | null>(null);

    onMounted(async () => {
        await supabase.auth.getSession().then(({ data }) => {
            user.value = data.session?.user || null;
            loading.value = false;
        });

        supabase.auth.onAuthStateChange((_event, session) => {
            user.value = session?.user || null;
        });
    });

    async function signUp(email: string, password: string) {
        loading.value = true;
        error.value = null;
        const { data, error: err } = await supabase.auth.signUp({ email, password });
        error.value = err;
        loading.value = false;
        return data;
    }

    async function signIn(email: string, password: string) {
        loading.value = true;
        error.value = null;
        const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
        error.value = err;
        loading.value = false;
        return data;
    }

    async function signOut() {
        await supabase.auth.signOut();
        user.value = null;
    }

    return { user, loading, error, signUp, signIn, signOut };
}
