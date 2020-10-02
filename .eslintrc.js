module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        'plugin:vue/essential',
        'plugin:prettier/recommended',
        'eslint:recommended',
        '@vue/prettier',
    ],
    plugins: ['vuetify'],
    parserOptions: {
        parser: 'babel-eslint',
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        // TODO: Needed for Vuetify data tables slots. Remove once https://github.com/vuejs/eslint-plugin-vue/issues/1165 / https://github.com/vuejs/eslint-plugin-vue/issues/1229 is resolved
        'vue/valid-v-slot': 'off',
        'vuetify/no-deprecated-classes': 'error',
        'vuetify/grid-unknown-attributes': 'error',
        'vuetify/no-legacy-grid': 'error',
    },
};
