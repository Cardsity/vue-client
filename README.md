# Cardsity Vue Client
[![Last Commit](https://img.shields.io/github/last-commit/Cardsity/vue-client?style=for-the-badge)](https://github.com/Cardsity/vue-client/commits)
[![Dependencies](https://img.shields.io/david/Cardsity/vue-client?style=for-the-badge)](https://github.com/Cardsity/vue-client/blob/master/package.json)
[![Docker Image](https://img.shields.io/github/workflow/status/Cardsity/vue-client/Docker%20Image%20CI?label=docker%20image&style=for-the-badge)](https://github.com/Cardsity/vue-client/actions?query=workflow%3A%22Docker+Image+CI%22)
[![Node.js Build](https://img.shields.io/github/workflow/status/Cardsity/vue-client/Node.js%20CI?label=Node.js%20build&style=for-the-badge)](https://github.com/Cardsity/vue-client/actions?query=workflow%3A%22Node.js+CI%22)
[![License](https://img.shields.io/github/license/Cardsity/vue-client?style=for-the-badge)](https://github.com/Cardsity/vue-client/blob/master/LICENSE)

This is a Web Client for the Cardsity Server written with [Vue.js](https://vuejs.org/) using the [Vuetify Component Framework](https://vuetifyjs.com)

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Build docker image
```
docker build -t cardsity-vue-client .
```

### Run docker image
```
docker run -it -p 8080:8080 --rm --name cardsity-vue-client cardsity-vue-client
```

### TODO
- Option to preview the black cards filled with the text of the selected white cards
- Write Tests
- Cards with long text
- Validate forms better
- Focus text fields in dialogs
- Remove console logs
- Avoid scrolling when a chat message gets added
- Save chat in store
- Emoji picker in chat
- Sounds
