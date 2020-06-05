<template>
    <v-content>
        <v-card class="mx-auto" max-width="750" outlined>
            <v-card-title>
                Lobby info
                <v-spacer></v-spacer>
                <v-btn
                    depressed
                    color="primary"
                    :disabled="lobby.players.length < 3"
                    v-if="$store.state.loggedIn === lobby.players[0].clientID"
                    @click="startGame"
                >
                    <v-icon>launch</v-icon>
                    Start game
                </v-btn>
            </v-card-title>

            <v-card-text>
                <p>Lobby name: {{ lobby.name }}</p>
                <p>
                    Host:
                    <span
                        v-if="lobby.players && lobby.players.length > 0"
                        :style="`color: ${lobby.players[0].color};`"
                        >{{ lobby.players[0].name }}</span
                    >
                </p>
                <p>
                    Score limit:
                    <span>{{ lobby.pointLimit }}</span>
                </p>
                <p>
                    Round limit:
                    <span>{{ lobby.maxRounds }}</span>
                </p>
                <p>
                    Pick limit:
                    <span>{{ `${lobby.pickLimit}ms` }}</span>
                </p>
                <v-btn color="accent" @click="copyQuickJoinLink">
                    <v-icon>link</v-icon>
                    Copy quick join link
                </v-btn>
            </v-card-text>

            <v-divider></v-divider>
            <PlayerList :lobby="lobby"></PlayerList>

            <v-divider></v-divider>

            <v-card-subtitle>Chat</v-card-subtitle>
            <Chat></Chat>
        </v-card>
    </v-content>
</template>

<script>
    import PlayerList from './PlayerList';
    import Chat from './Chat';

    export default {
        name: 'LobbyInfo',
        props: ['lobby'],
        components: {
            PlayerList,
            Chat,
        },
        methods: {
            startGame() {
                const webSocket = this.$store.state.connection;

                const startGameRequest = { startGame: true };
                console.log('Sending', startGameRequest);

                webSocket.sendRequest(startGameRequest).then(response => {
                    console.log('Chat response message received', response);

                    if (response.success) {
                        this.$toasted.show(response.message, {
                            icon: 'info',
                            duration: 2500,
                        });
                    } else {
                        console.error(response);
                        this.$toasted.show(response.message, {
                            icon: 'error',
                            duration: 1000,
                        });
                    }
                });
            },
            copyQuickJoinLink() {
                alert('TODO');
            },
        },
    };
</script>

<style scoped></style>
