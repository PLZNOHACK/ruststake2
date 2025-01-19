<template>
  <div v-if="bot" class="bot">
    <div class="info">
      <img class="profileImage" :src="bot.photo">
      <div class="profileName">
        <a target="_blank" :href="bot.profileurl">{{ bot.name }}</a>
        <div class="steamID" @click="copySteamID();">({{ bot.steamID }})</div>
      </div>
    </div>
    <div class="gamemodes">
      <div :class="'gamemode ' + (gamemode === 'jackpot' ? 'selected' : '')" @click="gamemode = 'jackpot'">Jackpot</div>
      <div :class="'gamemode ' + (gamemode === 'coinflip' ? 'selected' : '')" @click="gamemode = 'coinflip'">Coinflip</div>
    </div>
    <div class="lowerSection">
      <div v-if="gamemode === 'jackpot'" class="botStats">
        <div :class="'profits ' + (bot.jackpot.stats.profit >= 0 ? 'profitPositive' : 'profitNegative')">{{bot.jackpot.stats.profit >= 0 ? '+' : '-'}}${{Math.abs(bot.jackpot.stats.profit).toFixed(2)}}</div>
        <div class="wagered profits">${{Math.abs(bot.jackpot.stats.wagered).toFixed(2)}}</div>
      </div>
      <div v-else class="botStats">
        <div :class="'profits ' + (bot.coinflip.stats.profit >= 0 ? 'profitPositive' : 'profitNegative')">{{bot.coinflip.stats.profit >= 0 ? '+' : '-'}}${{Math.abs(bot.coinflip.stats.profit).toFixed(2)}}</div>
        <div class="wagered profits">${{Math.abs(bot.coinflip.stats.wagered).toFixed(2)}}</div>
      </div>
      <div class="settings">
        <div v-if="gamemode === 'jackpot'" class="gameSettings">
          <div>
            <label>Time range:</label>
            <Slider v-model="jackpot.timeRange" :format="timeRangeFormat" :min="0" :max="86400" :step="600" showTooltip='focus' @change="update = true" />
          </div>
          <div>
            <label>Bet range:</label>
            <Slider v-model="jackpot.betRange" :format="betRangeFormat" :min="0.5" :max="300" :step="-1" showTooltip='focus' @change="update = true" />
          </div>
          <div>
            <label>Bet probability:</label>
            <Slider v-model="jackpot.betProbability" :format="betProbabilityFormat" :min="0" :max="100" :step="-1" showTooltip='focus' @change="update = true" />
          </div>
          <div class="customBet">
            <div class="customBetInner">
              <input class="amountInputJackpot" type="number" placeholder="Amount" v-model="betAmount">
              <Button class="customBetButton" label="Deposit" @click="customBet()" />
            </div>
          </div>
        </div>
        <div v-else class="gameSettings">
          <div class="twoSliders">
            <div class="halfSlider">
              <label>Time range:</label>
              <Slider v-model="coinflip.timeRange" :format="timeRangeFormat" :min="0" :max="86400" :step="600" showTooltip='focus' @change="update = true" />
            </div>
            <div class="halfSlider">
              <label>Bet range:</label>
              <Slider v-model="coinflip.betRange" :format="betRangeFormat" :min="0.5" :max="300" :step="-1" showTooltip='focus' @change="update = true" />
            </div>
          </div>
          <div class="twoSliders">
            <div class="halfSlider">
              <label>Bet probability:</label>
              <Slider v-model="coinflip.betProbability" :format="betProbabilityFormat" :min="0" :max="100" :step="-1" showTooltip='focus' @change="update = true" />
            </div>
            <div class="halfSlider">
              <label>Join probability:</label>
              <Slider v-model="coinflip.joinProbability" :format="betProbabilityFormat" :min="0" :max="100" :step="-1" showTooltip='focus' @change="update = true" />
            </div>
          </div>
          <div class="coinflipSpecialSettings">
            <div class="half coinflipSpecialSetting">
              <label>Max active:</label>
              <input type="number" id="maxActiveInput" v-model="coinflip.maxActive" @change="update = true">
            </div>
            <div class="half coinflipSpecialSetting">
              <label>Call Rusty:</label>
              <input type="checkbox" id="callRustyInput" v-model="coinflip.callRusty" @change="update = true">
            </div>
          </div>
          <div class="customBet">
            <div id="customBetInnerCoinflip" class="customBetInner">
              <input class="amountInputCoinflip" type="number" placeholder="Amount" v-model="betAmount">
              <div class="coinflipSide" @click="selectedSide = selectedSide === 'ak' ? 'headdress' : 'ak'">
                <img class="sideImg" v-if="selectedSide === 'ak'" src="../../assets/red.svg">
                <img class="sideImg" v-else src="../../assets/gray.svg">
              </div>
              <Button class="customBetButton" label="Create" @click="customBet()" />
            </div>
            <Button class="customJoin" icon="fas fa-hand-pointer" @click="showModal = true"/>
          </div>
        </div>
      </div>
      <Button v-if="!update" class="removeButton" label="Remove bot" background-color="rgba(200, 39, 33, 1)" @click="removeBot()" />
      <Button v-else class="updateButton" label="Update settings" @click="updateBot()" />
    </div>
  </div>
  <SelectCoinflipModal v-model="showModal" @cancel="selectedCoinflip = undefined" @join="joinCoinflip()">
    <template v-slot:title>Join coinflip</template>
    <p>Select a coinflip that you wish bot <strong>{{bot.name}}</strong> joins.</p>
    <div class="coinflips">
      <Coinflip :class="(selectedCoinflip === coinflip ? 'selectedCoinflip' : '')" v-for="coinflip in coinflips"
                :key="coinflips.indexOf(coinflip)" :coinflip="coinflip" @click="selectedCoinflip = coinflip" />
    </div>
  </SelectCoinflipModal>
</template>

<script>
import Slider from '@vueform/slider'
import { useToast, TYPE } from "vue-toastification";
import Button from "@/components/Button";
import SelectCoinflipModal from "@/components/Modals/SelectCoinflipModal";
import Coinflip from "@/components/Pushers/Coinflip";

export default {
  name: "Bot",
  components: {
    SelectCoinflipModal,
    Slider, Button, Coinflip
  },
  setup() {
    const toast = useToast();
    return {toast}
  },
  emits: ['reloadBots'],
  data() {
    return {
      timeRangeFormat: (value) => {
        let valueFormat = {minimumIntegerDigits: 2, useGrouping:false, maximumFractionDigits: 0};
        let hours = Math.floor(Math.round(value/60) / 60);
        let minutes = Math.floor(Math.round(value/60) % 60);
        return hours.toLocaleString('en-US', valueFormat) + ":" + minutes.toLocaleString('en-US', valueFormat);
      },

      betRangeFormat: (value) => {
        return "$" + value.toFixed(2);
      },

      betProbabilityFormat: (value) => {
        return value.toFixed(2) + "%";
      },

      jackpot: {
        timeRange: [this.bot.jackpot.time.start, this.bot.jackpot.time.end],
        betRange: [this.bot.jackpot.bets.min, this.bot.jackpot.bets.max],
        betProbability: this.bot.jackpot.bets.probability * 100,
      },

      coinflip: {
        timeRange: [this.bot.coinflip.time.start, this.bot.coinflip.time.end],
        betRange: [this.bot.coinflip.bets.min, this.bot.coinflip.bets.max],
        betProbability: this.bot.coinflip.bets.probability * 100,
        joinProbability: this.bot.coinflip.bets.joinProbability * 100,
        maxActive: this.bot.coinflip.bets.maxActive,
        callRusty: this.bot.coinflip.bets.callRusty,
      },

      selectedSide: 'ak',
      selectedCoinflip: undefined,

      betAmount: 0.00,
      update: false,

      gamemode: 'jackpot',
      showModal: false,
    }
  },
  props: {
    bot: {},
    coinflips: Object,
  },
  methods: {
    async removeBot() {
      const res = await fetch((process.env.VUE_APP_MODE === 'production' ? process.env.VUE_APP_API_URL : process.env.VUE_APP_API_URL_DEV) + "/storage/remove", {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          steamID: this.bot.steamID,
        })
      })

      let response = await res.json();
      this.toast(response.message, {type: response.success ? TYPE.SUCCESS : TYPE.ERROR});
      if(response.success) this.$emit('reloadBots');
    },
    async updateBot() {
      const res = await fetch((process.env.VUE_APP_MODE === 'production' ? process.env.VUE_APP_API_URL : process.env.VUE_APP_API_URL_DEV) + "/storage/update", {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          steamID: this.bot.steamID,

          jackpot: {
            time: {
              start: this.jackpot.timeRange[0],
              end: this.jackpot.timeRange[1],
            },
            bets: {
              min: this.jackpot.betRange[0],
              max: this.jackpot.betRange[1],
              probability: this.jackpot.betProbability / 100,
            }
          },

          coinflip: {
            time: {
              start: this.coinflip.timeRange[0],
              end: this.coinflip.timeRange[1],
            },
            bets: {
              min: this.coinflip.betRange[0],
              max: this.coinflip.betRange[1],
              probability: this.coinflip.betProbability / 100,
              joinProbability: this.coinflip.joinProbability / 100,
              maxActive: this.coinflip.maxActive,
              callRusty: this.coinflip.callRusty,
            }
          },
        })
      })

      let response = await res.json();
      this.toast(response.message, {type: response.success ? TYPE.SUCCESS : TYPE.ERROR});
      if (response.success) this.$emit('reloadBots')
      this.update = false;
    },
    async customBet() {
      if(this.betAmount < 0.5) {
        this.toast.info("Info: Amount must be at least $0.5!");
      } else {
        const res = await fetch((process.env.VUE_APP_MODE === 'production' ? process.env.VUE_APP_API_URL : process.env.VUE_APP_API_URL_DEV) + "/storage/bet", {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            gamemode: this.gamemode,
            steamID: this.bot.steamID,
            amount: this.betAmount,
            side: this.gamemode === 'coinflip' ? this.selectedSide : null,
          })
        });
        let response = await res.json();
        this.toast(response.message, {type: response.success ? TYPE.SUCCESS : TYPE.ERROR});
      }
    },
    async joinCoinflip() {
      if(!this.selectedCoinflip) {
        this.toast.info("Info: Please select a coinflip to join!");
      } else {
        const res = await fetch((process.env.VUE_APP_MODE === 'production' ? process.env.VUE_APP_API_URL : process.env.VUE_APP_API_URL_DEV) + "/storage/joinCoinflip", {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            steamID: this.bot.steamID,
            coinflip: this.selectedCoinflip,
          })
        });
        let response = await res.json();
        this.toast(response.message, {type: response.success ? TYPE.SUCCESS : TYPE.ERROR});
      }
    },
    copySteamID() {
      navigator.clipboard.writeText(this.bot.steamID);
    }
  }
}
</script>
<style src="../../../node_modules/@vueform/slider/themes/default.css"></style>
<style scoped>

i {
  color: white;
}

.bot {
  background: #1E242B;
  border-radius: 15px;
  height: fit-content;
}

.info {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 4.5em;
  border-radius: 15px 15px 0 0;
  background: #1a1f25;
}

a {
  color: white;
  text-decoration: none;
}

.profileImage {
  margin-right: 0.5em;
  border-radius: 50%;
  width: 3em;
}

.lowerSection {
  padding: 1em;
}

.botStats {
  display: flex;
  margin-bottom: 1em;
  justify-content: space-between;
}

.profits {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: bolder;
  border-radius: 7px;
  width: 47.5%;
  height: 2.75em;
}

.profitPositive {
  background: rgba(138, 195, 41, 0.25);
  color: rgba(138, 195, 41, 1)
}

.profitNegative {
  background: rgba(255, 50, 50, 0.25);
  color: rgba(255, 50, 50, 1);
}

.wagered {
  background: rgba(51, 142, 255, 0.25);
  color: rgb(51, 142, 255)
}

.settings {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

label {
  font-size: 15px;
}

.gameSettings {
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 1fr;
  width: 100%;
  grid-template-rows: 2em 2em 2em;
}

.removeButton {
  margin-top: 1em;
  height: 2.5em;
}

.updateButton {
  margin-top: 1em;
  height: 2.5em;
}

.customBet {
  margin-top: 0.5em;
  height: 2.5em;
  display: flex;
  justify-content: space-between;
}

.customBetInner {
  display: flex;
  background: #15171B;
  border-radius: 12px;
  width: 100%;
  height: 100%;
}

#customBetInnerCoinflip {
  width: 85%;
}

.amountInputJackpot {
  width: 60%;
  background: #15171B;
  border-radius: 12px;
  border: none;
  color: white;
  padding: 0 10px;
  font-size: 15px;
}

.amountInputCoinflip {
  width: 50%;
  background: #15171B;
  border-radius: 12px;
  border: none;
  color: white;
  padding: 0 10px;
  font-size: 15px;
}

.coinflipSide {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 10%;
  cursor: pointer;
}

.sideImg {
  width: 75%;
  height: 75%;
}

.customBetButton {
  height: 100%;
  width: 40%;
}

.customJoin {
  height: 100%;
  width: 13%;
}

input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

input[type=number] {
  -moz-appearance: textfield;
}

.gamemodes {
  display: flex;
  width: 100%;
}

.gamemode {
  width: 50%;
  padding: 1.2em 0;
  cursor: pointer;
  color: #414751;
  background: #1a1f25;
}

.selected {
  cursor: default;
  color: white;
  background: #1E242B;
}

.twoSliders {
  display: flex;
  justify-content: space-between;
}

.halfSlider {
  width: 47.5%;
}

.half {
  width: 50%;
}

.coinflipSpecialSettings {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.coinflipSpecialSetting {
  display: flex;
  align-items: center;
  justify-content: center;
}

#maxActiveInput {
  background: #15171B;
  border-radius: 10px;
  border: none;
  color: white;
  font-size: 15px;
  width: 2em;
  text-align: center;
  height: 2em;
  margin-left: 0.5em;
}

#callRustyInput {
  width: 1.5em;
  height: 1.5em;
  margin-left: 0.5em;
}

.steamID {
  font-size: 10px;
  cursor: copy;
}

.coinflips {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.4em;
  width: 100%;

}

.selectedCoinflip {
  background: rgba(51, 142, 255, .07);
  border: 2px solid rgba(51, 142, 255, 1);
}

</style>