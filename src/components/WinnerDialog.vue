<template>
    <v-dialog persistent v-model="$store.state.winnerDialog" v-if="winner && players">
        <v-card>
            <v-toolbar color="primary" dark flat>
                <v-icon>emoji_events</v-icon>
                <v-spacer></v-spacer>
                <v-card-title>
                    Game ended!
                </v-card-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="$store.state.winnerDialog = false">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-container fluid id="wonCard">
                <v-card-title>
                    We have a winner
                </v-card-title>
                <v-list-item>
                    <v-list-item-icon>
                        <v-icon :color="winner.owner.color">
                            account_circle
                        </v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>
                            {{ winner.owner.name }}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            {{ winner.points + ' Points' }}
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>

                <v-card-title>Points</v-card-title>
                <v-list>
                    <v-list-item v-for="(player, index) in sortedPlayers" :key="index">
                        <v-list-item-icon>
                            <v-icon :color="player.owner.color">
                                account_circle
                            </v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>
                                {{ player.owner.name }}
                                <v-icon color="orange" v-if="player.owner.id === winner.owner.id">
                                    emoji_events
                                </v-icon>
                            </v-list-item-title>
                            <v-list-item-subtitle>
                                {{ player.points + ' Points' }}
                            </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>

                <v-card-title>Cards per round</v-card-title>
                <v-timeline>
                    <v-timeline-item
                        v-for="(played, i) in cardHistory"
                        :key="i"
                        icon="account_circle"
                        :color="played[0].color"
                        fill-dot
                        large
                    >
                        <v-card elevation="12">
                            <v-card-title class="title">Round {{ i + 1 }}</v-card-title>
                            <v-card-subtitle>
                                Won by
                                <span :style="`color: ${played[0].color};`">{{ played[0].name }}</span>
                            </v-card-subtitle>
                            <v-row no-gutters class="pa-3">
                                <Card :disabled="true" :card="played[1]" :black="true"></Card>
                                <Card
                                    v-for="(card, index) in played[2]"
                                    :key="index"
                                    :card="card"
                                    :disabled="true"
                                ></Card>
                            </v-row>
                        </v-card>
                    </v-timeline-item>
                </v-timeline>
            </v-container>
        </v-card>
    </v-dialog>
</template>

<script>
    import Card from './Card';

    export default {
        name: 'WinnerDialog',
        components: { Card },
        props: ['winner', 'players', 'cardHistory'],
        computed: {
            sortedPlayers() {
                return [...this.players].sort((x1, x2) => x2.points - x1.points);
            },
        },
    };
</script>

<style scoped></style>
