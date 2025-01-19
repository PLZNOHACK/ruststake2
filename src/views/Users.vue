<template>
<div class='grid'>

  <!--  User  -->
  <div class='column'>
    <div class='title'>User profile</div>
    <div class='block'>
      <Search @search='loadUser' :query="$route.params.steamID ? $route.params.steamID .toString() : ''" />
    </div>
    <div v-if="user" class='userProfile'>
      <div class='split'>
        <div class='block'>
          <UserInfo :user='user' @updateUser='updateUser' />
        </div>
        <div class='block'>
          <UserStats :user='user' />
        </div>
      </div>
      <div class='block'>
        <a class='trade_url' target='_blank' :href='user.trade_url'>{{ user.trade_url }}</a>
      </div>
      <div class='block'>
        <div class='steamChecks'>
          <div class='check'>
            <label for='steam_level'>Steam Level:</label>
            <input type='checkbox' id='steam_level' v-model='steam_level' @change="updateUser('steam_info.steam_level', !steam_level ? 0 : 10)" />
            <span class='level' v-if='user.steam_info?.steam_level'>({{ user.steam_info.steam_level }})</span>
          </div>
          <div class='check'>
            <label for='own_rust'>Owns Rust:</label>
            <input type='checkbox' id='own_rust' v-model='own_rust' @change="updateUser('steam_info.own_rust', own_rust)" />
          </div>
          <Button @click='refetchSteamChecks' class='re-fetch' label="Reload" background-color="rgba(51, 142, 255, 1)" />
        </div>
      </div>
      <div class='split'>
        <div class='block'>
          <UserBetStats :user='user' @updateUser='updateUser' />
        </div>
        <div class='block'>
          <UserPromotion :user='user' />
        </div>
      </div>
      <div class='split'>
        <div class='block'>
          <AffiliateInfo :user='user' />
        </div>
        <div class='block'>
          <Punishments :user='user' @updateUser='updateUser' @reloadUser='loadUser' />
        </div>
      </div>
    </div>
  </div>

  <!--  Backpack  -->
<!--  <div class='column'>-->
<!--    <div class='title'>Backpack</div>-->
<!--    <div class='block'>-->
<!--      <BackpackSettings @updateItems='updateItems' @removeItems='removeItems' />-->
<!--    </div>-->
<!--    <div class='items'>-->
<!--      <BackpackItem v-for='item in backpack' :key="item['uuid']" :item='item' @selectItem='item.selected = !item.selected' @updateItems='updateItems' />-->
<!--    </div>-->
<!--  </div>-->

  <!--  Offers  -->
  <div class='column'>
    <div class='title'>Offers</div>
    <div class='block'>
      <OffersMenu @updateOffers='updateOffers' :user='user' :offers='offers' :offerCount='offerCount' ref='offers' />
    </div>
    <div class='block'>
      <Offers :offers='offers' :offer-count='offerCount' :offers-type='offersType' :selected-offer='selectedOffer' @selectOffer='selectOffer' />
    </div>
    <div v-if='selectedOffer' class='block'>
      <Offer :offers-type='offersType' :selected-offer='selectedOffer' @updateSelectedOffer='updateSelectedOffer' />
    </div>
  </div>
</div>
</template>

<script>

import Search from '@/components/Users/User/Search'
import UserInfo from '@/components/Users/User/UserInfo'
import UserStats from '@/components/Users/User/UserStats'
import AffiliateInfo from '@/components/Users/User/AffiliateInfo'
import Punishments from '@/components/Users/User/Punishments'
import { useToast } from 'vue-toastification'
import UserBetStats from '@/components/Users/User/UserBetStats'
import UserPromotion from '@/components/Users/User/UserPromotion'
// import BackpackItem from '@/components/Users/Backpack/Item'
// import BackpackSettings from '@/components/Users/Backpack/Settings'
import _ from 'lodash'
import OffersMenu from '@/components/Users/Offers/OffersMenu'
import Offers from '@/components/Users/Offers/Offers'
import Offer from '@/components/Users/Offers/Offer'
import Button from '@/components/Button'

export default {
  name: 'Users',
  components: {
    Button,
    Offer,
    Offers,
    OffersMenu,
    // BackpackSettings,
    // BackpackItem,
    UserPromotion,
    UserBetStats,
    Punishments,
    AffiliateInfo,
    UserStats,
    UserInfo,
    Search
  },

  data() {
    return {
      user: undefined,
      steam_level: { type: Boolean, default: false },
      own_rust: { type: Boolean, default: false },
      backpack: [],
      offers: [],
      offerCount: 0,
      offersType: 'steam',
      selectedOffer: undefined,
    }
  },

  setup() {
    const toast = useToast();
    return {toast}
  },

  methods: {
    async loadUser(steamID) {
      this.user = undefined
      this.backpack = []
      this.offers = []
      this.selectedOffer = undefined
      const res = await fetch((process.env.VUE_APP_MODE === 'production' ? process.env.VUE_APP_API_URL : process.env.VUE_APP_API_URL_DEV) + "/user/" + steamID, {
        credentials: 'include',
      })
      let response = await res.json();
      if (!response.success) {
        this.toast.error(response.message);
      } else {
        this.user = response.data

        if (this.user.steam_info && this.user.steam_info.steam_level && this.user.steam_info.steam_level >= 5) {
          this.steam_level = true
        }

        if (this.user.steam_info && this.user.steam_info.own_rust) {
          this.own_rust = true
        }
        await this.$router.push({ path: '/users/' + this.user.steamID })
      }
    },

    async updateUser(row, value) {
      const res = await fetch((process.env.VUE_APP_MODE === 'production' ? process.env.VUE_APP_API_URL : process.env.VUE_APP_API_URL_DEV) + "/user/update", {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({steamID: this.user.steamID, row, value})
      })
      let response = await res.json();
      if (!response.success) {
        this.toast.error(response.message);
      } else {
        if(response.data.updated) {
          this.user = response.data.user
          this.toast.success('Success: User updated!')
        }
      }
    },

    async refetchSteamChecks() {
      const res = await fetch((process.env.VUE_APP_MODE === 'production' ? process.env.VUE_APP_API_URL : process.env.VUE_APP_API_URL_DEV) + `/user/steamCheck/${this.user.steamID}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      })

      let response = await res.json();

      if (!response.success) {
        this.toast.error(response.message);

      } else {
        console.log(response)

        this.steam_level = response.data.steam_level >= 5
        this.own_rust = response.data.own_rust

        this.toast.success('Success: Steam checks re-fetched!')
      }
    },

    async loadBackpack() {
      const res = await fetch((process.env.VUE_APP_MODE === 'production' ? process.env.VUE_APP_API_URL : process.env.VUE_APP_API_URL_DEV) + "/user/backpack/" + this.user.steamID, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      })
      let response = await res.json();
      if (!response.success) {
        this.toast.error(response.message);
      } else {
        if(response.data) {
          this.backpack = _.sortBy(response.data, (item) => {return -item.price})
        }
      }
    },

    async reloadOffers() {
      await this.$refs.offers.loadOffers()
    },

    updateSelectedOffer(offer) {
      this.selectedOffer = offer
      let i = _.findIndex(this.offers, { _id: offer._id })
      this.offers[i] = offer
    },

    updateOffers(object) {
      this.offers = object.data.data
      this.offerCount = object.data.totalCount
      this.offersType = object.type
      this.selectedOffer = undefined
    },

    selectOffer(offer) {
      this.selectedOffer = offer
    },

    async updateItems(data) {
      let row = data.row
      let value = data.value === true ? 'true' : 'false'
      let items = data.items || _.filter(this.backpack, item => item.selected)
      items = _.map(items, item => item.uuid)

      if(_.isEmpty(items)) {
        this.toast.error('Error: No items selected!')
        return
      }

      const res = await fetch((process.env.VUE_APP_MODE === 'production' ? process.env.VUE_APP_API_URL : process.env.VUE_APP_API_URL_DEV) + "/user/updateItems", {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ steamID: this.user.steamID, row, value, uuids: items })
      })
      let response = await res.json();
      if (!response.success) {
        this.toast.error(response.message);
      } else {
        if (response.data.success) {
          this.backpack = _.map(this.backpack, item => {
            if (_.includes(response.data.uuids, item.uuid)) item[row] = data.value
            return item
          })
          this.toast.success('Success: Items updated!')
        }
      }
    },

    async removeItems() {
      let items = _.filter(this.backpack, item => item.selected)
      items = _.map(items, item => item.uuid)

      if(_.isEmpty(items)) {
        this.toast.error('Error: No items selected!')
        return
      }

      const res = await fetch((process.env.VUE_APP_MODE === 'production' ? process.env.VUE_APP_API_URL : process.env.VUE_APP_API_URL_DEV) + "/user/removeItems", {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ steamID: this.user.steamID, uuids: items })
      })
      let response = await res.json();
      if (!response.success) {
        this.toast.error(response.message);
      } else {
        if (response.data.success) {
          console.log(response.data)
          this.backpack = _.filter(this.backpack, item => !_.includes(response.data.uuids, item.uuid))
          this.toast.success('Success: Items removed!')
        }
      }
    },
  }
}
</script>

<style scoped>
.grid {
  position: relative;
  width: 90%;
  height: 94%;
  padding: 3vh 5%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-template-rows: auto;
  grid-gap: 1em;
  overflow-y: scroll;
}

.column {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

.userProfile {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

.title {
  font-weight: bold;
  font-size: 24px;
  padding: 25px 0;
}

.block {
  background: #1E242B;
  border-radius: 2em;
  padding: 1.5em;
}

.steamChecks {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 1em;
}

.check {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  gap: 0.5em;
}

.re-fetch {
  width: 20%;
  height: 2.5em;
}

.split {
  display: grid;
  grid-template-columns: 50% 50%;
  column-gap: 0.5em;
}

.trade_url {
  text-decoration: none;
  color: white;
}
</style>
