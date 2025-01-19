<template>
  <div v-if="user && user.permissions && user.permissions.access_pushing" class="mainContent">
    <Controls @reloadBots="loadBots" />
    <div class="workspace">
      <div class="bots">
        <Bot v-for="bot in bots" :key="bot.index" :bot="bot" @reloadBots="loadBots" :coinflips="coinflips" />
      </div>
      <OtherControls :bots="bots" />
    </div>
  </div>
  <div v-else class="center noPermission">You do not have permissions!</div>
</template>

<script>

import Controls from "@/components/Pushers/Controls";
import Bot from "@/components/Pushers/Bot";
import OtherControls from "@/components/Pushers/OtherControls";
import {useToast} from "vue-toastification";
import _ from "lodash";

require('dotenv').config()

export default {
  name: 'Autobet',
  components: {
    Controls, Bot, OtherControls
  },
  setup() {
    const toast = useToast();
    return {toast}
  },
  data() {
    return {
      bots: [],
      coinflips: [],
    }
  },
  props: {
    user: {
      type: Object,
      default: null,
    },
  },
  async mounted() {
    await this.loadBots();
    if(this?.user?.permissions?.access_pushing) {
      this.$socket.emit("subscribe", "autobet");
    }

    this.sockets.subscribe('coinflipUpdate', (coinflips) => {
      this.coinflips = _.merge(coinflips.bots, coinflips.users);
    });
    this.$socket.emit("coinflipUpdate");
  },
  async unmounted() {
    await this.loadBots();
    if(this?.user?.permissions?.access_pushing) {
      this.$socket.emit("unsubscribe", "autobet");
    }
  },
  methods: {
    async loadBots() {
      const res = await fetch((process.env.VUE_APP_MODE === 'production' ? process.env.VUE_APP_API_URL : process.env.VUE_APP_API_URL_DEV) + "/storage/", {
        credentials: 'include',
      })
      let response = await res.json();
      if (!response.success) {
        this.toast.error(response.message);
      } else {
        this.bots = response.bots;
      }
    }
  },
}
</script>

<style scoped>
.mainContent {
  position: relative;
  display: flex;
  width: 90%;
  height: 94%;
  padding: 3vh 5%;
  flex-direction: column;
}

.noPermission {
  color: #c82721;
  justify-content: center;
  align-items: center;
}

.center {
  top: 50%;
  position: relative;
}

.workspace {
  margin-top: 1.5em;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  height: inherit;
}

.bots {
  display: grid;
  grid-gap: 2em;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: max-content;
  width: 79%;
  height: 100%;
  overflow: scroll;
}
</style>
