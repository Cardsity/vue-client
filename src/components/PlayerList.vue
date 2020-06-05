<template>
    <div>
        <v-subheader>Players ({{ `${lobby.players.length}/${lobby.maxPlayers}` }})</v-subheader>
        <v-list-item v-for="(player, i) in lobby.players" :key="i.name">
            <v-list-item-content>
                <v-list-item-title :style="`color: ${player.color};`">
                    <v-icon :color="player.color">account_circle</v-icon>
                    {{ player.name }}
                    <v-chip color="secondary" class="mr-1">{{ player.info.points }} Points</v-chip>
                    <v-chip color="primary" v-if="player.info.isCzar" class="mr-1">Czar</v-chip>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <v-btn
                                v-if="
                                    player.clientID !== $store.state.loggedIn &&
                                        $store.state.loggedIn === lobby.players[0].clientID
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
                    clientId: player.clientID,
                    reason: kickReason,
                };
                console.log('Sending', kickRequest);

                webSocket.sendRequest(kickRequest).then(response => {
                    console.log('Kick response message received', response);

                    if (response.success) {
                        // wurde fett gekickt
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
