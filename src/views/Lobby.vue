<template>
    <div v-if="lobby">
        <audio id="drawSound">
            <source src="../assets/sounds/draw-card.wav" type="audio/wav" />
        </audio>
        <audio id="pointScoredSound">
            <source src="../assets/sounds/point-scored.wav" type="audio/wav" />
        </audio>
        <audio id="gameWonSound">
            <source src="../assets/sounds/game-won.wav" type="audio/wav" />
        </audio>
        <audio id="gameLostSound">
            <source src="../assets/sounds/game-lost.wav" type="audio/wav" />
        </audio>
        <WinnerDialog :winner="gameWinner" :players="players" :card-history="cardHistory"></WinnerDialog>
        <InGame v-if="$store.getters.inGame" :lobby="lobby"></InGame>
        <LobbyInfo v-else :lobby="lobby"></LobbyInfo>
    </div>
</template>

<script>
    import InGame from '../components/InGame';
    import LobbyInfo from '../components/LobbyInfo';
    import WinnerDialog from '../components/WinnerDialog';

    export default {
        name: 'Lobby',
        components: {
            WinnerDialog,
            InGame,
            LobbyInfo,
        },
        computed: {
            lobby() {
                return this.$store.state.currentLobby;
            },
        },
        data() {
            return {
                updateLobbyListener: null,
                gameWinner: null,
                players: null,
                cardHistory: null,
            };
        },
        mounted() {
            const webSocket = this.$store.state.connection;

            // Lobby packet handler: This handles general lobby packets which are not request-response based
            webSocket.onUnpackedMessage.addListener(
                (this.updateLobbyListener = data => {
                    console.log('(Lobby) Received packet. Raw data', data);

                    const {
                        decks,
                        cards,
                        kickReason,
                        currentRound,
                        players,
                        pickLimit,
                        unrevealedCardOwnerId,
                        newHand,
                        isCausedByJokerRequest,
                        jokerRequestsRemaining,
                        winnerId,
                        winner,
                        cardHistory,
                    } = data;

                    if (decks) {
                        // Game update
                        console.log('(Lobby) Game Update', data);
                        this.$store.commit('setCurrentLobby', data);
                        for (let i = 0; i < this.$store.state.cards.length; i++) {
                            const card = this.$store.state.cards[i];
                            if (card) {
                                const player = data.players.find(
                                    player => card.ownerId === player.owner.id
                                );
                                if (!player) {
                                    // remove card from player because he left
                                    this.$store.state.cards.splice(i, 1);
                                }
                            }
                        }
                    }
                    if (kickReason || kickReason === '') {
                        this.$toasted.show(
                            'You were kicked: ' + (kickReason ? kickReason : 'No message given'),
                            {
                                icon: 'mdi-gavel',
                                duration: 7500,
                            }
                        );

                        this.$store.commit('setCurrentLobby', null);
                        this.$router.push('/lobbyList');
                    }
                    if (currentRound && players) {
                        // a new round starts if we get a lobby update packet and no cards are selected
                        if (
                            currentRound > 0 &&
                            this.$store.state.cards.filter(x => x.selected).length <= 0
                        ) {
                            // start timer
                            this.$store.state.timer = pickLimit;
                        }
                    }
                    if (newHand) {
                        console.log(
                            '(Lobby) Update Hand',
                            newHand,
                            'joker requests',
                            jokerRequestsRemaining
                        );
                        const playCardDrawSound = newHand.length > this.$store.state.playerCards.length;
                        // this also resets the selected cards because we replace it
                        this.$store.state.playerCards = newHand;
                        if (!isCausedByJokerRequest) {
                            // we can select cards again
                            this.$store.state.sentCards = false;
                            this.$store.state.cards = [];
                        }
                        this.$store.state.czarPicked = null;
                        this.$store.state.jokerRequestsRemaining = jokerRequestsRemaining;

                        if (playCardDrawSound) {
                            const drawSound = document.getElementById('drawSound');
                            drawSound.currentTime = 0;
                            drawSound.volume = 1;
                            drawSound.play();
                        }
                    }
                    if (unrevealedCardOwnerId) {
                        this.$store.state.cards.push({ text: '' });
                        console.log(
                            '(Lobby) unrevealed cards',
                            unrevealedCardOwnerId,
                            this.$store.state.cards
                        );
                    }
                    if (cards) {
                        this.$store.state.cards = cards;
                        // reset timer TODO: circle
                        this.$store.state.timer = this.lobby.pickLimit;
                        this.$store.state.czarPicked = null;
                        this.$store.state.sentCards = true;
                        // TODO: select the card which was selected randomly
                    }
                    if (winnerId) {
                        this.$store.state.czarPicked = winnerId;
                        this.$store.dispatch('selectWonCards', winnerId);
                        // TODO: server should send which cards are from which player so we can display which card was from which player
                        if (winnerId === this.$store.state.loggedIn) {
                            const pointScoredSound = document.getElementById('pointScoredSound');
                            pointScoredSound.currentTime = 0;
                            pointScoredSound.volume = 1;
                            pointScoredSound.play();
                        }
                        this.$store.state.timer = 10 * 1000;
                    }
                    if (winner) {
                        console.log('(Lobby) Game winner', { winner, cardHistory });
                        this.gameWinner = winner;
                        if (winner.owner.id === this.$store.state.loggedIn) {
                            const gameWonSound = document.getElementById('gameWonSound');
                            gameWonSound.currentTime = 0;
                            gameWonSound.volume = 1;
                            gameWonSound.play();
                        } else {
                            const gameLostSound = document.getElementById('gameLostSound');
                            gameLostSound.currentTime = 0;
                            gameLostSound.volume = 1;
                            gameLostSound.play();
                        }
                        this.cardHistory = cardHistory;
                        // we need to copy it so it doesn't change when the lobby is reset
                        this.players = [...this.$store.state.currentLobby.players];
                        this.$store.state.winnerDialog = true;
                    }
                })
            );
        },
        destroyed() {
            if (this.updateLobbyListener) {
                const webSocket = this.$store.state.connection;
                webSocket.onUnpackedMessage.removeListener(this.updateLobbyListener);
            }
        },
    };
</script>

<style scoped lang="scss"></style>
