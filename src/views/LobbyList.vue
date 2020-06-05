<template>
    <v-container class="mx-auto mt-5">
        <v-col>
            <v-card elevation="5">
                <v-card-title>
                    <v-btn icon @click="loadLobbies" :disabled="lobbiesLoading">
                        <v-icon>refresh</v-icon>
                    </v-btn>
                    Currently available lobbies
                    <v-spacer></v-spacer>
                    <v-text-field
                        v-model="search"
                        prepend-inner-icon="search"
                        label="Search"
                        single-line
                        hide-details
                    ></v-text-field>
                    <v-btn color="primary" outlined class="mb-2" @click="showCreateLobby">
                        <v-icon>add</v-icon>
                        Create lobby
                    </v-btn>
                </v-card-title>

                <v-data-table
                    :headers="headers"
                    :items="lobbies"
                    :options.sync="tableOptions"
                    :server-items-length="totalLobbies"
                    :loading="lobbiesLoading"
                >
                    <template v-slot:item.passwordProtected="{ item }">
                        <v-icon v-if="item.passwordProtected" color="error">lock</v-icon>
                        <v-icon v-else color="success">lock_open</v-icon>
                    </template>

                    <template v-slot:item.join="{ item }">
                        <v-btn
                            color="secondary"
                            :disabled="item.currentPlayers >= item.maxPlayers"
                            fab
                            x-small
                            @click.stop="joinLobby(item)"
                        >
                            <v-icon>arrow_right_alt</v-icon>
                        </v-btn>
                    </template>
                </v-data-table>
            </v-card>

            <v-dialog v-model="createDialog" scrollable persistent max-width="700px">
                <v-form>
                    <v-card :loading="joinLoading">
                        <v-card-title>
                            <span class="headline">
                                <v-icon>add_circle</v-icon>
                                Create Lobby
                            </span>
                            <v-spacer></v-spacer>
                            <v-btn icon @click="createDialog = false">
                                <v-icon>close</v-icon>
                            </v-btn>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12">
                                        <v-text-field
                                            :disabled="joinLoading"
                                            label="Name"
                                            v-model="settingName"
                                            required
                                            dense
                                            outlined
                                            :counter="16"
                                        ></v-text-field>
                                        <v-slider
                                            :disabled="joinLoading"
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
                                                <v-text-field
                                                    :disabled="joinLoading"
                                                    dense
                                                    v-model="settingMaxPlayers"
                                                    class="mt-0 pt-0"
                                                    hide-details
                                                    single-line
                                                    type="number"
                                                    min="3"
                                                    max="15"
                                                    style="width: 60px"
                                                ></v-text-field>
                                            </template>
                                        </v-slider>
                                        <v-slider
                                            :disabled="joinLoading"
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
                                                <v-text-field
                                                    :disabled="joinLoading"
                                                    dense
                                                    v-model="settingPointLimit"
                                                    class="mt-0 pt-0"
                                                    hide-details
                                                    single-line
                                                    type="number"
                                                    min="2"
                                                    max="20"
                                                    style="width: 60px"
                                                ></v-text-field>
                                            </template>
                                        </v-slider>
                                        <v-slider
                                            :disabled="joinLoading"
                                            v-model="settingPickLimit"
                                            label="Card pick time limit (in minutes)"
                                            step="0.5"
                                            dense
                                            min="0.5"
                                            max="5"
                                            ticks="always"
                                            required
                                        >
                                            <template v-slot:append>
                                                <v-text-field
                                                    :disabled="joinLoading"
                                                    dense
                                                    v-model="settingPickLimit"
                                                    class="mt-0 pt-0"
                                                    hide-details
                                                    single-line
                                                    type="number"
                                                    step="0.5"
                                                    min="0.5"
                                                    max="5"
                                                    style="width: 60px"
                                                ></v-text-field>
                                            </template>
                                        </v-slider>
                                        <v-slider
                                            :disabled="joinLoading"
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
                                                <v-text-field
                                                    :disabled="joinLoading"
                                                    dense
                                                    v-model="settingMaxRounds"
                                                    class="mt-0 pt-0"
                                                    hide-details
                                                    single-line
                                                    type="number"
                                                    step="1"
                                                    min="5"
                                                    max="15"
                                                    style="width: 60px"
                                                ></v-text-field>
                                            </template>
                                        </v-slider>
                                        <v-text-field
                                            :disabled="joinLoading"
                                            v-model="settingLobbyPassword"
                                            dense
                                            label="Password (optional)"
                                            type="password"
                                            outlined
                                        ></v-text-field>
                                        <v-autocomplete
                                            :disabled="joinLoading"
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
                                :disabled="joinLoading"
                                text
                                @click="createLobby"
                            >
                                Create
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-form>
            </v-dialog>

            <v-dialog v-model="passwordDialog" persistent max-width="650">
                <v-card>
                    <v-card-title class="headline">
                        <span class="headline">
                            This lobby is password protected!
                        </span>
                        <v-spacer></v-spacer>
                        <v-btn icon @click="passwordDialog = false">
                            <v-icon>close</v-icon>
                        </v-btn>
                    </v-card-title>

                    <v-card-text>
                        <span class="subtitle-1">
                            Please enter the lobby password for
                            <strong class="primary--text text--lighten-1">{{ joinedLobby.name }}</strong>
                        </span>
                        <v-container>
                            <v-text-field
                                label="Password"
                                required
                                type="password"
                                prepend-inner-icon="lock"
                                v-model="password"
                                :loading="joinLoading"
                                :disabled="joinLoading"
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
                            :disabled="joinLoading"
                            @click="joinPasswordLobby"
                        >
                            Join
                            <v-icon>arrow_right</v-icon>
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-col>
    </v-container>
</template>

<script>
    export default {
        name: 'LobbyList',
        data() {
            return {
                // Dialogs
                createDialog: false,
                passwordDialog: false,
                // State
                joinLoading: false,
                lobbiesLoading: false,
                // Password dialog
                joinedLobby: '',
                password: '',
                // Create lobby dialog
                settingName: '',
                settingPointLimit: 10,
                settingMaxPlayers: 10,
                settingPickLimit: 3,
                settingMaxRounds: 10,
                settingLobbyPassword: '',
                settingDeckIds: [],
                availableCardSets: [
                    { id: 11, name: '11' },
                    { id: 123, name: 'English card set' },
                    { id: 312, name: 'German card set' },
                    { id: 212, name: 'Beleger card set' },
                    { id: 312, name: 'Hermine card set' },
                ],
                // Table
                search: '',
                //TODO: default sort by id
                tableOptions: {},
                totalLobbies: 0,
                lobbies: [],
                headers: [
                    {
                        text: '#',
                        align: 'start',
                        value: 'id',
                        width: 5,
                    },
                    {
                        text: 'Name',
                        value: 'name',
                        width: 250,
                    },
                    {
                        text: 'Creator',
                        value: 'hostName',
                        width: 100,
                    },
                    {
                        text: 'Current Players',
                        value: 'currentPlayers',
                        width: 15,
                    },
                    {
                        text: 'Max Players',
                        value: 'maxPlayers',
                        width: 15,
                    },
                    {
                        text: 'Password protected',
                        value: 'passwordProtected',
                        align: 'center',
                        width: 15,
                    },
                    {
                        text: 'Join',
                        value: 'join',
                        sortable: false,
                        width: 15,
                    },
                ],
            };
        },
        mounted() {
            this.loadLobbies();
        },
        watch: {
            tableOptions: {
                handler() {
                    this.loadLobbies();
                },
                deep: true,
            },
        },
        methods: {
            loadLobbies() {
                this.lobbiesLoading = true;
                const webSocket = this.$store.state.connection;

                console.log('tableOptions', this.tableOptions);
                const { sortBy, sortDesc, page, itemsPerPage } = this.tableOptions; //eslint-disable-line no-unused-vars

                const lobbyListRequest = {
                    pageSize: itemsPerPage,
                    pageNumber: page,
                };
                console.log('Sending', lobbyListRequest);
                webSocket.sendRequest(lobbyListRequest).then(response => {
                    this.lobbiesLoading = false;
                    console.log('Lobby list response message received', response);

                    if (response.success) {
                        this.lobbies = response.lobbies;
                        this.totalLobbies = response.totalRows;
                    } else {
                        console.error(response);
                        this.$toasted.show(response.message, {
                            icon: 'error',
                            duration: 1000,
                        });
                    }
                });
            },
            showCreateLobby() {
                this.settingMaxPlayers = 10;
                this.createDialog = true;
            },
            createLobby() {
                this.joinLoading = true;
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
                    this.joinLoading = false;
                    console.log('Create lobby response message received', response);

                    if (response.success) {
                        const createdLobby = response;
                        this.$store.commit('setCurrentLobby', createdLobby);
                        this.createDialog = false;
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

            joinLobby(item) {
                this.joinedLobby = item;

                if (item.passwordProtected) {
                    this.password = '';
                    this.passwordDialog = true;
                } else {
                    this.moveToLobby(item);
                }
            },
            joinPasswordLobby() {
                console.log('beleger', this.$refs.form);
                this.joinLoading = true;
                this.moveToLobby(this.joinedLobby);
            },
            moveToLobby(item) {
                const webSocket = this.$store.state.connection;

                const joinRequest = {
                    lobbyId: item.id,
                    password: this.password,
                };
                console.log('Sending', joinRequest);
                webSocket.sendRequest(joinRequest).then(response => {
                    this.joinLoading = false;
                    this.passwordDialog = false;
                    console.log('Join response message received', response);

                    if (response.success) {
                        console.log('successfully joined');
                        this.$store.commit('setCurrentLobby', response);
                        this.$router.push(`/lobby/${item.id}`);
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
