<template>
    <v-content class="text-center">
        <!--<md-empty-state
                v-icon="error"
                md-label="404!"
                class="md-accent"
                md-description="There is no page here"
            >
                <md-button class="md-primary md-raised" to="/">Go back</md-button>
            </md-empty-state>-->
        <img src="../assets/card-logo-404.png" alt="Logo" class="justify-center" />
        <p class="headline">There is no page here</p>
    </v-content>
</template>

<script>
    export default {
        name: 'NotFound',
    };
</script>

<style scoped></style>
