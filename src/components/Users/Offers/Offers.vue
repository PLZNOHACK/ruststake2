<template>
<div class='wrapper'>
  <div v-if='offersType === `steam`' class='offers'>
    <div v-for='offer in offers' :key='offer._id' @click='$emit(`selectOffer`, offer)' :class="'offer' + (selectedOffer && offer._id === selectedOffer._id ? ' selected' : '')">
      <div class='type'>{{ offer.type }}</div>
      <div class='date'>{{ new Date(offer.user_offer.date).toLocaleString() }}</div>
      <div class='status'>{{ offer.status }}</div>
      <div v-if='offer.total_value' class='price'>${{offer.total_value.toFixed(2)}}</div>
    </div>
  </div>
  <div v-else-if='offersType === `transactions`' class='offers'>
    <div v-for='offer in offers' :key='offer._id' @click='$emit(`selectOffer`, offer)' :class="'offer' + (selectedOffer && offer._id === selectedOffer._id ? ' selected' : '')">
      <div class='type'>{{ offer.type }}</div>
      <div class='date'>{{ new Date(offer.date).toLocaleString() }}</div>
      <div class='gameType' v-if='offer.game_type'>{{ offer.game_type }}</div>
      <div class='gameType' v-else >-</div>
      <div v-if='offer.price' class='price'>${{offer.price.toFixed(2)}}</div>
    </div>
  </div>

  <div v-else-if='offersType === `games`' class='offers'>
    <div v-for='offer in offers' :key='offer.id' @click='$emit(`selectOffer`, offer)' :class="'offer game' + (selectedOffer && offer.id === selectedOffer.id ? ' selected' : '')">
      <div class='type'>{{ offer._id }}</div>
      <div class='date'>{{ new Date(offer.date).toLocaleString() }}</div>
      <div class='id'>{{ offer.id }}</div>
    </div>
  </div>

  <div v-else-if='offersType === `balance`' class='offers'>
    <div v-for='offer in offers' :key='offer._id' @click='$emit(`selectOffer`, offer)' :class="'offer' + (selectedOffer && offer._id === selectedOffer._id ? ' selected' : '')">
      <div class='type'>Balance Update</div>
      <div class='date'>{{ new Date(offer.date).toLocaleString() }}</div>
      <div class='balance'>${{offer.balance.toFixed(2)}}</div>
      <div class='change'>{{ offer.change > 0 ? '+' : '-' }}${{Math.abs(offer.change).toFixed(2)}}</div>
    </div>
  </div>

</div>
</template>

<script>
export default {
  name: 'Offers',
  emits: ['selectOffer'],

  /* -------- PROPS -------- */
  props: {
    offers: {
      type: Array,
      default: () => [],
    },

    offerCount: {
      type: Number,
      default: 0,
    },

    offersType: {
      type: String,
      default: 'steam',
    },

    selectedOffer: {
      type: Object,
      default: undefined,
    },
  }
}
</script>

<style scoped>

.wrapper {
  max-height: 25.5em;
  overflow-y: scroll;
}

.offers {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  row-gap: 0.3em;
}

.offer {
  display: grid;
  width: 100%;
  grid-template-columns: 25% 30% 30% 15%;
  background-color: rgba(21, 23, 27, 1);
  border-radius: 12px;
  padding: 0.5em 0;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-sizing: border-box;
}

.game {
  grid-template-columns: 20% 40% 40%;
}

.offer:hover {
  background-color: rgba(21, 23, 27, 0.5);;
}

.selected {
  border: 2px solid #338EFF;
}

</style>