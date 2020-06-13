<template>
    <div>
        <v-dialog v-model="kickDialog" v-if="playerToKick" width="500">
            <v-card>
                <v-card-title class="headline">
                    <span class="headline">Kick player {{ playerToKick.owner.name }}</span>
                </v-card-title>

                <v-card-text>
                    <v-text-field
                        label="Reason"
                        required
                        type="text"
                        prepend-inner-icon="gavel"
                        v-model="kickReason"
                        clearable
                        solo
                    ></v-text-field>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary darken-1" text outlined @click="kickPlayer()">
                        Kick
                        <v-icon>arrow_right</v-icon>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-subheader>Players ({{ `${lobby.players.length}/${lobby.maxPlayers}` }})</v-subheader>
        <v-list-item v-for="(player, i) in lobby.players" :key="i">
            <v-list-item-content>
                <v-list-item-title :style="`color: ${player.owner.color};`">
                    <v-icon :color="player.owner.color">account_circle</v-icon>
                    {{ player.owner.name }}
                    <v-chip color="secondary" class="mr-1">{{ player.points }} Points</v-chip>
                    <v-chip color="primary" v-if="player.owner.id === lobby.czar.owner.id" class="mr-1">
                        Czar
                    </v-chip>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <v-btn
                                v-if="
                                    player.owner.id !== $store.state.loggedIn &&
                                    $store.state.loggedIn === lobby.players[0].owner.id
                                "
                                icon
                                v-on="on"
                                @click="showKickDialog(player)"
                            >
                                <v-icon>gavel</v-icon>
                            </v-btn>
                        </template>
                        <span>Kick player</span>
                    </v-tooltip>
                </v-list-item-title>
            </v-list-item-content>
        </v-list-item>
    </div>
</template>

<script>
    export default {
        name: 'PlayerList',
        props: ['lobby'],
        data() {
            return {
                kickDialog: false,
                playerToKick: null,
                kickReason: '',
            };
        },
        methods: {
            showKickDialog(player) {
                this.playerToKick = player;
                this.kickReason = '';
                this.kickDialog = true;
            },
            kickPlayer() {
                this.kickDialog = false;
                const webSocket = this.$store.state.connection;

                const kickRequest = {
                    playerId: this.playerToKick.owner.id,
                    message: this.kickReason,
                };
                console.log('Sending', kickRequest);

                webSocket.sendRequest(kickRequest).then(response => {
                    console.log('Kick response message received', response);

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
        },
    };
</script>

<style scoped></style>
