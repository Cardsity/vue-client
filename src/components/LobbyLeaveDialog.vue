<template>
    <v-dialog v-model="$store.state.leaveLobbyDialog" max-width="290">
        <v-card>
            <v-card-title class="text-h5">Leave lobby?</v-card-title>
            <v-card-text>
                Would you like to leave the lobby
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green" text @click="$store.state.leaveLobbyDialog = false">
                    No, stay
                </v-btn>
                <v-btn color="red" text @click="$store.dispatch('leaveLobby')">
                    Yes, leave
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        name: 'LobbyLeaveDialog',
    };
</script>

<style scoped></style>
