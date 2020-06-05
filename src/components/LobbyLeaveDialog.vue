<template>
    <v-dialog v-model="$store.state.leaveLobbyDialog" max-width="290">
        <v-card>
            <v-card-title class="headline">Leave lobby?</v-card-title>
            <v-card-text>
                Would you like to leave the lobby
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green" text @click="$store.state.leaveLobbyDialog = false">
                    No, stay
                </v-btn>
                <v-btn color="red" text @click="leaveLobby">
                    Yes, leave
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        name: 'LobbyLeaveDialog',
        methods: {
            leaveLobby() {
                this.$store.state.leaveLobbyDialog = false;

                const webSocket = this.$store.state.connection;
                const leaveLobbyRequest = {
                    confirmLeave: true,
                };
                console.log('Sending', leaveLobbyRequest);
                webSocket.sendRequest(leaveLobbyRequest).then(response => {
                    console.log('Leave lobby response message received', response);

                    if (response.success) {
                        this.$router.push('/');
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
