<template>
    <v-container class="mx-auto mt-5">
        <v-col>
            <v-card elevation="5">
                <v-card-title>
                    <v-btn icon @click="loadLobbies" :disabled="lobbiesLoading">
                        <v-icon>mdi-refresh</v-icon>
                    </v-btn>
                    Currently available lobbies
                    <v-spacer></v-spacer>
                    <v-btn
                        color="primary"
                        outlined
                        class="mb-2"
                        @click="$store.state.createDialog = true"
                    >
                        <v-icon>mdi-plus</v-icon>
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
                    <template v-slot:item.password="{ item }">
                        <v-icon v-if="item.password" color="error">mdi-lock</v-icon>
                        <v-icon v-else color="success">mdi-lock-open</v-icon>
                    </template>

                    <template v-slot:item.join="{ item }">
                        <v-btn
                            color="secondary"
                            :disabled="item.playerCount >= item.maxPlayers"
                            fab
                            x-small
                            @click.stop="$store.dispatch('joinLobby', item)"
                        >
                            <v-icon>mdi-arrow-right</v-icon>
                        </v-btn>
                    </template>
                </v-data-table>
            </v-card>

            <CreateLobbyDialog></CreateLobbyDialog>
            <JoinPasswordProtectedLobbyDialog></JoinPasswordProtectedLobbyDialog>
        </v-col>
    </v-container>
</template>

<script>
    import CreateLobbyDialog from '../components/CreateLobbyDialog';
    import JoinPasswordProtectedLobbyDialog from '../components/JoinPasswordProtectedLobbyDialog';
    export default {
        name: 'LobbyList',
        components: { JoinPasswordProtectedLobbyDialog, CreateLobbyDialog },
        data() {
            return {
                // State
                lobbiesLoading: false,
                // Table
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
                        value: 'playerCount',
                        width: 15,
                    },
                    {
                        text: 'Max Players',
                        value: 'maxPlayers',
                        width: 15,
                    },
                    {
                        text: 'Password protected',
                        value: 'password',
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
                            icon: 'mdi-alert-circle',
                            duration: 1000,
                        });
                    }
                });
            },
        },
    };
</script>
