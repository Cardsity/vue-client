<template>
    <v-main>
        <CreateLobbyDialog :lobby="lobby" v-if="$store.getters.isHost"></CreateLobbyDialog>
        <v-card class="mx-auto" max-width="750" outlined>
            <v-card-title>
                Lobby info
                <v-btn
                    depressed
                    v-if="$store.getters.isHost"
                    @click="$store.state.createDialog = true"
                    icon
                >
                    <v-icon>edit</v-icon>
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                    depressed
                    color="primary"
                    :disabled="lobby.players.length < 3"
                    v-if="$store.getters.isHost"
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
                    >
                        {{ lobby.players[0].owner.name }}
                    </span>
                </p>
                <p>
                    Score limit:
                    <span>{{ lobby.maxPoints }}</span>
                </p>
                <p>
                    Round limit:
                    <span>{{ lobby.maxRounds }}</span>
                </p>
                <p>
                    Pick limit:
                    <span>{{ `${lobby.pickLimit / 1000 / 60} min` }}</span>
                </p>
                <p>
                    Max joker requests:
                    <span>{{ `${lobby.maxJokerRequests}` }}</span>
                </p>
                <p>
                    Decks:
                    <v-chip
                        v-for="deck in lobby.decks"
                        color="primary"
                        :key="deck.id"
                        filter
                        :value="deck.id"
                        class="mr-1"
                    >
                        {{ deck.name }}
                    </v-chip>
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
    </v-main>
</template>

<script>
    import PlayerList from './PlayerList';
    import Chat from './Chat';
    import CreateLobbyDialog from './CreateLobbyDialog';

    export default {
        name: 'LobbyInfo',
        props: ['lobby'],
        components: {
            CreateLobbyDialog,
            PlayerList,
            Chat,
        },
        methods: {
            startGame() {
                const webSocket = this.$store.state.connection;

                const startGameRequest = { startGame: true };
                console.log('Sending', startGameRequest);

                webSocket.sendRequest(startGameRequest).then(response => {
                    console.log('Start game response message received', response);

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
                const textArea = document.createElement('textarea');
                textArea.value = `${document.location.protocol}//${document.location.host}/#/quickJoin/${this.$store.state.currentLobby.id}/${this.$store.state.currentLobby.password}`;

                // Avoid scrolling to bottom
                textArea.style.top = '0';
                textArea.style.left = '0';
                textArea.style.position = 'fixed';

                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();

                const successful = document.execCommand('copy');
                if (successful) {
                    this.$toasted.show('Successfully copied to clipboard', {
                        icon: 'info',
                        duration: 2500,
                    });
                } else {
                    this.$toasted.show('Failed copying to clipboard', {
                        icon: 'error',
                        duration: 1000,
                    });
                }

                document.body.removeChild(textArea);
            },
        },
    };
</script>

<style scoped></style>
