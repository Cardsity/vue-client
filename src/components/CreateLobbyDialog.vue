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
                                    v-model="settingMaxPoints"
                                    label="Score limit"
                                    step="1"
                                    dense
                                    min="5"
                                    max="25"
                                    ticks="always"
                                    required
                                >
                                    <template v-slot:append>
                                        <v-label class="mt-0 pt-0">
                                            {{ settingMaxPoints }}
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
                                    max="20"
                                    ticks="always"
                                    required
                                >
                                    <template v-slot:append>
                                        <v-label class="mt-0 pt-0">
                                            {{ settingMaxRounds }}
                                        </v-label>
                                    </template>
                                </v-slider>
                                <v-slider
                                    :disabled="$store.state.joinLoading"
                                    v-model="settingMaxJokerRequests"
                                    label="Max joker requests"
                                    step="1"
                                    dense
                                    min="0"
                                    max="10"
                                    ticks="always"
                                    required
                                >
                                    <template v-slot:append>
                                        <v-label class="mt-0 pt-0">
                                            {{ settingMaxJokerRequests }}
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

                                <v-label>Official decks</v-label>
                                <v-chip-group
                                    multiple
                                    column
                                    active-class="primary--text"
                                    v-model="settingOfficialDecks"
                                >
                                    <v-chip
                                        v-for="deck in officialDecks"
                                        :key="deck.id"
                                        :disabled="$store.state.joinLoading"
                                        filter
                                        outlined
                                        ripple
                                        :value="deck.id"
                                    >
                                        {{ deck.name }}
                                    </v-chip>
                                </v-chip-group>

                                <v-autocomplete
                                    v-model="settingDeckIds"
                                    :items="decksFound"
                                    :loading="decksLoading"
                                    :search-input.sync="deckSearch"
                                    hide-no-data
                                    return-object
                                    outlined
                                    :disabled="$store.state.joinLoading"
                                    dense
                                    chips
                                    small-chips
                                    deletable-chips
                                    item-text="name"
                                    label="Custom decks"
                                    multiple
                                    required
                                ></v-autocomplete>
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
                settingMaxPoints: 10,
                settingMaxPlayers: 10,
                settingPickLimit: 1,
                settingMaxRounds: 10,
                settingMaxJokerRequests: 2,
                settingLobbyPassword: '',
                settingDeckIds: [],
                settingOfficialDecks: [],
                // autocomplete
                officialDecks: [],
                deckSearch: null,
                decksFound: [],
                decksLoading: false,
            };
        },
        async mounted() {
            const decksUrl = 'http://127.0.0.1:8020/deck/list/json/';
            const response = await fetch(decksUrl, {});
            console.log('(Create Lobby) official decks response', response);
            const decks = await response.json();
            if (decks) {
                const officialDecks = decks.decks
                    .filter(x => x.official)
                    .sort((x1, x2) => x1.id - x2.id);
                console.log('(Create Lobby) officialDecks found', officialDecks);
                this.officialDecks = officialDecks;
            }
            // TODO: show error when it failed
        },
        watch: {
            async deckSearch(val) {
                // You need to search at least 3 chars
                if (!val || val.length < 3) {
                    return;
                }
                // Items have already been requested
                if (this.decksLoading) {
                    return;
                }
                this.decksLoading = true;

                const decksUrl = 'http://127.0.0.1:8020/deck/list/json/';
                const response = await fetch(decksUrl, {});
                console.log('(Create Lobby) deck search response', response);
                const decks = await response.json();
                //TODO: debounce
                if (decks) {
                    // TODO: not official and card deck server should implement a search
                    const decksFound = decks.decks.filter(x =>
                        x.name.toLowerCase().includes(val.toLowerCase())
                    );
                    console.log({ decksFound, val, decks });
                    this.decksFound = decksFound;
                    this.decksLoading = false;
                }
            },
        },
        methods: {
            createLobby() {
                this.$store.state.joinLoading = true;
                const webSocket = this.$store.state.connection;

                console.log({ offDecks: this.settingOfficialDecks, otherDecks: this.settingDeckIds });

                const sendDeckIds = this.settingDeckIds.map(x => x.id).concat(this.settingOfficialDecks);
                console.log('sendDeckIds', sendDeckIds);

                const lobbyCreateRequest = {
                    name: this.settingName,
                    password: this.settingLobbyPassword,

                    pickLimit: this.settingPickLimit,
                    maxPlayers: this.settingMaxPlayers,
                    maxRounds: this.settingMaxRounds,
                    maxPoints: this.settingMaxPoints,
                    maxJokerRequests: this.settingMaxJokerRequests,

                    decks: sendDeckIds.map(x => `${x}`),
                };
                console.log('Sending', lobbyCreateRequest);
                webSocket.sendRequest(lobbyCreateRequest).then(response => {
                    this.$store.state.joinLoading = false;
                    console.log('Create lobby response message received', response);

                    if (response.success) {
                        const createdLobby = response;
                        this.$store.commit('setCurrentLobby', createdLobby);
                        this.$store.state.createDialog = false;
                        this.$router.push(`/lobby`);
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
