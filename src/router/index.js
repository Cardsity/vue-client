import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store/index';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Home',
        redirect: () => {
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
    // TODO: can we do this in only one route?
    {
        path: '/quickJoin/:id/',
        name: 'QuickJoin',
        component: () => import('../views/Login.vue'),
    },
    {
        path: '/quickJoin/:id/:password',
        name: 'QuickJoinPassword',
        component: () => import('../views/Login.vue'),
    },
    {
        path: '*',
        component: () => import('../views/NotFound.vue'),
    },
];

const router = new VueRouter({
    mode: 'history',
    routes,
});

router.beforeEach((to, from, next) => {
    // move to login or previous depending on the state
    if (to.name === 'Login' || to.name === 'QuickJoin' || to.name === 'QuickJoinPassword') {
        if (store.state.loggedIn) {
            next(from);
        } else {
            next();
        }
    } else {
        if (store.state.loggedIn) {
            next();
        } else {
            next({ name: 'Login' });
        }
    }

    // move to lobby or lobby list depending on the state
    if (to.name === 'Lobby' && !store.state.currentLobby) {
        next({ name: 'Lobby List' });
    } else if (to.name === 'Lobby List' && store.state.currentLobby) {
        next({ name: 'Lobby' });
    }
});

export default router;
