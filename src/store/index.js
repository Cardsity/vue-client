import Vue from 'vue';
import Vuex from 'vuex';
import router from '../router';
import WebSocketAsPromised from 'websocket-as-promised';

const SERVER_URL = '127.0.0.1:9012';
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        // Connection
        connection: null,
        connectionClosed: false,
        reconnecting: false,
        // Dialogs
        aboutDialog: false,
        helpDialog: false,
        shareDialog: false,
        leaveLobbyDialog: false,
        // Game related
        loggedIn: null,
        currentLobby: null,
        cards: [],
        timer: 0,
        playerCards: [],
        sentCards: false,
        isCzar: false,
        czarPicked: null,
    },
    getters: {
        selectedPlayerCards: state => {
            return state.playerCards.filter(x => x.selected);
        },
    },
    mutations: {
        setConnection(state, connection) {
            state.connection = connection;
        },
        setReconnecting(state, reconnecting) {
            state.reconnecting = reconnecting;
        },
        setConnectionClosed(state, connectionClosed) {
            state.connectionClosed = connectionClosed;
        },
        setLoggedIn(state, loggedIn) {
            state.loggedIn = loggedIn;
        },
        setCurrentLobby(state, currentLobby) {
            state.currentLobby = currentLobby;
        },
    },
    actions: {
        connect(context) {
            console.log('Starting connection to websocket server');

            const webSocket = new WebSocketAsPromised('ws://' + SERVER_URL, {
                packMessage: data => JSON.stringify(data),
                unpackMessage: data => JSON.parse(data),
                attachRequestId: (data, requestId) => Object.assign({ requestId: requestId }, data),
                extractRequestId: data => data && data.requestId,
                timeout: 0,
            });

            // TODO: connect websocket when logging in!!!!
            webSocket
                .open()
                .then(() => {
                    console.log('Successfully connected to the websocket server');
                })
                .catch(() => {
                    context.commit('setConnectionClosed', true);
                });
            context.commit('setConnection', webSocket);

            webSocket.onClose.addListener(event => {
                console.log('Websocket connection closed', event);
                context.commit('setConnectionClosed', true);
                context.commit('setLoggedIn', null);
                if (router.currentRoute.path !== '/login') {
                    router.push('/login');
                }
            });
        },
        reconnect(context) {
            context.commit('setReconnecting', true);
            const webSocket = this.state.connection;
            webSocket
                .open()
                .then(() => {
                    context.commit('setReconnecting', false);
                    context.commit('setConnectionClosed', false);
                    console.log('Successfully connected to the websocket server');
                })
                .catch(() => {
                    context.commit('setReconnecting', false);
                    context.commit('setConnectionClosed', true);
                });
        },
    },
    modules: {},
});
