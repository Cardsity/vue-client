<template>
    <v-dialog v-model="$store.state.connectionClosed" persistent class="error" max-width="500">
        <v-card :loading="$store.state.reconnecting">
            <v-card-title>Connection closed!</v-card-title>
            <v-card-text>
                <p class="error--text">
                    We are sorry. This shouldn't have happened.
                </p>
                <p>
                    The connection to the server was closed. You can check if we have server problems
                    <a href="https://twitter.com/CardsityApp" target="_blank">here</a>
                </p>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn dark @click="reconnect" :disabled="$store.state.reconnecting">
                    Retry
                    <v-icon>refresh</v-icon>
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        name: 'ConnectionClosedDialog',
        methods: {
            reconnect() {
                this.$store.dispatch('reconnect');
            },
        },
    };
</script>

<style scoped></style>
