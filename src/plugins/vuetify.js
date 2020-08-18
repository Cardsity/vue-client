import '@mdi/font/css/materialdesignicons.css'; // Ensure you are using css-loader
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

if (!localStorage.getItem('darkTheme')) {
    const darkScheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    localStorage.setItem('darkTheme', darkScheme ? 'dark' : 'light');
}

export default new Vuetify({
    icons: {
        iconfont: 'mdi',
    },
    theme: {
        dark: localStorage.getItem('darkTheme') === 'dark',
    },
});
