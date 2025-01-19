<template>
<div v-if="user && user.permissions && user.permissions.access_finance" class="mainContent">
  <div class="balances">
    <div class="balanceWrapper">
      <Balance label="Balance (USD)" :value="parseFloat(balance)"/>
      <div class="snapshots">
        <Snapshot v-for="snapshot in snapshots" :key="snapshot.index" :snapshot="snapshot" :snapshots="snapshots" value="balance"/>
      </div>
    </div>
    <div class="balanceWrapper">
      <Balance label="On-sale (USD)" :value="parseFloat(onsale)"/>
      <div class="snapshots">
        <Snapshot v-for="snapshot in snapshots" :key="snapshot.index" :snapshot="snapshot" :snapshots="snapshots" value="onsale"/>
      </div>
    </div>
    <div class="balanceWrapper">
      <Balance label="Inventory (SUSD)" :value="parseFloat(inventory)"/>
      <div class="snapshots">
        <Snapshot v-for="snapshot in snapshots" :key="snapshot.index" :snapshot="snapshot" :snapshots="snapshots" value="inventory"/>
      </div>
    </div>
  </div>
  <div class="cashouts">
    <Cashout v-for="cashout in cashouts" :key="cashout.index" :cashout="cashout"/>
  </div>
</div>
<div class="noPermission" v-else>You do not have permissions!</div>
</template>

<script>
import {useToast} from "vue-toastification";
import Balance from "@/components/Finance/Balance"
import Snapshot from "@/components/Finance/Snapshot"
import Cashout from "@/components/Finance/Cashout"
const _ = require('lodash')

export default {
  name: "Finance",
  components: {
    Balance, Snapshot, Cashout
  },
  props: {
    user: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      cashouts: [],
      snapshots: [],
      balance: String,
      onsale: String,
      inventory: String,
    }
  },
  setup() {
    const toast = useToast();
    return {toast}
  },
  async mounted() {
    if(this.user && this.user.permissions && this.user.permissions.access_finance) {
      const requests = ['cashouts', 'balance', 'onsale', 'inventory', 'snapshots']
      _.forEach(requests, async (request) => {
        await this.loadData(request);
      })
    }
  },
  methods: {
    async loadData(request) {
      const res = await fetch((process.env.VUE_APP_MODE === 'production' ? process.env.VUE_APP_API_URL : process.env.VUE_APP_API_URL_DEV) + "/finance/" + request, {
        credentials: 'include',
      })
      try {
        let response = await res.json()
        if(response.success) {
          this[request] = response.data;
        } else {
          this.toast.error(response.message);
        }
      } catch (e) {
        console.log(e)
      }
    },
  }
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

.balances {
  display: flex;
  justify-content: space-between;
  margin-bottom: 3vh;
}
.balanceWrapper {
  width: 30%;
}

.snapshots {
  display: flex;
  flex-direction: column;
  overflow: auto;
  max-height: 50vh;
  margin-top: 0.5em;
}

.cashouts {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: auto;
  grid-gap: 1em;
}

.noPermission {
  position: relative;
  top: 50%;
  color: #c82721;
  justify-content: center;
  align-items: center;
}
</style>