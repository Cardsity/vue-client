<template>
    <div>
        <InGame v-if="inGame" :lobby="lobby"></InGame>
        <LobbyInfo v-else :lobby="lobby"></LobbyInfo>
    </div>
</template>

<script>
    import InGame from '../components/InGame';
    import LobbyInfo from '../components/LobbyInfo';

    export default {
        name: 'Lobby',
        components: {
            InGame,
            LobbyInfo,
        },
        computed: {
            lobby() {
                return this.$store.state.currentLobby;
            },
            inGame() {
                return this.lobby.currentRound > 0;
            },
        },
        data() {
            return {
                updateLobbyListener: null,
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
                        revealedCards,
                        newHand,
                        isCzar,
                        winnerID,
                        gameWinner,
                    } = data;

                    if (decks) {
                        this.$store.commit('setCurrentLobby', data);
                    }
                    if (cards) {
                        this.$store.state.cards = cards;
                    }
                    if (kickReason || kickReason === '') {
                        this.$toasted.show(
                            'You were kicked: ' + (kickReason ? kickReason : 'No message given'),
                            {
                                icon: 'gavel',
                                duration: 7500,
                            }
                        );

                        this.$router.push('/lobbyList');
                    }
                    if (currentRound && players) {
                        if (currentRound > 0) {
                            // start timer
                            this.$store.state.timer = pickLimit;
                        }
                    }
                    if (newHand) {
                        console.log('(Lobby) Update Hand', { newHand, isCzar });
                        // this also resets the selected cards because we replace it
                        this.$store.state.playerCards = newHand;
                        this.$store.state.isCzar = isCzar;
                        // we can select cards again
                        this.$store.state.sentCards = false;
                        this.$store.state.cards = [];
                    }
                    if (unrevealedCardOwnerId) {
                        this.$store.state.cards.push({ text: '' });
                        console.log('cards', this.$store.state.cards);
                    }
                    if (revealedCards) {
                        this.$store.state.cards = revealedCards;
                        // reset timer TODO: circle
                        this.$store.state.timer = this.lobby.pickLimit;
                        this.$store.state.czarPicked = null;
                    }
                    if (winnerID) {
                        this.$store.state.timer = 15 * 1000;
                        this.$store.state.czarPicked = winnerID;
                        this.$store.dispatch('selectWonCards', winnerID);
                    }
                    if (gameWinner) {
                        // TODO
                        console.log('(Lobby) Game winner', gameWinner);
                        alert('Game winner: ' + JSON.stringify(gameWinner));
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
