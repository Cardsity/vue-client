<template>
    <v-dialog persistent scrollable v-model="$store.state.winnerDialog" v-if="winner && players">
        <v-card>
            <v-toolbar color="primary" dark flat>
                <v-icon>mdi-trophy</v-icon>
                <v-spacer></v-spacer>
                <v-card-title>
                    Game ended!
                </v-card-title>
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            icon
                            @click="saveAsImage"
                            v-bind="attrs"
                            v-on="on"
                            aria-label="Save card history"
                        >
                            <v-icon>mdi-content-save</v-icon>
                        </v-btn>
                    </template>
                    <span>Save card history</span>
                </v-tooltip>
                <v-btn icon @click="$store.state.winnerDialog = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text>
                <v-card-title>
                    We have a winner
                </v-card-title>
                <v-list-item>
                    <v-list-item-icon>
                        <v-icon :color="winner.owner.color">
                            mdi-account-circle
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
                                mdi-account-circle
                            </v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>
                                {{ player.owner.name }}
                                <v-icon color="orange" v-if="player.owner.id === winner.owner.id">
                                    mdi-trophy
                                </v-icon>
                            </v-list-item-title>
                            <v-list-item-subtitle>
                                {{ player.points + ' Points' }}
                            </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>

                <v-card-title>Cards per round</v-card-title>
                <v-timeline id="wonTimeline">
                    <v-timeline-item
                        v-for="(played, i) in cardHistory"
                        :key="i"
                        icon="mdi-account-circle"
                        :color="played[0].color"
                        fill-dot
                        large
                    >
                        <v-card elevation="12">
                            <v-card-title class="text-h6">Round {{ i + 1 }}</v-card-title>
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
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
    import Card from './Card';
    import html2canvas from '@trainiac/html2canvas';

    export default {
        name: 'WinnerDialog',
        components: { Card },
        props: ['winner', 'players', 'cardHistory'],
        computed: {
            sortedPlayers() {
                return [...this.players].sort((x1, x2) => x2.points - x1.points);
            },
        },
        methods: {
            async saveAsImage() {
                const wonTimeline = document.getElementById('wonTimeline');
                const canvas = await html2canvas(wonTimeline, {
                    logging: true,
                    backgroundColor: null,
                });
                canvas.toBlob(blob => {
                    // blob ready, download it
                    const link = document.createElement('a');

                    let current_datetime = new Date();
                    let formatted_date =
                        current_datetime.getFullYear() +
                        '-' +
                        (current_datetime.getMonth() + 1) +
                        '-' +
                        current_datetime.getDate();
                    link.download = `card-history-${formatted_date}.png`;

                    link.href = URL.createObjectURL(blob);
                    link.click();

                    // delete the internal blob reference, to let the browser clear memory from it
                    URL.revokeObjectURL(link.href);
                }, 'image/png');
            },
        },
    };
</script>

<style scoped></style>
