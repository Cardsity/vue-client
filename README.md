# Cardsity Vue Client
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
- Joker Cards
- <https://vuetifyjs.com/en/components/expansion-panels/> for game manual?
- <https://vuetifyjs.com/en/components/chip-groups/> for official decks?
