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

            <v-btn
                icon
                @click="pressedNavigationButton"
                v-if="$route.name !== 'Login'"
                aria-label="Navigation"
            >
                <v-icon v-if="$route.name === 'Lobby'">mdi-home</v-icon>
                <v-icon v-else-if="$route.name === 'Lobby List'">mdi-exit-to-app</v-icon>
                <v-icon v-else>mdi-arrow-left</v-icon>
            </v-btn>

            <v-menu transition="scale-transition" origin="top right" left bottom>
                <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on" aria-label="Menu">
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                </template>

                <v-list>
                    <v-list-item @click="$store.state.aboutDialog = true">
                        <v-list-item-title>
                            <v-icon>mdi-information</v-icon>
                            About
                        </v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="$store.state.helpDialog = true">
                        <v-list-item-title>
                            <v-icon>mdi-help-circle</v-icon>
                            Help
                        </v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-app-bar>

        <v-main>
            <LobbyLeaveDialog></LobbyLeaveDialog>
            <HelpDialog></HelpDialog>
            <AboutDialog></AboutDialog>
            <ConnectionClosedDialog></ConnectionClosedDialog>
            <ShareDialog></ShareDialog>
            <router-view />
            <v-snackbar v-model="$store.state.updateAvailable" :timeout="-1" bottom right>
                New version available!
                <template v-slot:action="{ attrs }">
                    <v-btn v-bind="attrs" dark text color="green" @click="refreshApp"> Refresh </v-btn>
                    <v-btn
                        icon
                        v-bind="attrs"
                        @click="$store.state.updateAvailable = false"
                        aria-label="Close notification"
                    >
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </template>
            </v-snackbar>
        </v-main>

        <v-footer app>
            <span>
                A Cards Against Humanity clone by
                <a
                    href="https://github.com/orgs/Cardsity/people"
                    rel="noopener noreferrer nofollow"
                    target="_blank"
                    >Cardsity Team</a
                >
            </span>
            <v-spacer></v-spacer>

            <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        icon
                        v-bind="attrs"
                        v-on="on"
                        href="https://github.com/Cardsity/issue-tracker/issues"
                        rel="noopener noreferrer nofollow"
                        aria-label="Report bugs"
                        target="_blank"
                    >
                        <v-icon>mdi-alert</v-icon>
                    </v-btn>
                </template>
                <span>Report bugs</span>
            </v-tooltip>
            <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        icon
                        v-bind="attrs"
                        v-on="on"
                        href="https://discord.gg/g9M2KQj"
                        rel="noopener noreferrer nofollow"
                        aria-label="Discord"
                        target="_blank"
                    >
                        <v-icon>mdi-discord</v-icon>
                    </v-btn>
                </template>
                <span>Join our Discord</span>
            </v-tooltip>

            <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        icon
                        v-bind="attrs"
                        v-on="on"
                        @click="$store.state.shareDialog = true"
                        aria-label="Share"
                    >
                        <v-icon>mdi-share-variant</v-icon>
                    </v-btn>
                </template>
                <span>Share</span>
            </v-tooltip>

            <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        icon
                        v-bind="attrs"
                        v-on="on"
                        @click="toggleDarkTheme"
                        aria-label="Toggle dark theme"
                    >
                        <v-icon v-if="$vuetify.theme.dark">mdi-toggle-switch</v-icon>
                        <v-icon v-else>mdi-toggle-switch-off</v-icon>
                    </v-btn>
                </template>
                <span>Toggle dark theme</span>
            </v-tooltip>
        </v-footer>
    </v-app>
</template>

<script>
    import AboutDialog from './components/AboutDialog';
    import ConnectionClosedDialog from './components/ConnectionClosedDialog';
    import ShareDialog from './components/ShareDialog';
    import LobbyLeaveDialog from './components/LobbyLeaveDialog';
    import HelpDialog from './components/HelpDialog';

    // TODO: add noopener to all external links
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
            refreshApp() {
                this.$store.state.updateAvailable = false;
                window.location.reload();
            },
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
                                icon: 'mdi-alert-circle',
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
    html,
    body {
        overscroll-behavior-y: contain;
    }
</style>
