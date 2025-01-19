<template>
<div class="partner">
  <div class="username">
    <input type="text" v-model="username">
  </div>
  <div class="tradeurl">
    <input type="url" v-model="tradeurl">
  </div>
  <div class="amount">
    <div class="dollar">$</div>
    <input type="number" v-model="amount">
  </div>
  <div class="buttons">
    <Button class="addButton" label="Add" @click="addPartner"/>
    </div>
</div>
</template>

<script>
import Button from "@/components/Button";

export default {
  name: "NewPartner",
  components: {
    Button
  },
  data() {
    return {
      username: "",
      tradeurl: "",
      amount: 0,
    }
  },
  emits: ['addPartner'],
  methods: {
    addPartner() {
      this.$emit('addPartner', {username: this.username, tradeurl: this.tradeurl, amount: this.amount});
    }
  }
}
</script>

<style scoped>
.partner {
  display: flex;
  margin-right: 0.5em;
  height: 4em;
  border-radius: 15px;
  margin-bottom: 0.7em;
  background: #1E242B;
  align-items: center;
  padding: 0 15px 0 15px;
}

.username {
  display: flex;
  border-right: solid 2px #15171B;
  height: 100%;
  width: 20%;
  align-items: center;
  justify-content: center;
}


.tradeurl {
  height: 100%;
  width: 50%;
  border-right: solid 2px #15171B;
  display: flex;
  justify-content: center;
  align-items: center;
}

a {
  color: #68798d;
}

.amount {
  display: flex;
  height: 100%;
  width: 10%;
  border-right: solid 2px #15171B;
  align-items: center;
  justify-content: center;
}

.dollar {
  color: #c82721;
  font-weight: 500;
}

.buttons {
  display: flex;
  height: 100%;
  width: 20%;
  justify-content: center;
  align-items: center;
}

.addButton {
  height: 50%;
  width: 40%;
}

input {
  color: white;
  background-color: #1E242B;
  border: solid 2px #2d333c;
  border-radius: 7px;
  width: 70%;
  height: 35%;
  display: flex;
  text-align: center;
  align-items: center;
}


</style>
