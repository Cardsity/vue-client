import 'material-design-icons-iconfont/dist/material-design-icons.css'; // Ensure you are using css-loader
import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

if (!localStorage.getItem('darkTheme')) {
    const darkScheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    localStorage.setItem('darkTheme', darkScheme ? 'dark' : 'light');
}

export default new Vuetify({
    icons: {
        iconfont: 'md',
    },
    theme: {
        dark: localStorage.getItem('darkTheme') === 'dark', // TODO: detect from os
    },
});
