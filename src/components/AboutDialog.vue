<template>
    <v-dialog scrollable v-model="$store.state.aboutDialog" max-width="850">
        <v-card>
            <v-card-title>
                <div class="text-h5">
                    <v-icon>mdi-information</v-icon>
                    <span>Cardsity</span>
                    <br />
                    <span class="text-h6"> Vue client, version 0.1 </span>
                </div>
                <v-spacer></v-spacer>
                <v-btn icon @click="$store.state.aboutDialog = false" aria-label="Close">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text>
                <p class="text-h5">Open source licenses</p>
                <ul>
                    <li v-for="(license, key) in licenses" :key="key">
                        {{ key }}
                        (<a v-bind:href="license.licenseUrl" target="_blank"
                            >{{ license.licenses }} License</a
                        >)
                    </li>
                </ul>
                <p class="text-h5">Sounds</p>
                <ul>
                    <li>
                        "Ticking Clock, A.wav" by InspectorJ of
                        <a href="https://freesound.org/people/InspectorJ/sounds/343130/" target="_blank"
                            >Freesound.org
                        </a>
                    </li>
                    <li>
                        "playing_cards » draw-card.wav" by themfish of
                        <a href="https://freesound.org/people/themfish/sounds/45813/" target="_blank">
                            Freesound.org
                        </a>
                    </li>
                    <li>
                        "Good!" by syseQ of
                        <a href="https://freesound.org/people/syseQ/sounds/267528/" target="_blank">
                            Freesound.org
                        </a>
                    </li>
                    <li>
                        "game over" by Leszek_Szary of
                        <a
                            href="https://freesound.org/people/Leszek_Szary/sounds/133283/"
                            target="_blank"
                        >
                            Freesound.org
                        </a>
                    </li>
                    <li>
                        "level completed" by Leszek_Szary of
                        <a
                            href="https://freesound.org/people/Leszek_Szary/sounds/133284/"
                            target="_blank"
                        >
                            Freesound.org
                        </a>
                    </li>
                </ul>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
    import licensesJson from '../licenses.json';

    export default {
        name: 'AboutDialog',
        data() {
            return {
                licenses: licensesJson,
            };
        },
    };
</script>

<style scoped></style>
