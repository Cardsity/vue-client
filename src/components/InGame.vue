<template>
    <div>
        <v-row no-gutters align="start" justify="start" class="ml-3 mt-3">
            <!-- Black card -->
            <Card :black="true" :card="lobby.blackCard" :disabled="true"></Card>
            <v-divider vertical class="ml-1"></v-divider>
            <v-spacer></v-spacer>
            <!-- Played cards -->
            <Card
                :disabled="!$store.state.isCzar || !playedCard.text || $store.state.czarPicked"
                v-for="(playedCard, index) in $store.state.cards"
                :key="index"
                :card="playedCard"
            ></Card>
            <v-spacer></v-spacer>
            <div class="mr-2">
                <v-progress-circular
                    :value="(lobby.currentRound / lobby.maxRounds) * 100"
                    size="50"
                    :color="'red'"
                >
                    {{ lobby.currentRound }}/{{ lobby.maxRounds }}
                </v-progress-circular>
                <br />
                <v-progress-circular :value="timerPercent" size="50" :color="'primary'">
                    {{ timeString }}
                </v-progress-circular>
            </div>
        </v-row>
        <v-divider></v-divider>
        <v-row no-gutters align="start" justify="start" class="cards-view ml-3">
            <PlayerList :lobby="lobby"></PlayerList>
            <v-divider vertical class="ml-4 mr-4"></v-divider>

            <div class="czar-overlay" v-if="$store.state.isCzar">You are the Card Czar this round!</div>
            <!-- Player's hand -->
            <Card
                :black="false"
                v-for="(playerCard, index) in $store.state.playerCards"
                :card="playerCard"
                :key="index"
                :disabled="$store.state.sentCards"
                :blanks="lobby.blackCard.blanks"
                class="mt-3 mb-3"
            ></Card>

            <v-spacer></v-spacer>
            <v-btn
                @click="submitCards"
                :disabled="
                    $store.state.sentCards ||
                        $store.getters.selectedPlayerCards.length <
                            $store.state.currentLobby.blackCard.blanks
                "
            >
                <v-icon>send</v-icon>
                Submit selected cards
            </v-btn>

            <v-spacer></v-spacer>
            <Chat></Chat>
        </v-row>
    </div>
</template>

<script>
    import Card from './Card';
    import PlayerList from './PlayerList';
    import Chat from './Chat';

    export default {
        name: 'InGame',
        props: ['lobby'],
        components: {
            Chat,
            PlayerList,
            Card,
        },
        data() {
            return {
                timerPercent: 100,
                timerInterval: null,
            };
        },
        mounted() {
            this.startTimer();
        },
        computed: {
            timeString() {
                const origSeconds = this.$store.state.timer / 1000;
                const minutes = Math.floor(origSeconds / 60);
                let seconds = origSeconds - minutes * 60;

                if (seconds >= 0 && seconds <= 9) {
                    seconds = `0${seconds}`;
                }

                return `${minutes}:${seconds}`;
            },
        },
        methods: {
            startTimer() {
                this.timerInterval = window.setInterval(() => {
                    if (this.$store.state.timer > 0) {
                        this.$store.state.timer -= 1000;
                        this.timerPercent =
                            (this.$store.state.timer / this.$store.state.currentLobby.pickLimit) * 100;
                    }
                }, 1000);
            },
            submitCards() {
                const webSocket = this.$store.state.connection;

                const cardPlayRequest = {
                    playedCards: this.$store.state.playerCards.filter(x => x.selected),
                };
                console.log('Sending', cardPlayRequest);

                webSocket.sendRequest(cardPlayRequest).then(response => {
                    console.log('Card play response message received', response);

                    if (response.success) {
                        this.$store.state.sentCards = true;
                    } else {
                        console.error(response);
                        this.$toasted.show(response.message, {
                            icon: 'error',
                            duration: 1000,
                        });
                    }
                });
            },
        },
        destroyed() {
            if (this.timerInterval) {
                window.clearInterval(this.timerInterval);
            } else {
                console.warn('(InGame) No timerInterval to destroy');
            }
        },
    };
</script>

<style lang="scss">
    .v-progress-circular__overlay {
        transition: none !important;
    }
</style>

<style lang="scss" scoped>
    .cards-view {
        position: relative;
    }
    .czar-overlay {
        position: absolute;
        background-color: rgba(0, 0, 0, 0.3);
        color: rgba(255, 255, 255, 0.9);
        font-size: 24pt;
        font-weight: bold;
        height: 100%;
        width: 100%;
        z-index: 100;

        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
