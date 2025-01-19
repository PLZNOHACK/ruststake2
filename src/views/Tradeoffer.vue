<template>
  <div class="content" v-if="user && user.permissions && user.permissions.send_partner && loaded">
    <div class="offerInfo">
      <div>{{offer.message}}</div>
      <div>Status: {{offer.state}}</div>
    </div>
    <div class="itemGrid">
      <div class="item" v-for="(item, index) in offer.itemsToGive" :key="index">
        <div class="itemInfo">
          <div>{{item.amount}}x</div>
          <div>${{item.price}}</div>
        </div>
        <img :src="item.url" alt="item"/>
        <div>{{item.name}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import {TYPE, useToast} from "vue-toastification";

export default {
  name: "Tradeoffer",
  props: {
    user: {
      type: Object,
      default: null,
    },
  },
  setup() {
    const toast = useToast();
    return {toast}
  },
  data() {
    return {
      loaded: {
        type: Boolean,
        default: false,
      },
      offer: {
        type: Object,
        default: null,
      }
    }
  },
  async mounted() {
    await this.getOffer()
  },
  methods: {
    async getOffer() {
      const res = await fetch((process.env.VUE_APP_MODE === 'production' ? process.env.VUE_APP_API_URL : process.env.VUE_APP_API_URL_DEV) + "/bots/tradeoffer?id=" + this.$route.query.id + "&bot=" + this.$route.query.bot, {
        credentials: 'include',
      })
      try {
        let response = await res.json()
        if (response.success) {
          this.offer = response.offer;
          this.loaded = true;
        }
        this.toast(response.message, {type: response.success ? TYPE.SUCCESS : TYPE.ERROR});
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style scoped>
.content {
  position: relative;
  top: 4%;
  padding: 3%;
  height: 80%;
}

.offerInfo {
  display: flex;
  height: 6%;
  border-radius: 15px;
  margin-bottom: 1%;
  background: #1E242B;
  align-items: center;
  padding: 0 15px 0 15px;
  justify-content: space-between;
}

.itemGrid {
  display: grid;
  padding-right: 0.5%;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(5, 1fr);
  gap: 2% 1%;
  grid-auto-rows: minmax(auto, auto);
  overflow: scroll;
  height: 100%;
}

.item {
  display: flex;
  border-radius: 15px;
  background: #1E242B;
  align-items: center;
  padding: 10%;
  flex-direction: column;
  justify-content: space-between;
}

.itemInfo {
  display: flex;
  width: 100%;
  justify-content: space-between;
}
</style>
