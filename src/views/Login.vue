<template>
    <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="4">
                <v-card class="mx-auto" max-width="500" outlined>
                    <v-toolbar color="primary" dark flat>
                        <v-toolbar-title><v-icon>account_circle</v-icon> Login</v-toolbar-title>
                    </v-toolbar>
                    <v-progress-linear
                        v-if="sending"
                        :background-opacity="0.3"
                        :indeterminate="true"
                    ></v-progress-linear>

                    <v-form v-model="valid" v-on:submit.prevent="login">
                        <v-container>
                            <v-text-field
                                label="Nickname"
                                v-model="nickname"
                                prepend-inner-icon="person"
                                hint="A name so other players can identify you"
                                :counter="16"
                                :disabled="sending"
                                :rules="nameRules"
                                elevation="15"
                                solo
                                required
                            ></v-text-field>
                            <v-color-picker
                                v-model="color"
                                aria-required="true"
                                hide-inputs
                                hide-canvas
                                class="ma-auto"
                                :swatches="swatches"
                                show-swatches
                            ></v-color-picker>
                        </v-container>

                        <v-divider></v-divider>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn text @click="login" :disabled="sending">
                                Login
                                <v-icon>send</v-icon>
                            </v-btn>
                        </v-card-actions>
                    </v-form>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    export default {
        name: 'Login',
        data: () => ({
            valid: false,
            nickname: '',
            nameRules: [
                v => !!v || 'A Nickname is required',
                v => v.length >= 3 || 'Nickname must be more than 3 characters',
                v => v.length <= 16 || 'Nickname must be less than 16 characters',
            ],
            swatches: [
                '#F44336',
                '#E91E63',
                '#9C27B0',
                '#673AB7',
                '#3F51B5',
                '#2196F3',
                '#03A9F4',
                '#00BCD4',
                '#009688',
                '#4CAF50',
                '#8BC34A',
                '#CDDC39',
                '#FFEB3B',
                '#FFC107',
                '#FF9800',
                '#FF5722',
                '#795548',
                '#607D8B',
                '#9E9E9E',
            ].map(x => [x]),
            color: '#F44336',
            userSaved: false,
            sending: false,
        }),
        mounted() {
            // dynamically select a random color
            this.color = this.swatches[Math.floor(Math.random() * this.swatches.length)][0];
        },
        methods: {
            login() {
                this.sending = true;
                const webSocket = this.$store.state.connection;

                const loginRequest = {
                    name: this.nickname,
                    color: this.color,
                };
                console.log('Sending', loginRequest);

                webSocket.sendRequest(loginRequest).then(response => {
                    this.sending = false;
                    console.log('Login response message received', response);

                    if (response.success) {
                        this.userSaved = true;

                        this.$toasted.show(response.message, {
                            icon: 'account_box',
                            duration: 5000,
                        });

                        this.$store.commit('setLoggedIn', response.you.id);
                        this.$router.push('/lobbyList');
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

<style lang="scss" scoped></style>
