module.exports = {
    transpileDependencies: ['vuetify'],

    pwa: {
        name: 'Cardsity',
        workboxOptions: {
            skipWaiting: true,
        },
        // TODO: colors and icon
        themeColor: '#4dba87',
        msTileColor: '#000000',
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: 'black',
        iconPaths: {
            favicon32: 'img/icons/favicon-32x32.png',
            favicon16: 'img/icons/favicon-16x16.png',
            appleTouchIcon: 'img/icons/apple-touch-icon-152x152.png',
            maskIcon: 'img/icons/safari-pinned-tab.svg',
            msTileImage: 'img/icons/msapplication-icon-144x144.png',
        },
    },
};
