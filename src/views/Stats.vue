<template>
  <div v-if="user && user.permissions && user.permissions.access_stats" class="stats">
    <div v-if='volume' class="volume">
      <div class="volumeChartAbove">
        <h3>Volume Data</h3>
      </div>
      <VolumeChart class="volumeChart" :data="volume" />
    </div>
    <div v-if='transactions' class="volume">
      <div class="volumeChartAbove">
        <h3>Profit Data</h3>
      </div>
      <ProfitChart class="volumeChart" :data="transactions" />
    </div>
    <div class="loader" v-else>
      <Loader />
    </div>
    <div v-if='jackpot && coinflip && upgrade && rewards && transactions' class="nonsponsored">
      <h3>Transaction statistics</h3>
      <div class="charts">
        <TransactionsChart class="statsChart" :data="transactions" />
        <!--        <CoinflipChart class="profitChart" :data="coinflip" />-->
        <!--        <UpgradeChart class="profitChart" :data="upgrade" />-->
      </div>

      <h3>Rustytime statistics</h3>
      <div class="charts">
        <RustytimeChart class="statsChart" :data="rustytime" />
        <RustytimeProfitChart class="statsChart" :data="rustytime" />
      </div>

      <h3>Jackpot statistics</h3>
      <div class="charts">
        <JackpotChart class="statsChart" :data="jackpot" />
        <JackpotProfitChart gamemode='Jackpot' class="statsChart" :data="jackpot" />
<!--        <CoinflipChart class="profitChart" :data="coinflip" />-->
<!--        <UpgradeChart class="profitChart" :data="upgrade" />-->
      </div>

      <h3>Coinflip statistics</h3>
      <div class="charts">
        <CoinflipChart class="statsChart" :data="coinflip" />
        <CoinflipProfitChart class="statsChart" :data="coinflip" />
        <BotWinPercentageChart class="statsChart" :data="coinflip" />
        <!--        <CoinflipChart class="profitChart" :data="coinflip" />-->
        <!--        <UpgradeChart class="profitChart" :data="upgrade" />-->
      </div>

      <h3>Tax statistics</h3>
      <div class="charts">
        <TaxChart class="statsChart" :data="coinflip" type='averageTax' gamemode='Coinflip' />
        <TaxChart class="statsChart" :data="coinflip" type='botAverageTax' gamemode='Coinflip Bot' />
        <TaxChart class="statsChart" :data="jackpot" type='averageTax' gamemode='Jackpot' />
        <!--        <CoinflipChart class="profitChart" :data="coinflip" />-->
        <!--        <UpgradeChart class="profitChart" :data="upgrade" />-->
      </div>

      <h3>Upgrade statistics</h3>
      <div class="charts">
        <UpgradeChart class="statsChart" :data="upgrade" />
        <UpgradeProfitChart gamemode='Upgrade' class="statsChart" :data="upgrade" />
        <UpgradeWinPercentageChart class="statsChart" :data="upgrade" />
        <!--        <CoinflipChart class="profitChart" :data="coinflip" />-->
        <!--        <UpgradeChart class="profitChart" :data="upgrade" />-->
      </div>

      <h3>Case statistics</h3>
      <div class="charts">
        <CasesChart class="statsChart" :data="cases" />
        <CasesProfitChart gamemode='Cases' class="statsChart" :data="cases" />
        <!--        <CoinflipChart class="profitChart" :data="coinflip" />-->
        <!--        <UpgradeChart class="profitChart" :data="upgrade" />-->
      </div>

      <h3>Battle statistics</h3>
      <div class="charts">
        <BattleChart class="statsChart" :data="battle" />
        <BattleProfitChart class="statsChart" :data="battle" />
        <!--        <CoinflipChart class="profitChart" :data="coinflip" />-->
        <!--        <UpgradeChart class="profitChart" :data="upgrade" />-->
      </div>

      <h3>Reward statistics</h3>
      <div class="charts">
        <RewardsChart class="statsChart" :data="rewards" />
      </div>

    </div>

    <div class="loader" v-else>
      <Loader />
    </div>

  </div>
  <div class="noPermission" v-else>You do not have permissions!</div>
</template>

<script>


import VolumeChart from "@/components/Stats/VolumeChart";
import JackpotChart from "@/components/Stats/Jackpot/JackpotChart";
import CoinflipChart from "@/components/Stats/Coinflip/CoinflipChart";
import RewardsChart from '@/components/Stats/Rewards/RewardsChart'
import Loader from '@/components/Loader';
import {useToast} from "vue-toastification";
import ProfitChart from '@/components/Stats/ProfitChart'
import CoinflipProfitChart from '@/components/Stats/Coinflip/CoinflipProfitChart'
import BotWinPercentageChart from '@/components/Stats/Coinflip/BotWinPercentageChart'
import UpgradeChart from '@/components/Stats/Upgrade/UpgradeChart'
import UpgradeWinPercentageChart from '@/components/Stats/Upgrade/UpgradeWinPercentageChart'
import UpgradeProfitChart from '@/components/Stats/Upgrade/UpgradeProfitChart'
import TaxChart from '@/components/Stats/Tax/TaxChart'
import TransactionsChart from '@/components/Stats/Transactions/TransactionsChart'
import BattleChart from '@/components/Stats/Battles/BattleChart'
import BattleProfitChart from '@/components/Stats/Battles/BattleProfitChart'
import CasesChart from '@/components/Stats/Cases/CasesChart'
import CasesProfitChart from '@/components/Stats/Cases/CasesProfitChart'
import JackpotProfitChart from '@/components/Stats/Jackpot/JackpotProfitChart'
import RustytimeChart from '@/components/Stats/Rustytime/RustytimeChart'
import RustytimeProfitChart from '@/components/Stats/Rustytime/RustytimeProfitChart'

export default {
  name: "Stats",
  components: {
    RustytimeProfitChart,
    RustytimeChart,
    JackpotProfitChart,
    CasesProfitChart,
    CasesChart,
    BattleProfitChart,
    BattleChart,
    TransactionsChart,
    TaxChart,
    UpgradeProfitChart,
    UpgradeWinPercentageChart,
    UpgradeChart,
    BotWinPercentageChart,
    CoinflipProfitChart,
    VolumeChart,
    JackpotChart,
    ProfitChart,
    CoinflipChart,
    RewardsChart,
    // UpgradeChart,
    Loader
  },
  setup() {
    const toast = useToast();
    return {toast}
  },
  data() {
    return {
      volume: undefined,
      jackpot: undefined,
      coinflip: undefined,
      upgrade: undefined,
      battle: undefined,
      cases: undefined,
      rustytime: undefined,
      rewards: undefined,
      transactions: undefined,
    }
  },
  async mounted() {
    await this.loadStats();
  },
  props: {
    user: null,
  },
  methods: {
    async loadStats() {
      const res = await fetch((process.env.VUE_APP_MODE === 'production' ? process.env.VUE_APP_API_URL : process.env.VUE_APP_API_URL_DEV) + "/stats", {
        credentials: 'include',
      })
      try {
        let response = await res.json()
        if(response.success) {
          console.log(response.data)
          this.volume = {dates: response.data.stats.date, ...response.data.stats.volume}
          this.jackpot = {dates: response.data.stats.date, ...response.data.stats.jackpot}
          this.coinflip = {dates: response.data.stats.date, ...response.data.stats.coinflip}
          this.upgrade = {dates: response.data.stats.date, ...response.data.stats.upgrade}
          this.battle = {dates: response.data.stats.date, ...response.data.stats.battle}
          this.cases = {dates: response.data.stats.date, ...response.data.stats.cases}
          this.rustytime = {dates: response.data.stats.date, ...response.data.stats.rustytime}
          this.rewards = {dates: response.data.stats.date, ...response.data.stats.rewards}
          this.transactions = {dates: response.data.stats.date, ...response.data.stats.transactions}
        } else {
          this.toast.error(response.message);
        }
      } catch (e) {
        this.toast.error("Error: " + e.message);
      }
    }
  }
}
</script>

<style scoped>
.noPermission {
  position: relative;
  top: 50%;
  color: #c82721;
  justify-content: center;
  align-items: center;
}

.loader {
  padding-top: 20%;
}

.stats {
  overflow: auto;
  height: 94%;
  padding: 3vh 5%;
}

.statsChart {
  height: 35em;
  background: #1a1f25;
  border-radius: 20px;
}

.volumeChart {
  height: 25em;
  background: #1a1f25;
  border-radius: 20px;
}

.charts {
  display: grid;
  gap: 2%;
  grid-template-columns: repeat(auto-fit, minmax(20%, 1fr));
}

.volumeChartAbove {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.refreshButton {
  width: 10%;
  height: 2.5em;
}

h3 {
  text-align: left;
}

</style>
