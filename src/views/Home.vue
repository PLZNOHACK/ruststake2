<template>
  <div v-if="user && user.permissions" class="mainContent">
    <div class="controlSection">
      <div class="subSection">
        <div class="subSectionTitle">Manage Bots</div>
        <div v-if="user.permissions.manage_bots" class="subSectionContent">
          <Bots @changeBot="changeBot" />
        </div>
        <div v-else class="subSectionContent noPermission">You do not have permissions!</div>
      </div>
      <div class="subSection">
        <div class="subSectionTitle">Manage Access</div>
        <div v-if="user.permissions.manage_access" class="subSectionContent">
          <UsersDropdown />
        </div>
        <div v-else class="subSectionContent noPermission">You do not have permissions!</div>
      </div>
      <div class="subSection">
        <div class="subSectionTitle">Custom offer</div>
        <div v-if="user.permissions.send_custom" class="subSectionContent">
          <CustomOffer @sendOffer="sendOffer" />
        </div>
        <div v-else class="subSectionContent noPermission">You do not have permissions!</div>
      </div>
    </div>
    <div class="partnersSection">
      <div class="partnersSectionTitle">
        <div class="partnersSectionTitleText">Partners</div>
        <Button v-if="user.permissions.manage_partners" class="partnerAddButton" label="Add Partner" @click="addPartnerButton"/>
      </div>
      <div v-if="user.permissions.send_partner && partnersLoaded" class="partnersSectionContent">
        <NewPartner v-if="addPartner" @addPartner="addPartnerFromData" />
        <Partner v-for="partner in partners" :key="partner.index" :partner="partner" @sendOffer="sendOffer" @removePartner="removePartner"/>
      </div>
    </div>
  </div>
</template>

<script>
import UsersDropdown from "@/components/Influencers/UsersDropdown";
require('dotenv').config()

import Bots from "@/components/Influencers/Bots";
import Partner from "@/components/Influencers/Partner";
import NewPartner from "@/components/Influencers/NewPartner";
import CustomOffer from "@/components/Influencers/CustomOffer";
import {TYPE, useToast} from "vue-toastification";
import Button from "@/components/Button";

export default {
  name: 'Home',
  components: {
    CustomOffer,
    UsersDropdown,
    NewPartner,
    Partner,
    Bots,
    Button
  },
  setup() {
    const toast = useToast();
    return {toast}
  },
  data() {
    return {
      partners: Array,
      partnersLoaded: Boolean,
      addPartner: false,
      selectedBot: null,
    }
  },
  props: {
    user: {
      type: Object,
      default: null,
    },
  },
  async mounted() {
    await this.getPartners();
  },
  methods: {
    changeBot(bot) {
      this.selectedBot = bot;
    },
    async sendOffer(data) {
      let partner = data.partner;
      if(!this.selectedBot) {
        this.toast.warning("Warning: Please choose a bot first!");
        return;
      }
      this.toast.info("Info: Proccessing offer...");
      const res = await fetch((process.env.VUE_APP_MODE === 'production' ? process.env.VUE_APP_API_URL : process.env.VUE_APP_API_URL_DEV) + "/bots/send", {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: partner.name,
          botname: this.selectedBot,
          tradeurl: partner.tradeurl,
          value: partner.amount,
        })
      })

      let response = await res.json();
      this.toast(response.message, {type: response.success ? TYPE.SUCCESS : TYPE.ERROR});
    },
    addPartnerButton() {
      this.addPartner = !this.addPartner;
    },
    async addPartnerFromData(data) {
      this.addPartner = false;
      const res = await fetch((process.env.VUE_APP_MODE === 'production' ? process.env.VUE_APP_API_URL : process.env.VUE_APP_API_URL_DEV) + "/partners/add", {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      let response = await res.json();
      await this.getPartners();
      this.toast(response.message, {type: response.success ? TYPE.SUCCESS : TYPE.ERROR});
    },
    async removePartner(id) {
      const res = await fetch((process.env.VUE_APP_MODE === 'production' ? process.env.VUE_APP_API_URL : process.env.VUE_APP_API_URL_DEV) + "/partners/remove", {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(id)
      })
      let response = await res.json();
      await this.getPartners();
      this.toast(response.message, {type: response.success ? TYPE.SUCCESS : TYPE.ERROR});
    },
    async getPartners() {
      const res = await fetch((process.env.VUE_APP_MODE === 'production' ? process.env.VUE_APP_API_URL : process.env.VUE_APP_API_URL_DEV) + "/partners", {
        credentials: 'include',
      })
      try {
        let response = await res.json()
        if(response.success === true) {
          this.partnersLoaded = true;
          this.partners = response.partners;
        } else {
          this.toast.error(response.message);
        }
      } catch (e) {
        console.log(e)
      }
    },
  },
}
</script>

<style scoped>
.mainContent {
  width: 90%;
  overflow-y: auto;
  height: 94%;
  padding: 3vh 5%;
}

.controlSection {
  display: flex;
  justify-content: space-between;
  height: 35%;
}

.subSection {
  display: flex;
  height: 100%;
  width: 31%;
  flex-direction: column;
}

.subSectionTitle {
  height: 12%;
  display: flex;
  font-size: 18px;
  margin-left: 7px;
  align-items: center;
}

.subSectionContent {
  display: flex;
  flex-direction: column;
  padding: 4%;
  height: 70%;
  border-radius: 15px;
  background: #1E242B;
}

.noPermission {
  color: #c82721;
  justify-content: center;
  align-items: center;
}

.partnersSection {
  margin-top: 1%;
  height: 60%;

}

.partnersSectionTitle {
  height: 8%;
  display: flex;
  margin: 0 0 0 7px;
  align-items: center;
  justify-content: space-between;
}

.partnersSectionTitleText {
  font-size: 18px;
}

.partnerAddButton {
  height: 70%;
  width: 12%;
}

.partnersSectionContent {
  height: 92%;
  width: 100%;
  overflow-y: auto;
}
</style>
