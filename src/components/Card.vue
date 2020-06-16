<template>
    <v-card
        v-model="card"
        class="cah-card elevation-4 mr-2"
        :class="{
            'cah-card-black': black,
            'cah-card-white': !black,
            disabled: disabled,
            selected: card.selected,
            'mr-7': spaceRight,
        }"
        @click="clickCard"
    >
        <span class="cah-card-text">{{ text }}</span>
        <span class="cah-question" v-if="!text">?</span>
        <img class="cah-card-image" alt="Card logo" src="../assets/card-logo.png" />
        <!-- Only show the number when the selected and blanks is bigger than one (this also prevents showing it on the czar picked cards) -->
        <span class="cah-card-number" v-if="card.selected && blanks > 1">{{ card.selected }}</span>
    </v-card>
</template>

<script>
    import VanillaTilt from 'vanilla-tilt';

    export default {
        name: 'Card',
        props: ['card', 'black', 'disabled', 'blanks', 'spaceRight'],
        computed: {
            // for easier access
            text() {
                return this.card.text;
            },
        },
        methods: {
            clickCard() {
                if (!this.disabled) {
                    // If blanks were passed this is a playerCard
                    if (this.blanks) {
                        const { selectedPlayerCards, highestSelectedCard } = this.$store.getters;
                        const playedCardsCount = selectedPlayerCards.length;
                        const allCardSelected = playedCardsCount >= this.blanks;

                        // we need to add one when a new card get's selected, otherwise the highest card get's updated
                        const index =
                            (highestSelectedCard ? highestSelectedCard.selected : 0) +
                            (allCardSelected ? 0 : 1);

                        console.log('clicked playerCard', {
                            playerCards: this.$store.state.playerCards,
                            playedCardsCount,
                            blanks: this.blanks,
                            card: this.card,
                            index,
                        });

                        if (!this.card.selected) {
                            // if all cards are selected we deselect the highest
                            if (allCardSelected) {
                                selectedPlayerCards[selectedPlayerCards.length - 1].selected = 0;
                            }
                            // This must be used to add new properties to reactive objects, as Vue cannot detect normal property additions
                            this.$set(this.card, 'selected', index);
                        } else {
                            // This must be used to add new properties to reactive objects, as Vue cannot detect normal property additions
                            this.$set(this.card, 'selected', 0);
                            // Fix ordering of others
                            this.$store.dispatch('fixSelectedCardsIndices');
                        }
                    } else {
                        const webSocket = this.$store.state.connection;

                        const winnerID = this.card.ownerId;
                        const czarPickRequest = {
                            winnerId: winnerID,
                        };
                        console.log('Sending', czarPickRequest);

                        webSocket.sendRequest(czarPickRequest).then(response => {
                            console.log('Czar pick response message received', response);

                            if (response.success) {
                                // This must be used to add new properties to reactive objects, as Vue cannot detect normal property additions
                                this.$store.dispatch('selectWonCards', winnerID);
                                this.$store.state.czarPicked = this.card;
                            } else {
                                console.error(response);
                                this.$toasted.show(response.message, {
                                    icon: 'mdi-alert-circle',
                                    duration: 1000,
                                });
                            }
                        });
                    }
                }
            },
        },
        mounted() {
            VanillaTilt.init(this.$el, {
                glare: true,
                scale: 1.1,
                'max-glare': 0.25,
                gyroscope: false,
                max: 0,
            });
        },
        beforeDestroy() {
            if (this.$el.vanillaTilt) {
                this.$el.vanillaTilt.destroy();
            } else {
                console.warn('VanillaTilt was not registered on Card component with card', this.card);
            }
        },
    };
</script>

<style lang="scss" scoped>
    .cah-card {
        position: relative;
        width: 10rem;
        height: 13rem;
        padding-right: 1rem;

        border: 1px solid black;
        border-radius: 5px;
        font-family: 'Roboto', sans-serif;
        font-weight: bold;
        margin-bottom: 0.75rem;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
        cursor: pointer;
    }

    .cah-card.disabled {
        cursor: not-allowed;
    }

    .cah-card.selected {
        border: 3px solid red;
        box-sizing: border-box;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        /*transform: scale3d(1.04, 1.04, 1.04) !important;*/
    }

    .cah-card-black {
        background-color: black;
        color: white;
    }
    .cah-card-white {
        background: linear-gradient(to top right, rgb(220, 220, 220), rgb(255, 255, 255));
        color: black;
    }

    .cah-card-black > .cah-card-image {
        filter: invert(100%);
    }

    .cah-question {
        position: absolute;
        font-size: 35pt;
        color: rgba(0, 0, 0, 0.2);
        text-align: center;
        margin: auto;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        vertical-align: middle;
    }

    .cah-card-image {
        position: absolute;
        width: 2.5rem;
        left: 0;
        bottom: 0;
    }

    .cah-card-number {
        position: absolute;
        right: 0;
        bottom: 0;
        border-radius: 50%;
        width: 34px;
        height: 34px;
        background: #fff;
        border: 3px solid #000;
        color: #000;
        text-align: center;
        font-size: 14pt;
        margin: 0.2rem;
    }

    .cah-card-text {
        position: relative;
        top: 0.75rem;
        left: 0.6rem;
        padding-right: 0.75rem;
    }
</style>
