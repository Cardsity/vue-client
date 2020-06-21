<template>
    <v-dialog v-model="$store.state.createDialog" scrollable persistent max-width="1000px">
        <v-form>
            <v-card :loading="$store.state.joinLoading">
                <v-card-title>
                    <span class="text-h5" v-if="lobby">
                        <v-icon>mdi-edit</v-icon>
                        Edit Lobby
                    </span>
                    <span class="text-h5" v-else>
                        <v-icon>mdi-plus-circle</v-icon>
                        Create Lobby
                    </span>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="$store.state.createDialog = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    <v-expansion-panels
                        v-model="settingsAccordionOpened"
                        class="elevation-8"
                        accordion
                        multiple
                        hover
                    >
                        <v-expansion-panel>
                            <v-expansion-panel-header>
                                General Settings
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-text-field
                                    :disabled="$store.state.joinLoading || !!lobby"
                                    label="Name"
                                    v-model="creatingLobby.name"
                                    required
                                    dense
                                    outlined
                                    append-icon="mdi-text-subject"
                                    :counter="16"
                                ></v-text-field>
                                <v-text-field
                                    :disabled="$store.state.joinLoading"
                                    v-model="creatingLobby.password"
                                    dense
                                    label="Password (optional)"
                                    type="password"
                                    outlined
                                    clearable
                                    append-icon="mdi-lock"
                                    :counter="16"
                                ></v-text-field>

                                <v-row>
                                    <v-col>
                                        <v-slider
                                            :disabled="$store.state.joinLoading"
                                            v-model="creatingLobby.maxPlayers"
                                            label="Max players"
                                            step="1"
                                            dense
                                            min="3"
                                            max="15"
                                            ticks="always"
                                            thumb-label="always"
                                            required
                                        >
                                        </v-slider>
                                    </v-col>
                                </v-row>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                        <v-expansion-panel>
                            <v-expansion-panel-header>
                                Deck Settings
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <span><v-icon>mdi-check-decagram</v-icon> Official decks</span>
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
                                    label="Search custom decks"
                                    append-icon="mdi-magnify"
                                    multiple
                                    required
                                ></v-autocomplete>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                        <v-expansion-panel>
                            <v-expansion-panel-header>
                                Game Settings
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-row>
                                    <v-col>
                                        <p>Score limit</p>
                                    </v-col>
                                    <v-col cols="10">
                                        <v-slider
                                            :disabled="$store.state.joinLoading"
                                            v-model="creatingLobby.maxPoints"
                                            step="1"
                                            dense
                                            min="5"
                                            max="25"
                                            ticks="always"
                                            thumb-label="always"
                                            required
                                        >
                                        </v-slider>
                                    </v-col>
                                </v-row>

                                <v-row>
                                    <v-col>
                                        <p>Card pick time limit (minutes)</p>
                                    </v-col>
                                    <v-col cols="10">
                                        <v-slider
                                            :disabled="$store.state.joinLoading"
                                            v-model="creatingLobby.pickLimit"
                                            step="0.5"
                                            dense
                                            min="0.5"
                                            max="5"
                                            ticks="always"
                                            thumb-label="always"
                                            required
                                        >
                                        </v-slider>
                                    </v-col>
                                </v-row>

                                <v-row>
                                    <v-col>
                                        <p>Rounds</p>
                                    </v-col>
                                    <v-col cols="10">
                                        <v-slider
                                            :disabled="$store.state.joinLoading"
                                            v-model="creatingLobby.maxRounds"
                                            step="1"
                                            dense
                                            min="5"
                                            max="20"
                                            ticks="always"
                                            thumb-label="always"
                                            required
                                        >
                                        </v-slider>
                                    </v-col>
                                </v-row>

                                <v-row>
                                    <v-col>
                                        <p>Max joker requests</p>
                                    </v-col>
                                    <v-col cols="10">
                                        <v-slider
                                            :disabled="$store.state.joinLoading"
                                            v-model="creatingLobby.maxJokerRequests"
                                            step="1"
                                            dense
                                            min="0"
                                            max="10"
                                            ticks="always"
                                            thumb-label="always"
                                            required
                                        >
                                        </v-slider>
                                    </v-col>
                                </v-row>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                        <v-expansion-panel>
                            <v-expansion-panel-header>
                                Special Settings
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-list two-line subheader flat>
                                    <v-list-item-group multiple active-class="">
                                        <v-list-item
                                            v-model="creatingLobby.winnerBecomesCzar"
                                            :disabled="$store.state.joinLoading"
                                        >
                                            <template v-slot:default="{ active }">
                                                <v-list-item-action>
                                                    <v-checkbox
                                                        :input-value="active"
                                                        :disabled="$store.state.joinLoading"
                                                        color="primary"
                                                    ></v-checkbox>
                                                </v-list-item-action>

                                                <v-list-item-content>
                                                    <v-list-item-title>Winner Czar</v-list-item-title>
                                                    <v-list-item-subtitle>
                                                        The round winner becomes the next czar
                                                    </v-list-item-subtitle>
                                                </v-list-item-content>
                                            </template>
                                        </v-list-item>
                                        <v-list-item
                                            v-model="creatingLobby.jokerCardsToDeck"
                                            :disabled="$store.state.joinLoading"
                                        >
                                            <template v-slot:default="{ active }">
                                                <v-list-item-action>
                                                    <v-checkbox
                                                        :input-value="active"
                                                        :disabled="$store.state.joinLoading"
                                                        color="primary"
                                                    ></v-checkbox>
                                                </v-list-item-action>

                                                <v-list-item-content>
                                                    <v-list-item-title>
                                                        Add joker cards to game
                                                    </v-list-item-title>
                                                    <v-list-item-subtitle>
                                                        Add requested joker cards to the deck of the
                                                        current game
                                                    </v-list-item-subtitle>
                                                </v-list-item-content>
                                            </template>
                                        </v-list-item>
                                    </v-list-item-group>
                                </v-list>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="success darken-1"
                        :disabled="$store.state.joinLoading"
                        text
                        outlined
                        @click="editLobby"
                        v-if="lobby"
                    >
                        Edit
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn
                        color="success darken-1"
                        :disabled="$store.state.joinLoading"
                        text
                        outlined
                        @click="createLobby"
                        v-else
                    >
                        Create
                        <v-icon>mdi-plus</v-icon>
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
                    password: '',
                    maxPoints: 10,
                    maxPlayers: 10,
                    pickLimit: 1,
                    maxRounds: 10,
                    maxJokerRequests: 2,
                    winnerBecomesCzar: false,
                    jokerCardsToDeck: false,
                },
                settingsAccordionOpened: [0, 1],
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

            try {
                // TODO: replace
                const decksUrl = `https://decks.cardsity.app/deck/list/json/`;
                const response = await fetch(decksUrl);
                console.log('(Create/Edit Lobby) official decks response', response);
                const decks = await response.json();
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
            } catch (e) {
                // TODO: show error when it failed
                console.error(e);
                this.$toasted.show(e, {
                    icon: 'mdi-alert-circle',
                    duration: 1000,
                });
            }
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

                // TODO: replace
                const decksUrl = `https://decks.cardsity.app/deck/list/json/`;
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

                    winnerBecomesCzar: this.creatingLobby.winnerBecomesCzar,
                    jokerCardsToDeck: this.creatingLobby.jokerCardsToDeck,
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
                            icon: 'mdi-alert-circle',
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

                    winnerBecomesCzar: this.creatingLobby.winnerBecomesCzar,
                    jokerCardsToDeck: this.creatingLobby.jokerCardsToDeck,
                };
                console.log('Sending', lobbyEditRequest);
                webSocket.sendRequest(lobbyEditRequest).then(response => {
                    this.$store.state.joinLoading = false;
                    console.log('Edit lobby response message received', response);

                    if (response.success) {
                        this.$store.state.createDialog = false;
                        this.$toasted.show(response.message, {
                            icon: 'mdi-information',
                            duration: 2500,
                        });
                    } else {
                        console.error(response);
                        this.$toasted.show(response.message, {
                            icon: 'mdi-alert-circle',
                            duration: 1000,
                        });
                    }
                });
            },
        },
    };
</script>

<style scoped></style>
