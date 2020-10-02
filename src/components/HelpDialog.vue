<template>
    <v-dialog scrollable v-model="$store.state.helpDialog" max-width="850">
        <v-card class="mx-auto" elevation="12" outlined>
            <v-toolbar color="primary" dark flat class="mb-3">
                <v-toolbar-title><v-icon>mdi-help-circle</v-icon> Help</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="$store.state.helpDialog = false" aria-label="Close">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text>
                <v-expansion-panels accordion multiple hover>
                    <v-expansion-panel>
                        <v-expansion-panel-header>
                            To start the game, each player draws ten white cards.
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            According to the rule book provided with the game, the person who most
                            recently defecated (a form of primitive randomization) begins as the "Card
                            Czar" (or "Card Tsar") and plays a black card, face up. The Card Czar then
                            reads the question or fill-in-the-blanks phrase on the black card out loud.
                        </v-expansion-panel-content>
                    </v-expansion-panel>

                    <v-expansion-panel>
                        <v-expansion-panel-header>
                            The other players answer the question or fill in the blanks by each passing
                            one white card (or however many required by the black card), face down, to
                            the Card Czar
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            The Card Czar shuffles all of the answers and shares each card combination
                            with the group. For full effect, the Card Czar should usually re-read the
                            black card before presenting each answer. The Card Czar then picks the
                            funniest play, and whoever submitted it gets one "Awesome Point".
                        </v-expansion-panel-content>
                    </v-expansion-panel>

                    <v-expansion-panel>
                        <v-expansion-panel-header>
                            After the round, a new player becomes the Card Czar, and everyone draws back
                            up to 10 white cards.
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            The part of speech of a white card is a noun or gerund, including both single
                            words and phrase constructions. Black cards are either fill-in-the-blank
                            statements or questions. Both white and black cards break these rules on rare
                            occasions.
                        </v-expansion-panel-content>
                    </v-expansion-panel>

                    <v-expansion-panel>
                        <v-expansion-panel-header>
                            The rules do not state how to win the game—the object being simply to have
                            fun.
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            The rules in Cards Against Humanity are flexible and can be altered with the
                            many house rules (which are listed in the rules) that players can incorporate
                            (e.g. winning cards are chosen democratically, ability to trade points for
                            cards, points given by ranks, etc.). The official rules include additional
                            provisions for gambling previously won "Awesome Points" for the right to play
                            additional white cards during a round.
                        </v-expansion-panel-content>
                    </v-expansion-panel>

                    <v-expansion-panel>
                        <v-expansion-panel-header> Source </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <a
                                href="https://en.wikipedia.org/wiki/Cards_Against_Humanity#Gameplay"
                                target="_blank"
                            >
                                Wikipedia
                            </a>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        name: 'HelpDialog',
    };
</script>

<style scoped></style>
