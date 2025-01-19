<template>
  <div class="otherControls">
    <Button v-if="!synchronizeChat" class="chatSynchronization" icon="fas fa-sync-alt" label="Enable synchronization"
            text-color="rgba(51, 142, 255, 1)" background-color="rgba(51, 142, 255, .07)" @click="handleSynchronization" />
    <Button v-else class="chatSynchronization" icon="fas fa-sync-alt" label="Disable synchronization"
            text-color="rgba(200, 39, 33, 1)" background-color="rgba(200, 39, 33, .07)" @click="handleSynchronization" />
    <div class="chatControl">
      <div class="messages">
        <div v-for="message in messages" :key="messages.indexOf(message)" class="message">
          <img class="senderPhoto" :src="message.photo"  alt="Profile picture"/>
          <div class="messageMain">
            <span class="senderName">{{message.username + " "}}</span>
            <span class="messageText">{{message.message}}</span>
          </div>
        </div>
      </div>
      <div v-if="synchronizeChat" class="chatBottom">
        <select class="chatSelect" v-model="selectedBot">
          <option v-for="(bot, index) in bots" :key="index" :value="bot" class="botButton">
            {{bot.name}} - {{bot.steamID}}
          </option>
        </select>
        <div class="sendMessage">
          <input class="messageInput" type="text" v-model="messageInput" placeholder="Message Here" v-on:keyup.enter="sendMessage"/>
          <div class="sendButton" @click="sendMessage">
            <i class="fas fa-paper-plane"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {useToast} from "vue-toastification";
import Button from "@/components/Button";

export default {
  name: "OtherControls",
  components: {
    Button,
  },
  props: {
    bots: {
      type: Array,
    },
  },
  setup() {
    const toast = useToast();
    return {toast}
  },
  data() {
    return {
      selectedBot: null,
      messages: [],
      messageInput: "",
      synchronizeChat: false,
    }
  },
  created() {
    this.getStatus().then(async status => {
      this.synchronizeChat = status[1];
      if (this.synchronizeChat) {
        await this.updateChat();
        this.scrollToElement();
      }
    })

    this.sockets.subscribe('chatMessage', (message) => {
      if(this.synchronizeChat) {
        this.messages.splice(0, 1);
        this.messages.push(message);
        this.scrollToElement();
      }
    });

    this.sockets.subscribe('connectionError', () => {
      this.toast.warning("Socket couldn't connect! \nReconnecting in 15 seconds...")
    });
  },
  methods: {
    async handleSynchronization() {
      this.synchronizeChat = !this.synchronizeChat;
      if (this.synchronizeChat) {
        await this.updateChat();
        this.scrollToElement();
      }
    },
    async getStatus() {
      const res = await fetch((process.env.VUE_APP_MODE === 'production' ? process.env.VUE_APP_API_URL : process.env.VUE_APP_API_URL_DEV) + "/storage/status", {
        credentials: 'include',
      })
      let response = await res.json();
      return response.status;
    },
    async sendMessage() {
      if(this.selectedBot == null) {
        this.toast.warning("Warning: Please select a bot first!")
      } else if (this.messageInput === "") {
        this.toast.warning("Warning: Please input text!");
      } else {
        const res = await fetch((process.env.VUE_APP_MODE === 'production' ? process.env.VUE_APP_API_URL : process.env.VUE_APP_API_URL_DEV) + "/storage/sendMessage", {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            steamID: this.selectedBot.steamID,
            message: this.messageInput,
          })
        })

        let response = await res.json();
        if(!response.success) {
          this.toast.error(response.message);
        } else {
          this.messageInput = "";
        }
      }
    },
    async updateChat() {
      const res = await fetch((process.env.VUE_APP_MODE === 'production' ? process.env.VUE_APP_API_URL : process.env.VUE_APP_API_URL_DEV) + "/storage/chat", {
        credentials: 'include',
      })
      let response = await res.json();
      if (!response.success) {
        this.synchronizeChat = false;
        this.toast.error(response.message);
      } else {
        this.messages = response.chatHistory;
      }
    },
    scrollToElement() {
      let messages = this.$el.getElementsByClassName('message');
      const el = messages.item(49);
      if (el) el.scrollIntoView({behavior: 'smooth'});
    }
  }
}
</script>

<style scoped>
.otherControls {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 20%;
  height: 100%;
}

.chatControl {
  background: #1E242B;
  border-radius: 15px;
  width: 100%;
  height: 93%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.chatSynchronization {
  height: 6%;
}

.messages {
  display: flex;
  flex-direction: column;
  height: auto;
  width: 100%;
  overflow-y: scroll;
}

.message {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0.3em 0.5em;
}

.senderName {
  font-weight: bold;
}

.senderPhoto {
  border-radius: 100%;
  margin-right: 0.3em;
  align-self: flex-start;
  width: 1.5em;
  height: 1.5em;
}

.messageMain {
  text-align: left;
}

.messageText {
  word-wrap: break-word;
}

.chatSelect {
  background: #15171B;
  color: white;
  border: none;
  border-radius: 12px;
  height: 40%;
  width: 100%;
  padding: 0 0.5em;
  font-weight: bolder;
}

.chatBottom {
  height: auto;
  min-height: 8em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 0.5em;
}
.sendMessage {
  display: flex;
  margin-top: 0.5em;
  background: #15171B;
  border-radius: 12px;
  height: 40%;
  width: 100%;
}

.messageInput {
  background: #15171B;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 0 0.5em;
  height: 100%;
  width: 86%;
}

.sendButton {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 14%;
  color: #313a43;
  cursor: pointer;
}

</style>