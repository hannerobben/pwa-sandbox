<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from './../supabase/useAuth.ts';
import { useRouter } from 'vue-router';

const { user, signUp, signIn, signOut, error: authError, loading } = useAuth();
const router = useRouter();

const email = ref('');
const password = ref('');

async function signUpHandler() {
    await signUp(email.value, password.value);
}

async function signInHandler() {
    signIn(email.value, password.value).then(() => {
        if (user.value) {
            router.push({ name: 'Home' });
        }
    });
}

function signOutHandler() {
    signOut();
}
</script>

<template>
    <div>
        <div v-if="!user" class="login-form">
            <h2>Sign In</h2>
            <input v-model="email" placeholder="Email" />
            <input type="password" v-model="password" placeholder="Password" />
            <button @click="signInHandler">Sign In</button>
            <button @click="signUpHandler">Sign Up</button>
            <p v-if="authError">{{ authError.message }}</p>
            <p v-if="loading">Loading...</p>
        </div>

        <div v-else>
            <h2>Already logged in, {{ user.email }}</h2>
            <button @click="signOutHandler">Sign Out</button>
        </div>
    </div>
</template>

<style scoped>
.login-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 300px;
}
</style>
