<template>
    <v-dialog v-model="$store.state.createDialog" scrollable persistent max-width="700px">
        <v-form>
            <v-card :loading="$store.state.joinLoading">
                <v-card-title>
                    <span class="headline">
                        <v-icon>add_circle</v-icon>
                        Create Lobby
                    </span>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="$store.state.createDialog = false">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field
                                    :disabled="$store.state.joinLoading"
                                    label="Name"
                                    v-model="settingName"
                                    required
                                    dense
                                    outlined
                                    :counter="16"
                                ></v-text-field>
                                <v-slider
                                    :disabled="$store.state.joinLoading"
                                    v-model="settingMaxPlayers"
                                    label="Max players"
                                    step="1"
                                    dense
                                    min="3"
                                    max="15"
                                    ticks="always"
                                    required
                                >
                                    <template v-slot:append>
                                        <v-label class="mt-0 pt-0">
                                            {{ settingMaxPlayers }}
                                        </v-label>
                                    </template>
                                </v-slider>
                                <v-slider
                                    :disabled="$store.state.joinLoading"
                                    v-model="settingPointLimit"
                                    label="Score limit"
                                    step="1"
                                    dense
                                    min="5"
                                    max="20"
                                    ticks="always"
                                    required
                                >
                                    <template v-slot:append>
                                        <v-label class="mt-0 pt-0">
                                            {{ settingPointLimit }}
                                        </v-label>
                                    </template>
                                </v-slider>
                                <v-slider
                                    :disabled="$store.state.joinLoading"
                                    v-model="settingPickLimit"
                                    label="Card pick time limit (minutes)"
                                    step="0.5"
                                    dense
                                    min="0.5"
                                    max="5"
                                    ticks="always"
                                    required
                                >
                                    <template v-slot:append>
                                        <v-label class="mt-0 pt-0">
                                            {{ settingPickLimit }}
                                        </v-label>
                                    </template>
                                </v-slider>
                                <v-slider
                                    :disabled="$store.state.joinLoading"
                                    v-model="settingMaxRounds"
                                    label="Rounds"
                                    step="1"
                                    dense
                                    min="5"
                                    max="15"
                                    ticks="always"
                                    required
                                >
                                    <template v-slot:append>
                                        <v-label class="mt-0 pt-0">
                                            {{ settingMaxRounds }}
                                        </v-label>
                                    </template>
                                </v-slider>
                                <v-text-field
                                    :disabled="$store.state.joinLoading"
                                    v-model="settingLobbyPassword"
                                    dense
                                    label="Password (optional)"
                                    type="password"
                                    outlined
                                ></v-text-field>
                                <v-autocomplete
                                    :disabled="$store.state.joinLoading"
                                    v-model="settingDeckIds"
                                    outlined
                                    dense
                                    chips
                                    small-chips
                                    deletable-chips
                                    :items="availableCardSets"
                                    item-text="name"
                                    label="Card sets"
                                    multiple
                                    required
                                ></v-autocomplete>
                                <!--<v-slide-group multiple show-arrows>
                                    <v-slide-item
                                        v-for="set in availableCardSets"
                                        :key="set.name"
                                        v-slot:default="{ active, toggle }"
                                    >
                                        <v-btn
                                            class="mx-2"
                                            :input-value="active"
                                            active-class="purple white&#45;&#45;text"
                                            depressed
                                            rounded
                                            @click="toggle"
                                        >
                                            {{ set.name }}
                                        </v-btn>
                                    </v-slide-item>
                                </v-slide-group>-->
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="success darken-1"
                        :disabled="$store.state.joinLoading"
                        text
                        @click="createLobby"
                    >
                        Create
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
    </v-dialog>
</template>

<script>
    export default {
        name: 'CreateLobbyDialog',
        data() {
            return {
                // TODO: reset on open to defaults
                settingName: '',
                settingPointLimit: 10,
                settingMaxPlayers: 10,
                settingPickLimit: 3,
                settingMaxRounds: 10,
                settingLobbyPassword: '',
                settingDeckIds: [],
                availableCardSets: [
                    { id: 1, name: '1' },
                    { id: 11, name: '11' },
                    { id: 123, name: 'English card set' },
                    { id: 312, name: 'German card set' },
                ],
            };
        },
        methods: {
            createLobby() {
                this.$store.state.joinLoading = true;
                const webSocket = this.$store.state.connection;

                const lobbyCreateRequest = {
                    lobbyPassword: this.settingLobbyPassword,
                    pointLimit: this.settingPointLimit,
                    pickLimit: this.settingPickLimit,
                    maxRounds: this.settingMaxRounds,
                    maxPlayers: this.settingMaxPlayers,
                    name: this.settingName,
                    deckIds: this.settingDeckIds,
                };
                console.log('Sending', lobbyCreateRequest);
                webSocket.sendRequest(lobbyCreateRequest).then(response => {
                    this.$store.state.joinLoading = false;
                    console.log('Create lobby response message received', response);

                    if (response.success) {
                        const createdLobby = response;
                        this.$store.commit('setCurrentLobby', createdLobby);
                        this.$store.state.createDialog = false;
                        this.$router.push(`/lobby/${createdLobby.id}`);
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
