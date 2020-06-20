<template>
    <v-dialog v-model="$store.state.shareDialog" width="400">
        <v-card>
            <v-card-title>
                <span class="title font-weight-bold">Share</span>
                <v-spacer></v-spacer>
                <v-btn class="mx-0" icon @click="$store.state.shareDialog = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text>
                <v-text-field
                    label="GitHub"
                    readonly
                    prepend-icon="mdi-github"
                    value="https://github.com/Cardsity"
                ></v-text-field>
                <v-text-field
                    label="Twitter"
                    readonly
                    prepend-icon="mdi-twitter"
                    value="https://twitter.com/CardsityApp"
                ></v-text-field>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        name: 'ShareDialog',
    };
</script>

<style scoped></style>
