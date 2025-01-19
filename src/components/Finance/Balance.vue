<template>
  <div class="balance">
    <label>{{label}}</label>
    <div v-if="value" class="value">
      ${{value.toFixed(2)}}
    </div>
    <Loader2 v-else/>
  </div>
</template>

<script>
import Loader2 from "@/components/Loader2";

export default {
  name: "Balance",
  components: {
    Loader2
  },
  props: {
    label: String,
    value: Number,
  }
}
</script>

<style scoped>
.balance {
  display: flex;
  flex-direction: column;
  background: #1E242B;
  border-radius: 12px;
  height: 8vh;
  align-items: center;
  justify-content: center;
}

.value {
  font-weight: bolder;
  font-size: 23px;
  color: #768393;
}
</style>