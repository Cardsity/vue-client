<template>
    <div>
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
                                @click="kickPlayer(player)"
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
        methods: {
            kickPlayer(player) {
                const webSocket = this.$store.state.connection;

                const kickReason = prompt('Kick message?');
                // TODO: make this pretty

                const kickRequest = {
                    playerId: player.owner.id,
                    message: kickReason,
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
