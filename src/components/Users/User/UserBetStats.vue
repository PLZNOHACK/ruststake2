<template>
  <div v-if='user' class='userBetStats'>
    <div class='xp'>XP: <input id='xp' type='number' placeholder='Enter XP...' v-model='xp' @change='updateXP' /></div>
    <div class='stats'>
      <div>Deposited: <span v-if='user.profit' class='amount deposited'>${{ user.profit.deposited.toFixed(2) }}</span></div>
      <div>Withdrawn: <span v-if='user.profit' class='amount withdrawn'>${{ user.profit.withdraw.toFixed(2) }}</span></div>
<!--      <div>Backpack: <span v-if='user.profit' class='amount backpack'>${{ user.profit.totalBackpackPrice.toFixed(2) }}</span></div>-->
    </div>
    <div class='balance'>Balance: <input id='balance' type='number' placeholder='Enter Balance...' v-model='balance' @change='updateBalance' /></div>
    <div class='wager'>Wager: <input id='wager' type='number' placeholder='Wager requirement...' v-model='wager' @change='updateWager' /></div>
  </div>
</template>

<script>
export default {
  name: 'UserBetStats',
  props: {
    user: {
      type: Object,
    },
  },
  data() {
    return {
      xp: { type: Number, default: 0 },
      balance: { type: Number, default: 0 },
      wager: { type: Number, default: 0 },
    }
  },
  watch: {
    user: {
      handler: function (val) {
        this.xp = val.xp;
        this.balance = val.balance;
        this.wager = val.wager_requirement;
      },
      deep: true,
    },
  },
  mounted() {
    this.xp = this.user.xp
    this.balance = this.user.balance
    this.wager = this.user.wager_requirement
  },
  methods: {
    updateXP() {
      this.$emit('updateUser', 'xp', this.xp)
    },
    updateBalance() {
      this.$emit('updateUser', 'balance', this.balance)
    },
    updateWager() {
      this.$emit('updateUser', 'wager_requirement', this.wager)
    }
  }
}
</script>

<style scoped>
.userBetStats {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.xp, #xp {
  font-size: 18px;
  font-weight: bold;
  width: 100%;
}

.xp {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  column-gap: 1.5em;
}

.balance, #balance {
  font-size: 18px;
  font-weight: bold;
  width: 100%;
}

.balance {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  column-gap: 1.5em;
}

.wager, #wager {
  font-size: 18px;
  font-weight: bold;
  width: 100%;
}

.wager {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  column-gap: 1.5em;
}

.stats {
  display: flex;
  justify-content: space-around;
  border: 2px solid #2D333C;
  border-radius: 12px;
  padding: 0.5em 0;
  width: 100%;
}

.amount {
  font-size: 14px;
  font-weight: bold;
}

.deposited {
  color: #41FF68;
}

.withdrawn {
  color: #F83C63;
}

.backpack {
  color: #36A2EB;
}
</style>