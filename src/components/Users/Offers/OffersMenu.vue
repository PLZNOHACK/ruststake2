<template>
  <div class='menu'>
    <div class='pagination'>
      <div class='paginationWrapper'>
        <v-pagination
          v-model="page"
          :pages="Math.floor(offerCount / 10) + 1"
          :range-size="1"
          active-color="#15171B"
          @update:modelValue="loadOffers"
        />
      </div>
    </div>
    <div class='typeSelection'>
      <Button @click='selectOffers(`steam`)' class='btn' label='Deposits/Withdrawals' :background-color='selectedOffers === `steam` ? `rgba(51, 142, 255, 1)` : `#15171B`' />
      <Button @click='selectOffers(`transactions`)' class='btn' label='Transactions' :background-color='selectedOffers === `transactions` ? `rgba(51, 142, 255, 1)` : `#15171B`' />
      <Button @click='selectOffers(`games`)' class='btn' label='Games' :background-color='selectedOffers === `games` ? `rgba(51, 142, 255, 1)` : `#15171B`' />
      <Button @click='selectOffers(`balance`)' class='btn' label='Balance' :background-color='selectedOffers === `balance` ? `rgba(51, 142, 255, 1)` : `#15171B`' />
    </div>
    <div class='perPage'>
      <Button @click='changePerPage(10)' class='btn' label='10' :background-color='perPage === 10 ? `rgba(51, 142, 255, 1)` : `#15171B`' />
      <Button @click='changePerPage(25)' class='btn' label='25' :background-color='perPage === 25 ? `rgba(51, 142, 255, 1)` : `#15171B`' />
      <Button @click='changePerPage(50)' class='btn' label='50' :background-color='perPage === 50 ? `rgba(51, 142, 255, 1)` : `#15171B`' />
      <Button @click='changePerPage(100)' class='btn' label='100' :background-color='perPage === 100 ? `rgba(51, 142, 255, 1)` : `#15171B`' />
    </div>
  </div>
</template>

<script>

import Button from '@/components/Button'
import VPagination from "@hennge/vue3-pagination";
import _ from 'lodash'

export default {
  name: 'OffersMenu',
  components: { Button, VPagination },
  emits: ['updateOffers'],

  /* -------- PROPS -------- */
  props: {
    user: {
      type: Object,
      default: null,
    },

    offers: {
      type: Array,
      default: () => [],
    },

    offerCount: {
      type: Number,
      default: 0,
    },
  },

  /* -------- WATCH -------- */
  watch: {
    user: {
      async handler() {
          await this.loadOffers();
      },
      deep: true,
    },
  },

  /* -------- DATA -------- */
  data() {
    return {
      selectedOffers: 'steam',
      page: 1,
      perPage: 10
    }
  },

  /* -------- MOUNTED -------- */
  async mounted() {
    if (this.user) {
      await this.loadOffers();
    }
  },

  /* -------- METHODS -------- */
  methods: {
    async selectOffers(type) {
      this.selectedOffers = type
      this.page = 1
      await this.loadOffers()
    },

    async changePerPage(perPage) {
      this.perPage = perPage
      await this.loadOffers()
    },

    async loadOffers() {
      const res = await fetch((process.env.VUE_APP_MODE === 'production' ? process.env.VUE_APP_API_URL : process.env.VUE_APP_API_URL_DEV)
        + `/user/getOffers/${this.user.steamID}/${this.selectedOffers}/${this.page}/${this.perPage}`,
        {
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
        if (response.data) {
          if (_.isArray(response.data)) response.data = response.data[0]
          this.$emit('updateOffers', { type: this.selectedOffers, data: response.data })
        }
      }
    },
  }
}
</script>

<style scoped>
.menu {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.typeSelection {
  display: flex;
  column-gap: 0.5em;
  align-items: center;
  justify-content: center;
}

.perPage {
  display: flex;
  column-gap: 0.3em;
  align-items: center;
  justify-content: center;
}

.btn {
  height: 2em;
  padding: 0 0.5em;
}

.pagination {
  height: 8%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 100%;
  top: 200%;
}

.paginationWrapper {
  background-color: #1E242B;
  box-shadow: 0 2px 8px 3px black;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5em 0.5em;
}

</style>