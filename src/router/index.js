import { createRouter, createWebHistory } from 'vue-router';
import { auth } from '../firebase';
import UserLogin from '../views/UserLogin.vue';
import UserDashboard from '../views/UserDashboard.vue';

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: UserLogin },
    { path: '/dashboard', component: UserDashboard, meta: { requiresAuth: true } },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const isAuthenticated = auth.currentUser;

    if (requiresAuth && !isAuthenticated) {
        next('/login');
    } else {
        next();
    }
});


export default router;
