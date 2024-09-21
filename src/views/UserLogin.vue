<template>
    <!-- Switch -->
    <div class="absolute top-20 right-20">
        <div class="switch">
            <label class="text-xl">
                SignIn
                <input type="checkbox" v-model="isSignUp">
                <span class="lever"></span>
                SignUp
            </label>
        </div>
    </div>

    <div class="w-full h-screen flex justify-center items-center">
        <transition name="fade" mode="out-in">
            <!-- Login Form (visible when isSignUp is false) -->
            <div v-if="!isSignUp" class="col w-80 h-auto" key="login">
                <div class="flex flex-col items-start gap-y-4">
                    <p class="text-5xl">Login</p>
                    <p class="text-xl">Please sign in to continue</p>
                </div>
                <form @submit.prevent="loginWithEmail" class="col s12">
                    <div class="input-field">
                        <input v-model="email" type="email" placeholder="Email" required />
                    </div>
                    <div class="input-field">
                        <input v-model="password" type="password" id="lgps" class="validate" required />
                        <label :class="{ 'active': password.length > 0 }" for="lgps">Password</label>
                    </div>
                    <div class="row flex items-center justify-around px-6">
                        <div class="w-2/3 flex justify-start">
                            <button @click="confirmLoginWithGoogle">
                                <v-icon name="fc-google" scale="2"></v-icon>
                            </button>
                            <button @click="confirmLoginWithApple">
                                <v-icon name="vi-file-type-applescript" scale="2.2"></v-icon>
                            </button>
                        </div>
                        <div class="w-1/3 flex justify-end bg-slate-400">
                            <button type="submit" class="waves-effect waves-light btn">Login</button>
                        </div>
                    </div>
                </form>
                <p v-if="error">{{ error }}</p>
            </div>

            <!-- Register Form (visible when isSignUp is true) -->
            <div v-else class="col w-80 h-auto" key="register">
                <div class="flex flex-col items-start gap-y-4">
                    <p class="text-5xl">Register</p>
                    <p class="text-xl">Please sign up to continue</p>
                </div>
                <form @submit.prevent="registerWithEmail" class="col s12">
                    <div class="input-field">
                        <input v-model="registerEmail" type="email" placeholder="Email" required />
                    </div>
                    <div class="input-field">
                        <input v-model="registerPassword" type="password" id="rgps" class="validate" required />
                        <label :class="{ 'active': registerPassword.length > 0 }" for="rgps">Password</label>
                    </div>
                    <div class="row flex items-center justify-end px-6">
                        <div class="w-1/3 flex justify-end bg-slate-400">
                            <button type="submit" class="waves-effect waves-light btn">Register</button>
                        </div>
                    </div>
                </form>
                <p v-if="registerError">{{ registerError }}</p>
            </div>
        </transition>
    </div>
</template>

<script>
import { auth } from '../firebase';

import M from 'materialize-css'



import {
    signInWithEmailAndPassword,
    signInWithPopup,
    createUserWithEmailAndPassword,
    linkWithCredential,
    GoogleAuthProvider,
    OAuthProvider,
    sendEmailVerification,
    onAuthStateChanged,
} from 'firebase/auth';

export default {
    name: 'UserLogin',
    data() {
        return {
            email: '',
            password: '',
            error: '',
            registerEmail: '',
            registerPassword: '',
            registerError: '',
            providerError: '',
            isEmailVerified: false,
            isSignUp: false,
        };
    },
    methods: {
        async loginWithEmail() {
            try {
                await signInWithEmailAndPassword(auth, this.email, this.password);
                this.checkEmailVerification();
            } catch (error) {
                this.error = this.handleError(error);
            }
        },
        confirmLoginWithGoogle() {
            if (confirm('Are you sure you want to sign in with Google?')) {
                this.loginWithGoogle();
            }
        },
        confirmLoginWithApple() {
            if (confirm('Are you sure you want to sign in with Apple?')) {
                this.loginWithApple();
            }
        },
        async loginWithGoogle() {
            try {
                await signInWithPopup(auth, new GoogleAuthProvider());
                this.checkEmailVerification();
            } catch (error) {
                this.error = 'Error logging in via Google.';
            }
        },
        async loginWithApple() {
            try {
                await signInWithPopup(auth, new OAuthProvider('apple.com'));
                this.checkEmailVerification();
            } catch (error) {
                this.error = 'Error signing in with Apple.';
            }
        },
        async registerWithEmail() {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, this.registerEmail, this.registerPassword);
                await sendEmailVerification(userCredential.user);
                this.registerError = 'confirm email.';
            } catch (error) {
                this.registerError = this.handleError(error);
            }
        },
        async addGoogleProvider() {
            const user = auth.currentUser;
            if (user) {
                try {
                    const credential = await signInWithPopup(auth, new GoogleAuthProvider());
                    await linkWithCredential(user, credential);
                    this.providerError = 'Google has been added as a provider.';
                } catch (error) {
                    this.providerError = 'Error adding Google as a provider.';
                }
            } else {
                this.providerError = 'You must be logged in to add a supplier.';
            }
        },
        async addAppleProvider() {
            const user = auth.currentUser;
            if (user) {
                try {
                    const credential = await signInWithPopup(auth, new OAuthProvider('apple.com'));
                    await linkWithCredential(user, credential);
                    this.providerError = 'Apple has been added as a supplier.';
                } catch (error) {
                    this.providerError = 'Error adding Apple as a supplier.';
                }
            } else {
                this.providerError = 'You must be logged in to add a supplier.';
            }
        },
        checkEmailVerification() {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    this.isEmailVerified = user.emailVerified;
                    if (this.isEmailVerified) {
                        this.$router.push('/dashboard');
                    } else {
                        alert('confirm email.');
                    }
                }
            });
        },
        handleError(error) {
            switch (error.code) {
                case 'auth/invalid-email':
                    return 'invalid email.';
                case 'auth/user-not-found':
                    return 'account not found.';
                case 'auth/wrong-password':
                    return 'wrong password.';
                case 'auth/email-already-in-use':
                    return 'email is already in use.';
                case 'auth/user-disabled':
                    return 'account has been disabled.';
                case 'auth/operation-not-allowed':
                    return 'operator not allowed.';
                default:
                    return 'unknown error.';
            }
        },
    },
    mounted() {
        if (auth.currentUser) {
            this.checkEmailVerification();
        }
        this.$nextTick(M.updateTextFields);
    }
};

</script>

<style>
.switch label {
    display: flex;
    align-items: center;
}

.switch input:checked + .lever {
    background-color: #26a69a;
}

.switch input:checked + .lever:after {
    background-color: #fff;
}

.switch label .text-xl {
    transition: color 0.3s;
}

.switch input:checked ~ label .text-xl {
    color: #26a69a;
}

.fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter, .fade-leave-to {
    opacity: 0;
    transform: scale(10);
}
</style>