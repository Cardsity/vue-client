<template>
    <v-dialog scrollable v-model="$store.state.aboutDialog" max-width="850">
        <v-card>
            <v-card-title>
                <div class="text-h5">
                    <v-icon>info</v-icon>
                    <span>Cards Against Humanity</span>
                    <span class="text-caption">
                        Vue client, version 0.1
                    </span>
                </div>
                <v-spacer></v-spacer>
                <v-btn icon @click="$store.state.aboutDialog = false">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text>
                <p class="text-h5">Open source licenses</p>
                <ul class="grid-list-lg">
                    <li v-for="license in licenses" :key="license.name">
                        {{ license.name }} (<a v-bind:href="license.link" target="_blank"
                            >{{ license.link }} </a
                        >)
                    </li>
                </ul>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        name: 'AboutDialog',
        data() {
            return {
                licenses: JSON.parse(
                    '[{"department":"kessler","relatedTo":"stuff","name":"core-js","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"https://github.com/zloirock/core-js","comment":"3.6.5"},{"department":"kessler","relatedTo":"stuff","name":"vanilla-tilt","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"https://github.com/micku7zu/vanilla-tilt.js","comment":"1.7.0"},{"department":"kessler","relatedTo":"stuff","name":"vue","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"https://github.com/vuejs/vue","comment":"2.6.11"},{"department":"kessler","relatedTo":"stuff","name":"vue-router","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"https://github.com/vuejs/vue-router","comment":"3.3.1"},{"department":"kessler","relatedTo":"stuff","name":"vue-toasted","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"https://github.com/shakee93/vue-toasted","comment":"1.1.28"},{"department":"kessler","relatedTo":"stuff","name":"vuelidate","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"https://github.com/monterail/vuelidate","comment":"0.7.5"},{"department":"kessler","relatedTo":"stuff","name":"vuetify","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"https://github.com/vuetifyjs/vuetify","comment":"2.2.30"},{"department":"kessler","relatedTo":"stuff","name":"vuex","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"https://github.com/vuejs/vuex","comment":"3.4.0"},{"department":"kessler","relatedTo":"stuff","name":"websocket-as-promised","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"github.com/vitalets/websocket-as-promised","comment":"1.0.1"},{"department":"kessler","relatedTo":"stuff","name":"@vue/cli-plugin-babel","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"https://github.com/vuejs/vue-cli","comment":"4.3.1"},{"department":"kessler","relatedTo":"stuff","name":"@vue/cli-plugin-eslint","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"https://github.com/vuejs/vue-cli","comment":"4.3.1"},{"department":"kessler","relatedTo":"stuff","name":"@vue/cli-plugin-router","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"https://github.com/vuejs/vue-cli","comment":"4.3.1"},{"department":"kessler","relatedTo":"stuff","name":"@vue/cli-plugin-vuex","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"https://github.com/vuejs/vue-cli","comment":"4.3.1"},{"department":"kessler","relatedTo":"stuff","name":"@vue/cli-service","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"https://github.com/vuejs/vue-cli","comment":"4.3.1"},{"department":"kessler","relatedTo":"stuff","name":"@vue/eslint-config-prettier","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"https://github.com/vuejs/eslint-config-prettier","comment":"6.0.0"},{"department":"kessler","relatedTo":"stuff","name":"babel-eslint","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"https://github.com/babel/babel-eslint","comment":"10.1.0"},{"department":"kessler","relatedTo":"stuff","name":"eslint","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"https://github.com/eslint/eslint","comment":"6.8.0"},{"department":"kessler","relatedTo":"stuff","name":"eslint-plugin-prettier","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"https://github.com/prettier/eslint-plugin-prettier","comment":"3.1.3"},{"department":"kessler","relatedTo":"stuff","name":"eslint-plugin-vue","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"https://github.com/vuejs/eslint-plugin-vue","comment":"6.2.2"},{"department":"kessler","relatedTo":"stuff","name":"material-design-icons-iconfont","licensePeriod":"perpetual","material":"material","licenseType":"Apache-2.0","link":"https://github.com/jossef/material-design-icons-iconfont","comment":"5.0.1"},{"department":"kessler","relatedTo":"stuff","name":"node-sass","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"https://github.com/sass/node-sass","comment":"4.14.1"},{"department":"kessler","relatedTo":"stuff","name":"prettier","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"https://github.com/prettier/prettier","comment":"1.19.1"},{"department":"kessler","relatedTo":"stuff","name":"sass","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"https://github.com/sass/dart-sass","comment":"1.26.5"},{"department":"kessler","relatedTo":"stuff","name":"sass-loader","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"https://github.com/webpack-contrib/sass-loader","comment":"8.0.2"},{"department":"kessler","relatedTo":"stuff","name":"vue-cli-plugin-vuetify","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"https://github.com/vuetifyjs/vue-cli-plugin-vuetify","comment":"2.0.5"},{"department":"kessler","relatedTo":"stuff","name":"vue-template-compiler","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"https://github.com/vuejs/vue","comment":"2.6.11"},{"department":"kessler","relatedTo":"stuff","name":"vuetify-loader","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"https://github.com/vuetifyjs/vuetify-loader","comment":"1.4.4"}]'
                ),
            };
        },
    };
</script>

<style scoped></style>
