<template>
    <v-dialog v-model="$store.state.createDialog" scrollable persistent max-width="700px">
        <v-form>
            <v-card :loading="$store.state.joinLoading">
                <v-card-title>
                    <span class="text-h5" v-if="lobby">
                        <v-icon>edit</v-icon>
                        Edit Lobby
                    </span>
                    <span class="text-h5" v-else>
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
                                    :disabled="$store.state.joinLoading || !!lobby"
                                    label="Name"
                                    v-model="creatingLobby.name"
                                    required
                                    dense
                                    outlined
                                    :counter="16"
                                ></v-text-field>
                                <v-slider
                                    :disabled="$store.state.joinLoading"
                                    v-model="creatingLobby.maxPlayers"
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
                                            {{ creatingLobby.maxPlayers }}
                                        </v-label>
                                    </template>
                                </v-slider>
                                <v-slider
                                    :disabled="$store.state.joinLoading"
                                    v-model="creatingLobby.maxPoints"
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
                                            {{ creatingLobby.maxPoints }}
                                        </v-label>
                                    </template>
                                </v-slider>
                                <v-slider
                                    :disabled="$store.state.joinLoading"
                                    v-model="creatingLobby.pickLimit"
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
                                            {{ creatingLobby.pickLimit }}
                                        </v-label>
                                    </template>
                                </v-slider>
                                <v-slider
                                    :disabled="$store.state.joinLoading"
                                    v-model="creatingLobby.maxRounds"
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
                                            {{ creatingLobby.maxRounds }}
                                        </v-label>
                                    </template>
                                </v-slider>
                                <v-slider
                                    :disabled="$store.state.joinLoading"
                                    v-model="creatingLobby.maxJokerRequests"
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
                                            {{ creatingLobby.maxJokerRequests }}
                                        </v-label>
                                    </template>
                                </v-slider>
                                <v-text-field
                                    :disabled="$store.state.joinLoading"
                                    v-model="creatingLobby.password"
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
                                    v-model="settingOfficialDeckIds"
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
                                    v-model="settingCustomDecks"
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
                        @click="editLobby"
                        v-if="lobby"
                    >
                        Edit
                    </v-btn>
                    <v-btn
                        color="success darken-1"
                        :disabled="$store.state.joinLoading"
                        text
                        @click="createLobby"
                        v-else
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
        // TODO: rename this to something more suitable
        name: 'CreateLobbyDialog',
        props: ['lobby'],
        data() {
            return {
                // TODO: for create: reset on open to defaults
                creatingLobby: {
                    name: '',
                    maxPoints: 10,
                    maxPlayers: 10,
                    pickLimit: 1,
                    maxRounds: 10,
                    maxJokerRequests: 2,
                    password: '',
                },
                settingCustomDecks: [],
                settingOfficialDeckIds: [],
                // autocomplete
                officialDecks: [],
                deckSearch: null,
                decksFound: [],
                decksLoading: false,
            };
        },
        // TODO: on dialog open instead of mounted?
        async mounted() {
            if (this.lobby) {
                Object.assign(this.creatingLobby, this.lobby);
                // Lobby object from server has pick limit in ms
                this.creatingLobby.pickLimit /= 1000 * 60;
            }

            const decksUrl = `https://cds/deck/list/json/`;
            const response = await fetch(decksUrl);
            console.log('(Create/Edit Lobby) official decks response', response);
            const decks = await response.json();
            if (decks) {
                const officialDecks = decks.decks
                    .filter(x => x.official)
                    .sort((x1, x2) => x1.id - x2.id);
                console.log('(Create/Edit Lobby) officialDecks found', officialDecks);
                this.officialDecks = officialDecks;

                if (this.creatingLobby.decks) {
                    this.creatingLobby.decks.forEach(x => {
                        const offDeck = officialDecks.find(offDeck => offDeck.id === x.id);
                        if (offDeck) {
                            console.log(
                                '(Create/Edit Lobby) editing lobby deck official deck found',
                                offDeck
                            );
                            this.settingOfficialDeckIds.push(offDeck.id);
                        } else {
                            console.log(
                                '(Create/Edit Lobby) editing lobby deck not official adding to custom',
                                x
                            );
                            this.decksFound.push(x);
                            this.settingCustomDecks.push(x);
                        }
                    });
                }
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

                const decksUrl = `https://cds/deck/list/json/`;
                const response = await fetch(decksUrl);
                console.log('(Create/Edit Lobby) deck search response', response);
                const decks = await response.json();
                //TODO: debounce
                if (decks) {
                    // TODO: card deck server should implement a search
                    const decksFound = decks.decks.filter(
                        x => !x.official && x.name.toLowerCase().includes(val.toLowerCase())
                    );
                    console.log('(Create/Edit Lobby) custom deck search found', {
                        decksFound,
                        val,
                        decks,
                    });
                    this.decksFound = decksFound;
                    this.decksLoading = false;
                }
            },
        },
        methods: {
            // TODO: createLobby / editLobby in one method
            createLobby() {
                this.$store.state.joinLoading = true;
                const webSocket = this.$store.state.connection;

                const sendDeckIds = this.settingCustomDecks
                    .map(x => x.id)
                    .concat(this.settingOfficialDeckIds);

                console.log('(Create/Edit Lobby) selected decks:', {
                    officialDeckIds: this.settingOfficialDeckIds,
                    customDecks: this.settingCustomDecks,
                    sendDeckIds,
                });

                const lobbyCreateRequest = {
                    name: this.creatingLobby.name,
                    password: this.creatingLobby.password,

                    pickLimit: this.creatingLobby.pickLimit,
                    maxPlayers: this.creatingLobby.maxPlayers,
                    maxRounds: this.creatingLobby.maxRounds,
                    maxPoints: this.creatingLobby.maxPoints,
                    maxJokerRequests: this.creatingLobby.maxJokerRequests,

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
            editLobby() {
                this.$store.state.joinLoading = true;
                const webSocket = this.$store.state.connection;

                const sendDeckIds = this.settingCustomDecks
                    .map(x => x.id)
                    .concat(this.settingOfficialDeckIds);
                console.log('sendDeckIds', sendDeckIds);

                const lobbyEditRequest = {
                    password: this.creatingLobby.password,

                    pickLimit: this.creatingLobby.pickLimit,
                    maxPlayers: this.creatingLobby.maxPlayers,
                    maxRounds: this.creatingLobby.maxRounds,
                    maxPoints: this.creatingLobby.maxPoints,
                    maxJokerRequests: this.creatingLobby.maxJokerRequests,

                    decks: sendDeckIds.map(x => `${x}`),
                };
                console.log('Sending', lobbyEditRequest);
                webSocket.sendRequest(lobbyEditRequest).then(response => {
                    this.$store.state.joinLoading = false;
                    console.log('Edit lobby response message received', response);

                    if (response.success) {
                        this.$store.state.createDialog = false;
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
