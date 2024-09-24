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
    auth.onAuthStateChanged((user) => {
        const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

        if (requiresAuth && !user) {
            next('/login'); 
        } else if (to.path === '/login' && user) {
            next('/dashboard');
        } else {
            next();
        }
    });
});


export default router;
