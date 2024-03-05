import {createRouter, createWebHistory, } from 'vue-router'
import type {RouteLocationNormalized, NavigationGuardNext} from 'vue-router'
import {useUserStore} from "@/stores/userStore";

const requireAuth = async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const userStore = useUserStore();
    userStore.loadingSession = true;
    const user = await userStore.currentUser();
    if (!user) {
        next("/login");
    } else {
        next();
    }

    userStore.loadingSession = false;
};

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('@/views/HomeView.vue'),
            beforeEnter: requireAuth,
            meta: {
                authenticatedLayout: true,
                requiresAuth: true,
                public: false
            }
        },
        {
            path: '/cart',
            name: 'cart',
            component: () => import('@/views/MyCart.vue'),
            beforeEnter: requireAuth,
            meta: {
                authenticatedLayout: true,
                requiresAuth: true,
                public: false
            }
        },
        {
            path: '/sales',
            name: 'sales',
            component: () => import('@/views/SalesView.vue'),
            beforeEnter: requireAuth,
            meta: {
                authenticatedLayout: true,
                requiresAuth: true,
                public: false
            }
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/LoginView.vue'),
            meta: {
                authenticatedLayout: false,
                requiresAuth: false,
                loginLayout: true,
                public: true
            }
        }
    ]
})

export default router
