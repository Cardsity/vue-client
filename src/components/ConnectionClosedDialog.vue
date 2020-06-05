<template>
    <v-dialog v-model="connectionClosed" persistent class="error" max-width="500">
        <v-card :loading="reconnecting">
            <v-card-title>Connection closed!</v-card-title>
            <v-card-text>
                <p class="error--text">
                    We are sorry. This shouldn't have happened.
                </p>
                <p>
                    The connection to the server was closed. You can check if we have server problems
                    <a href="#" target="_blank">here</a>
                </p>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn dark @click="reconnect" :disabled="reconnecting">
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
        computed: {
            connectionClosed() {
                return this.$store.state.connectionClosed;
            },
            reconnecting() {
                return this.$store.state.reconnecting;
            },
        },
        methods: {
            reconnect() {
                this.$store.dispatch('reconnect');
            },
        },
    };
</script>

<style scoped></style>
