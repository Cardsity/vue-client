<template>
    <v-dialog v-model="$store.state.passwordDialog" persistent max-width="650">
        <v-card>
            <v-card-title class="text-h5">
                <span class="text-h5">
                    <v-icon color="red">mdi-lock-question</v-icon> This lobby is password protected!
                </span>
                <v-spacer></v-spacer>
                <v-btn icon @click="$store.state.passwordDialog = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>

            <v-card-text>
                <span class="text-subtitle-1">
                    Please enter the lobby password for
                    <strong class="primary--text text--lighten-1">
                        {{ $store.state.joinedLobby.name }}
                    </strong>
                </span>
                <v-container>
                    <v-text-field
                        label="Password"
                        required
                        type="password"
                        prepend-inner-icon="mdi-lock"
                        v-model="password"
                        :loading="$store.state.joinLoading"
                        :disabled="$store.state.joinLoading"
                        @keyup.native.enter="joinPasswordLobby"
                        clearable
                        solo
                    ></v-text-field>
                </v-container>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="primary darken-1"
                    text
                    outlined
                    :disabled="$store.state.joinLoading"
                    @click="joinPasswordLobby"
                >
                    Join
                    <v-icon>mdi-arrow-right</v-icon>
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        name: 'JoinPasswordProtectedLobbyDialog',
        data() {
            return {
                // TODO: reset on open to defaults
                password: '',
            };
        },
        methods: {
            joinPasswordLobby() {
                this.$store.state.joinLoading = true;
                this.$store.dispatch('moveToLobby', {
                    lobbyId: this.$store.state.joinedLobby.id,
                    password: this.password,
                });
            },
        },
    };
</script>

<style scoped></style>
