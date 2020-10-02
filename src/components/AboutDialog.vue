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
                    <li v-for="license in licenses" :key="license.name">
                        {{ license.name }}
                        (
                        <a v-bind:href="license.link" target="_blank">
                            {{ license.link }}
                        </a>
                        )
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
    export default {
        // TODO: include a copy of the license
        name: 'AboutDialog',
        data() {
            return {
                licenses: JSON.parse(
                    '[{"department":"kessler","relatedTo":"stuff","name":"@trainiac/html2canvas","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"https://github.com/niklasvh/html2canvas","comment":"1.0.0"},{"department":"kessler","relatedTo":"stuff","name":"core-js","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"https://github.com/zloirock/core-js","comment":"3.6.5"},{"department":"kessler","relatedTo":"stuff","name":"register-service-worker","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"https://github.com/yyx990803/register-service-worker","comment":"1.7.1"},{"department":"kessler","relatedTo":"stuff","name":"vue","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"https://github.com/vuejs/vue","comment":"2.6.11"},{"department":"kessler","relatedTo":"stuff","name":"vue-router","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"https://github.com/vuejs/vue-router","comment":"3.3.4"},{"department":"kessler","relatedTo":"stuff","name":"vue-toasted","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"https://github.com/shakee93/vue-toasted","comment":"1.1.28"},{"department":"kessler","relatedTo":"stuff","name":"vuelidate","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"https://github.com/monterail/vuelidate","comment":"0.7.5"},{"department":"kessler","relatedTo":"stuff","name":"vuetify","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"https://github.com/vuetifyjs/vuetify","comment":"2.3.0"},{"department":"kessler","relatedTo":"stuff","name":"vuex","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"https://github.com/vuejs/vuex","comment":"3.4.0"},{"department":"kessler","relatedTo":"stuff","name":"websocket-as-promised","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"git://github.com/vitalets/websocket-as-promised","comment":"1.0.1"},{"department":"kessler","relatedTo":"stuff","name":"@vue/cli-plugin-babel","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"https://github.com/vuejs/vue-cli","comment":"4.4.4"},{"department":"kessler","relatedTo":"stuff","name":"@vue/cli-plugin-eslint","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"https://github.com/vuejs/vue-cli","comment":"4.4.4"},{"department":"kessler","relatedTo":"stuff","name":"@vue/cli-plugin-pwa","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"https://github.com/vuejs/vue-cli","comment":"4.4.4"},{"department":"kessler","relatedTo":"stuff","name":"@vue/cli-plugin-router","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"https://github.com/vuejs/vue-cli","comment":"4.4.4"},{"department":"kessler","relatedTo":"stuff","name":"@vue/cli-plugin-vuex","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"https://github.com/vuejs/vue-cli","comment":"4.4.4"},{"department":"kessler","relatedTo":"stuff","name":"@vue/cli-service","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"https://github.com/vuejs/vue-cli","comment":"4.4.4"},{"department":"kessler","relatedTo":"stuff","name":"@vue/eslint-config-prettier","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"https://github.com/vuejs/eslint-config-prettier","comment":"6.0.0"},{"department":"kessler","relatedTo":"stuff","name":"babel-eslint","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"https://github.com/babel/babel-eslint","comment":"10.1.0"},{"department":"kessler","relatedTo":"stuff","name":"eslint","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"https://github.com/eslint/eslint","comment":"6.8.0"},{"department":"kessler","relatedTo":"stuff","name":"eslint-plugin-prettier","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"https://github.com/prettier/eslint-plugin-prettier","comment":"3.1.4"},{"department":"kessler","relatedTo":"stuff","name":"eslint-plugin-vue","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"https://github.com/vuejs/eslint-plugin-vue","comment":"6.2.2"},{"department":"kessler","relatedTo":"stuff","name":"eslint-plugin-vuetify","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"https://github.com/vuetifyjs/eslint-plugin-vuetify","comment":"1.0.0-beta.6"},{"department":"kessler","relatedTo":"stuff","name":"material-design-icons-iconfont","licensePeriod":"perpetual","material":"material","licenseType":"Apache-2.0","link":"https://github.com/jossef/material-design-icons-iconfont","comment":"5.0.1"},{"department":"kessler","relatedTo":"stuff","name":"node-sass","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"https://github.com/sass/node-sass","comment":"4.14.1"},{"department":"kessler","relatedTo":"stuff","name":"prettier","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"https://github.com/prettier/prettier","comment":"2.0.5"},{"department":"kessler","relatedTo":"stuff","name":"sass","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"https://github.com/sass/dart-sass","comment":"1.26.8"},{"department":"kessler","relatedTo":"stuff","name":"sass-loader","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"https://github.com/webpack-contrib/sass-loader","comment":"8.0.2"},{"department":"kessler","relatedTo":"stuff","name":"vue-cli-plugin-vuetify","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"https://github.com/vuetifyjs/vue-cli-plugin-vuetify","comment":"2.0.5"},{"department":"kessler","relatedTo":"stuff","name":"vue-template-compiler","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"https://github.com/vuejs/vue","comment":"2.6.11"},{"department":"kessler","relatedTo":"stuff","name":"vuetify-loader","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"https://github.com/vuetifyjs/vuetify-loader","comment":"1.5.0"}]'
                ),
            };
        },
    };
</script>

<style scoped></style>
