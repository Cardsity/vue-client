<template>
    <v-app>
        <v-app-bar app color="primary" dark>
            <v-app-bar-nav-icon>
                <v-avatar>
                    <v-img alt="Logo" src="./assets/logo.png" />
                </v-avatar>
            </v-app-bar-nav-icon>

            <v-toolbar-title> Cardsity</v-toolbar-title>

            <v-spacer></v-spacer>

            <!--TODO: Prompt when in game -->
            <v-btn icon @click="pressedNavigationButton" v-if="$route.name !== 'Login'">
                <v-icon v-if="$route.name === 'Lobby'">home</v-icon>
                <v-icon v-else-if="$route.name === 'Lobby List'">exit_to_app</v-icon>
                <v-icon v-else>arrow_back</v-icon>
            </v-btn>

            <v-menu left bottom>
                <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on">
                        <v-icon>more_vert</v-icon>
                    </v-btn>
                </template>

                <v-list>
                    <v-list-item @click="$store.state.aboutDialog = true">
                        <v-list-item-title>
                            <v-icon>info</v-icon>
                            About
                        </v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="$store.state.helpDialog = true">
                        <v-list-item-title>
                            <v-icon>help</v-icon>
                            Help
                        </v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-app-bar>

        <v-content>
            <LobbyLeaveDialog></LobbyLeaveDialog>
            <HelpDialog></HelpDialog>
            <AboutDialog></AboutDialog>
            <ConnectionClosedDialog></ConnectionClosedDialog>
            <ShareDialog></ShareDialog>
            <router-view />
        </v-content>

        <v-footer app>
            <span>
                A Cards Against Humanity clone by
                <a href="https://github.com/orgs/Cardsity/people" target="_blank">Cardsity Team</a>
            </span>
            <v-spacer></v-spacer>
            <v-btn icon>
                <v-icon>report_problem</v-icon>
            </v-btn>
            <v-btn icon @click="$store.state.shareDialog = true">
                <v-icon>share</v-icon>
            </v-btn>
            <v-btn icon @click="toggleDarkTheme">
                <v-icon v-if="$vuetify.theme.dark">toggle_on</v-icon>
                <v-icon v-else>toggle_off</v-icon>
            </v-btn>
        </v-footer>
    </v-app>
</template>

<script>
    import AboutDialog from './components/AboutDialog';
    import ConnectionClosedDialog from './components/ConnectionClosedDialog';
    import ShareDialog from './components/ShareDialog';
    import LobbyLeaveDialog from './components/LobbyLeaveDialog';
    import HelpDialog from './components/HelpDialog';

    export default {
        name: 'App',
        components: {
            HelpDialog,
            LobbyLeaveDialog,
            ShareDialog,
            ConnectionClosedDialog,
            AboutDialog,
        },
        created() {
            this.$store.dispatch('connect');
        },
        methods: {
            toggleDarkTheme() {
                const darkScheme = !this.$vuetify.theme.dark;
                this.$vuetify.theme.dark = darkScheme;
                localStorage.setItem('darkTheme', darkScheme ? 'dark' : 'light');
            },
            pressedNavigationButton() {
                if (this.$route.name === 'Lobby') {
                    this.$store.state.leaveLobbyDialog = true;
                } else if (this.$route.name === 'Lobby List') {
                    const webSocket = this.$store.state.connection;
                    const logoutRequest = {
                        confirmLogout: true,
                    };
                    console.log('Sending', logoutRequest);
                    webSocket.sendRequest(logoutRequest).then(response => {
                        console.log('Logout response message received', response);

                        if (response.success) {
                            this.$store.commit('setLoggedIn', null);
                            if (this.$route.path !== '/login') {
                                this.$router.push('/login');
                            }
                        } else {
                            console.error(response);
                            this.$toasted.show(response.message, {
                                icon: 'error',
                                duration: 1000,
                            });
                        }
                    });
                } else {
                    this.$router.go(-1);
                }
            },
        },
    };
</script>

<style lang="scss">
    .notification {
        font-family: Roboto, sans-serif;
    }
</style>
