<template>
    <div>
        <v-row no-gutters align="start" justify="start" class="ml-3 mt-3" style="position:relative;">
            <!-- Black card -->
            <Card :black="true" :card="lobby.blackCard" :disabled="true"></Card>
            <v-divider vertical class="ml-1"></v-divider>
            <v-spacer></v-spacer>
            <!-- Played cards -->
            <Card
                :disabled="!$store.state.isCzar || !playedCard.text || $store.state.czarPicked"
                v-for="(playedCard, index) in $store.state.cards"
                :space-right="lobby.blackCard.blanks > 1 && (index + 1) % lobby.blackCard.blanks === 0"
                :key="index"
                :card="playedCard"
            ></Card>
            <!-- Add spacer when card owner changes -->
            <!--<v-divider
                    vertical
                    class="ml-1"
                    v-if="lobby.blackCard.blanks > 1 && index % lobby.blackCard.blanks !== 0"
            ></v-divider>-->
            <v-spacer></v-spacer>
            <div class="mr-2" style="height: inherit;">
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
            <v-btn
                style="position: absolute; bottom: 0; right: 0; margin: 0.5rem;"
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
        </v-row>
        <v-divider></v-divider>
        <v-row no-gutters align="start" justify="start" class="cards-view">
            <div>
                <PlayerList :lobby="lobby"></PlayerList>
                <Chat></Chat>
            </div>
            <v-divider vertical></v-divider>

            <!-- Player's hand -->
            <v-col style="position: relative;">
                <div class="czar-overlay" v-if="$store.state.isCzar">
                    You are the Card Czar this round!
                </div>
                <v-container fluid class="ml-2">
                    <v-row no-gutters align="start" justify="start">
                        <Card
                            :black="false"
                            v-for="(playerCard, index) in $store.state.playerCards"
                            :card="playerCard"
                            :key="index"
                            :disabled="$store.state.sentCards"
                            :blanks="lobby.blackCard.blanks"
                            class="mt-3 mb-3"
                        ></Card>
                    </v-row>
                </v-container>
            </v-col>

            <!--<v-spacer></v-spacer>-->
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
                    playedCards: this.$store.getters.selectedPlayerCards,
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
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        z-index: 100;

        text-shadow: 0 0 15px rgba(0, 0, 0, 0.57);
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
