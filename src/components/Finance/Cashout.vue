<template>
  <div class="cashout">
    <div class="cashoutInfo">
      <div class="cashoutDate">{{new Date(cashout.time * 1000).toLocaleDateString("en-US")}}:</div>
      <div class="cashoutValue">${{parseFloat(cashout.amount_usd).toFixed(2)}}</div>
      <div class="cashoutFee">(-${{parseFloat(cashout.fee_usd).toFixed(2)}})</div>
    </div>
    <div class="cashoutAddress">
      {{cashout.btc_address}}
    </div>
  </div>
</template>

<script>
export default {
  name: "Cashout",
  props: {
    cashout: Object,
  }
}
</script>

<style scoped>
.cashout {
  background: #1E242B;
  height: 6vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.cashoutInfo {
  display: flex;
  flex-direction: row;
}

.cashoutDate {
  margin-right: 0.4em;
}

.cashoutValue {
  color: rgba(121, 255, 121, 0.9);
  margin-right: 0.4em;
  font-weight: bolder;
}

.cashoutFee {
  color: rgba(255, 83, 83, 0.9);
  font-weight: bolder;
}

.cashoutAddress {
  font-size: 12px;
  color: #768393;
}
</style>