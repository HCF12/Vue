import { createRouter,createWebHashHistory } from 'vue-router'
import store from "../store/index.js";

const routes = [
    {
        path: '/',
        name: 'login',
        component: () => import('../views/Login.vue'),
    },
    {
        path: '/main',
        name: 'main',
        component: () => import('../views/Main.vue'),
        redirect: '/home',
        children: [
            {
                path: '/home',
                name: 'home',
                beforeEnter: (to,from,next) => {
                    if(store.state.isLogin){
                        next();
                    }else {
                        const token = window.sessionStorage.getItem('token');
                        if (!token) {
                            next('/');
                        } else {
                            next();
                        }
                    }
                },
                component: () => import('../views/home/Home.vue')
            },
            {
                path: '/user',
                name: 'user',
                beforeEnter: (to,from,next) => {
                    if(store.state.isLogin){
                        next();
                    }else{
                        const token = window.sessionStorage.getItem('token');
                        if (!token) {
                            next('/');
                        } else {
                            next();
                        }
                    }
                },
                component: () => import('../views/user/User.vue')
            },
            {
                path: '/safe',
                name: 'safe',
                beforeEnter: (to,from,next) => {
                    if(store.state.isLogin){
                        next();
                    }else{
                        const token = window.sessionStorage.getItem('token');
                        if (!token) {
                            next('/');
                        } else {
                            next();
                        }
                    }
                },
                component: () => import('../views/SafeManager.vue')
            },
            {
                path: '/emailSetting',
                name: 'emailSetting',
                beforeEnter: (to,from,next) => {
                    if(store.state.isLogin){
                        next();
                    }else{
                        const token = window.sessionStorage.getItem('token');
                        if (!token) {
                            next('/');
                        } else {
                            next();
                        }
                    }
                },
                component: () => import('../views/EmailSetting.vue')
            },
            {
                path: '/emailTask',
                name: 'emailTask',
                beforeEnter: (to,from,next) => {
                    if(store.state.isLogin){
                        next();
                    }else{
                        const token = window.sessionStorage.getItem('token');
                        if (!token) {
                            next('/');
                        } else {
                            next();
                        }
                    }
                },
                component: () => import('../views/EmailTask.vue')
            },
            {
                path: '/autoTask',
                name: 'autoTask',
                beforeEnter: (to,from,next) => {
                    if(store.state.isLogin){
                        next();
                    }else{
                        const token = window.sessionStorage.getItem('token');
                        if (!token) {
                            next('/');
                        } else {
                            next();
                        }
                    }
                },
                component: () => import('../views/RegularTask.vue')
            },
            {
                path: '/emailHis',
                name: 'emailHis',
                beforeEnter: (to,from,next) => {
                    if(store.state.isLogin){
                        next();
                    }else{
                        const token = window.sessionStorage.getItem('token');
                        if (!token) {
                            next('/');
                        } else {
                            next();
                        }
                    }
                },
                component: () => import('../views/EmailHistory.vue')
            },
            {
                path: '/sendEmail',
                name: 'sendEmail',
                beforeEnter: (to,from,next) => {
                    if(store.state.isLogin){
                        next();
                    }else{
                        const token = window.sessionStorage.getItem('token');
                        if (!token) {
                            next('/');
                        } else {
                            next();
                        }
                    }
                },
                component: () => import('../views/handMovementSendEmail.vue')
            }
        ]
    }
]

const router = createRouter({
    history: createWebHashHistory('myDemo'),
    routes
})

export default router