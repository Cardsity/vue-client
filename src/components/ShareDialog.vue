<template>
    <v-dialog v-model="$store.state.shareDialog" width="400">
        <v-card>
            <v-card-title>
                <span class="title font-weight-bold">Share</span>
                <v-spacer></v-spacer>
                <v-btn class="mx-0" icon @click="$store.state.shareDialog = false">
                    <v-icon>mdi-close-circle</v-icon>
                </v-btn>
            </v-card-title>
            <v-text-field
                ref="link"
                label="Click to copy link"
                class="pa-4"
                readonly
                value="https://github.com/Cardsity"
                @click="copy"
            ></v-text-field>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        name: 'ShareDialog',
        methods: {
            copy() {
                const markup = this.$refs.link;
                markup.focus();
                document.execCommand('selectAll', false, null);
                document.execCommand('copy');
            },
        },
    };
</script>

<style scoped></style>
