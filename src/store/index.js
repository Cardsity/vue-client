import Vue from 'vue';
import Vuex from 'vuex';
import router from '../router';
import WebSocketAsPromised from 'websocket-as-promised';

const SERVER_URL = `${window.location.hostname}:9012`;
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        // App
        updateAvailable: false,
        // Connection
        connection: null,
        connectionClosed: false,
        reconnecting: false,
        // Dialogs
        aboutDialog: false,
        helpDialog: false,
        shareDialog: false,
        leaveLobbyDialog: false,
        createDialog: false,
        passwordDialog: false,
        winnerDialog: false,
        // Lobby join
        joinLoading: false,
        joinedLobby: '',
        // Game related
        loggedIn: null,
        currentLobby: null,
        cards: [],
        timer: 0,
        playerCards: [],
        sentCards: false,
        jokerRequestsRemaining: 0,
        czarPicked: null,
    },
    getters: {
        selectedPlayerCards: state => {
            // deselected cards have a 0 as selected so we filter them out and sort them ascending
            return state.playerCards.filter(x => x.selected).sort((x1, x2) => x1.selected - x2.selected);
        },
        highestSelectedCard: (state, getters) => {
            const { selectedPlayerCards } = getters;
            return selectedPlayerCards.length > 0
                ? selectedPlayerCards[selectedPlayerCards.length - 1]
                : null;
        },
        isHost: state => {
            return (
                state.currentLobby.players &&
                state.currentLobby.players.length > 0 &&
                state.loggedIn === state.currentLobby.players[0].owner.id
            );
        },
        isCzar: state => {
            return state.loggedIn === state.currentLobby.czar.owner.id;
        },
        inGame: state => {
            return state.currentLobby && state.currentLobby.currentRound > 0;
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
        /**
         * Connect to the websocket server
         *
         * @param context
         */
        connect({ state, commit }) {
            console.log('Starting connection to websocket server');

            const webSocket = new WebSocketAsPromised('wss://' + SERVER_URL, {
                packMessage: data => JSON.stringify(data),
                unpackMessage: data => JSON.parse(data),
                attachRequestId: (data, requestId) => Object.assign({ requestId: requestId }, data),
                extractRequestId: data => data && data.requestId,
                timeout: 0,
            });

            webSocket
                .open()
                .then(() => {
                    console.log('Successfully connected to the websocket server');
                })
                .catch(error => {
                    commit('setConnectionClosed', true);
                    console.error('Failed connecting to websocket server', error);
                });
            commit('setConnection', webSocket);

            webSocket.onClose.addListener(event => {
                // TODO: reconnect because closed abnormally (locally) by the browser implementation.
                // https://stackoverflow.com/questions/19304157/getting-the-reason-why-websockets-closed-with-close-code-1006
                console.error('Websocket connection closed', event);
                commit('setConnectionClosed', true);
                commit('setLoggedIn', null);
                commit('setCurrentLobby', null);
                // TODO: reset all loading states
                state.joinLoading = false;

                if (router.currentRoute.path !== '/login') {
                    router.push('/login');
                }
            });
        },
        /**
         * Reconnect to the websocket server
         *
         * @param context
         */
        reconnect({ commit }) {
            commit('setReconnecting', true);
            const webSocket = this.state.connection;
            if (webSocket) {
                webSocket
                    .open()
                    .then(() => {
                        commit('setReconnecting', false);
                        commit('setConnectionClosed', false);
                        console.log('Successfully connected to the websocket server');
                    })
                    .catch(() => {
                        commit('setReconnecting', false);
                        commit('setConnectionClosed', true);
                    });
            } else {
                console.error('webSocket is not set. Failed to reconnect');
            }
        },

        joinLobby({ state, dispatch }, item) {
            state.joinedLobby = item;

            if (item.password) {
                state.passwordDialog = true;
            } else {
                dispatch('moveToLobby', { lobbyId: item.id });
            }
        },
        moveToLobby({ state, commit }, { lobbyId, password = '' }) {
            const webSocket = state.connection;

            const joinRequest = {
                lobbyId: Number(lobbyId),
                password: password,
            };
            console.log('Sending', joinRequest);
            webSocket.sendRequest(joinRequest).then(response => {
                state.joinLoading = false;
                console.log('Join response message received', response);

                if (response.success) {
                    state.passwordDialog = false;
                    console.log('successfully joined');
                    commit('setCurrentLobby', response);
                    router.push(`/lobby`);
                } else {
                    console.error(response);
                    Vue.toasted.show(response.message, {
                        icon: 'mdi-alert-circle',
                        duration: 1000,
                    });
                    if (router.currentRoute.path !== '/lobbyList') {
                        // fallback to lobby list (to fix invalid quick join links)
                        router.push('/lobbyList');
                    }
                }
            });
        },

        leaveLobby({ state, commit }) {
            state.leaveLobbyDialog = false;

            const webSocket = state.connection;
            const leaveLobbyRequest = {
                confirmLeave: true,
            };
            console.log('Sending', leaveLobbyRequest);
            webSocket.sendRequest(leaveLobbyRequest).then(response => {
                console.log('Leave lobby response message received', response);

                if (response.success) {
                    commit('setCurrentLobby', null);
                    router.push('/');
                } else {
                    console.error(response);
                    this.$toasted.show(response.message, {
                        icon: 'mdi-alert-circle',
                        duration: 1000,
                    });
                }
            });
        },

        /**
         * Select the played cards of the player the czar selected
         *
         * @param context
         * @param winnerID
         */
        selectWonCards({ state }, winnerID) {
            const wonCards = state.cards.filter(x => x.ownerId === winnerID);
            if (wonCards) {
                wonCards.forEach(wonCard => {
                    // This must be used to add new properties to reactive objects, as Vue cannot detect normal property additions
                    Vue.set(wonCard, 'selected', 1);
                });
            } else {
                console.error(`(Lobby) No wonCards not found in store cards`);
            }
        },
        /**
         * This fixes the ordering of the selected cards after one get's deselected
         *
         * @param context
         */
        fixSelectedCardsIndices({ getters }) {
            let i = 1;
            getters.selectedPlayerCards.forEach(playerCard => {
                playerCard.selected = i;
                // console.log(playerCard.text, 'is now', playerCard.selected);
                i++;
            });
        },
    },
    modules: {},
});
