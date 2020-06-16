<template>
    <div class="chat">
        <div class="chat-container">
            <div
                :class="`message ${item.sender.id === $store.state.loggedIn ? 'own' : ''}`"
                v-for="(item, i) in chatMessages"
                :key="i"
            >
                <div class="font-weight-bold" v-if="item.sender.id === $store.state.loggedIn">
                    {{ item.sender.name }}
                    <v-icon :color="item.sender.color">mdi-account-circle</v-icon>
                </div>
                <div class="font-weight-bold" v-else>
                    <v-icon :color="item.sender.color">mdi-account-circle</v-icon>
                    {{ item.sender.name }}
                </div>

                <div style="margin-top: 5px;"></div>

                <v-card
                    outlined
                    class="content"
                    :color="item.sender.color"
                    style="background-color: unset !important;"
                >
                    <div v-text="item.message"></div>
                </v-card>
            </div>
        </div>
        <v-form @submit.prevent="sendChat">
            <v-text-field
                filled
                single-line
                :counter="64"
                dense
                append-icon="mdi-send"
                v-model="chatMessage"
                :loading="loading"
                :disabled="loading"
                @click:append="sendChat"
                label="Send a message..."
                id="chat-input-field"
            ></v-text-field>
        </v-form>
    </div>
</template>

<script>
    export default {
        name: 'Chat',
        data() {
            return {
                loading: false,
                chatMessages: [], // TODO: cache chat messages in store
                chatMessage: '',
                messageListener: null,
            };
        },
        mounted() {
            const webSocket = this.$store.state.connection;

            webSocket.onUnpackedMessage.addListener(
                (this.messageListener = data => {
                    if (data.message && data.sender) {
                        this.chatMessages.push({
                            sender: data.sender,
                            message: data.message,
                        });
                        console.log({ chatMessages: this.chatMessages });

                        const chatBox = this.$el.querySelector('.chat-container');
                        const wasAtBottom =
                            data.sender.id === this.$store.state.loggedIn ||
                            chatBox.scrollHeight - chatBox.scrollTop === chatBox.clientHeight;
                        this.$nextTick(() => {
                            if (wasAtBottom) {
                                this.$vuetify.goTo(chatBox.lastElementChild, {
                                    duration: 500,
                                    container: chatBox,
                                });
                            }
                            this.$el.querySelector('#chat-input-field').focus();
                        });
                    }
                })
            );
        },
        destroyed() {
            if (this.messageListener) {
                const webSocket = this.$store.state.connection;
                webSocket.onUnpackedMessage.removeListener(this.messageListener);
            }
        },
        methods: {
            sendChat() {
                this.loading = true;
                const webSocket = this.$store.state.connection;

                const chatRequest = { message: this.chatMessage };
                console.log('Sending', chatRequest);

                webSocket.sendRequest(chatRequest).then(response => {
                    this.loading = false;
                    console.log('Chat response message received', response);

                    if (response.success) {
                        this.userSaved = true;
                        console.log('sent chat message', this.chatMessage);
                        this.chatMessage = '';
                    } else {
                        console.error(response);
                        this.$toasted.show(response.message, {
                            icon: 'mdi-alert-circle',
                            duration: 1000,
                        });
                    }
                });
            },
        },
    };
</script>

<style scoped lang="scss">
    .chat {
        margin: auto;
    }
    .chat-container {
        box-sizing: border-box;
        /*border: 1px solid black;*/
        height: 250px;
        overflow-y: auto;
        padding: 10px;
    }
    .chat-container {
        --scrollbarBG: transparent;
        --thumbBG: gray;
    }
    .chat-container::-webkit-scrollbar {
        width: 7px;
    }
    .chat-container::-webkit-scrollbar-track {
        background: var(--scrollbarBG);
    }
    .chat-container::-webkit-scrollbar-thumb {
        background-color: var(--thumbBG);
        border-radius: 6px;
        border: 3px solid var(--scrollbarBG);
    }
    .message {
        margin-bottom: 3px;
    }
    .message.own {
        text-align: right;
    }
    .chat-container .content {
        padding: 8px;
        border-radius: 5px;
        display: inline-block;
        max-width: 50%;
        word-wrap: break-word;
    }
    @media (max-width: 480px) {
        .chat-container .content {
            max-width: 60%;
        }
    }
</style>
