import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store/index';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Home',
        redirect: () => {
            console.log('loggedIn', store.state.loggedIn);
            return store.state.loggedIn ? '/lobbyList' : '/login';
        },
    },
    {
        path: '/lobbyList',
        name: 'Lobby List',
        component: () => import('../views/LobbyList.vue'),
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue'),
    },
    {
        path: '/lobby',
        name: 'Lobby',
        component: () => import('../views/Lobby.vue'),
    },
    {
        path: '*',
        component: () => import('../views/NotFound.vue'),
    },
];

const router = new VueRouter({
    routes,
});

export default router;
