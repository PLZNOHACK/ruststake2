<template>
  <div class="item">
    <div class="info">
      <span class="price">${{ item.price ? item.price.toFixed(2) : '--.--' }} <span class="multiplier">(D: ${{ (item.price
        && priceMultiplier) ? (item.price * priceMultiplier).toFixed(2) : '--.--' }})</span> <span
          class="multiplier">(W: ${{ (item.price && priceMultiplier) ? buyFeeFunction(item.price * priceMultiplier) :
            '--.--' }})</span></span>
      <span class="name">{{ item.item }}</span>
    </div>
    <div class="checkboxes">
      <div>
        <Checkbox :value="item.accepted" :id="`accepted:${item.item}`" :disabled="true" />
        <label>Accepted</label>
      </div>
      <div>
        <Checkbox :value="item.disabled" :id="`disabled:${item.item}`" @change="val => $emit('update:disabled', val)" />
        <label>Disabled</label>
      </div>
      <div>
        <Checkbox :value="item.override" :id="`override:${item.item}`" @change="val => $emit('update:override', val)" />
        <label>Override</label>
      </div>
    </div>
    <div v-if="customLoaded" class="custom">
      <div class="label">Custom price:</div>
      <div class="fields">
        <!-- There's an issue with price being null right now, I'll need to make it so there's a new variable which gets filled with item.custom.price on mounted or something, same for the checkboxes -->
        <Checkbox :value="customEnabled" :id="`custom:${item.item}`" @change="val => enableCustomPrice(val)" />
        <input type="text" v-model="customPrice"
          @change="$emit('update:customPrice', { enabled: customEnabled, price: customPrice })">
      </div>
    </div>
    <div class="prices" v-if="item.correlations">
      <span class="provider" v-for="(price, provider) in item.prices" :key="provider">
        <span class="name">{{ provider }}:</span>
        <span>${{ price.toFixed(2) }}</span>
        <span v-if="item.correlations[provider]">(x{{ item.correlations[provider].toFixed(2) }})</span>
      </span>
    </div>
    <div class="reasons-wrapper" ref="reasons" v-if="!item.accepted">
      <i class="icon fa-solid fa-circle-exclamation" @click="showReasons = !showReasons"></i>
      <div class="reasons" v-if="showReasons">
        <div class="reason" v-for="reason in item.reasons" :key="reason">
          <i class="fa-solid fa-circle-exclamation"></i>
          {{ reason }}
        </div>
      </div>
    </div>
  </div>
</template>
class="multiplier"
<script>
import Checkbox from '@/components/Checkbox';

export default {
  name: 'Item',
  components: {
    Checkbox
  },
  mounted() {
    this.customEnabled = !!(this.item.custom) && this.item.custom.enabled;
    this.customPrice = this.item.custom.price || "";

    this.customLoaded = true;

    document.addEventListener("click", this.handleOutsideClick);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleOutsideClick);
  },
  data() {
    return {
      showReasons: false,

      customLoaded: false,

      customEnabled: false,
      customPrice: "",
    }
  },
  props: {
    item: {
      type: Object,
      required: true
    },

    priceMultiplier: {
      type: Number,
    }
  },
  methods: {
    handleOutsideClick(event) {
      const vm = this.$refs.reasons;

      if (vm && this.showReasons && !vm.contains(event.target)) {
        this.showReasons = false;
      }
    },

    enableCustomPrice(val) {
      this.customEnabled = val;
      this.$emit('update:customPrice', { enabled: this.customEnabled, price: this.customPrice });
    },

    buyFeeFunction(price) {
      if (!price || price === 0) {
        return 0;
      }
      const percentage = 15;
      const newPrice = price * (1 + percentage / 100);
      return Math.round((newPrice + Number.EPSILON) * 100) / 100;
    }
  },
}
</script>
  
<style lang="scss" scoped>
.item {
  display: flex;
  flex-direction: column;
  background: #1E242B;
  border-radius: 12px;
  padding: 1rem;
  position: relative;
  gap: 0.7rem;
}

.info {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  row-gap: 0.2em;
  height: 4rem;
  overflow: clip;
}

.name {
  text-align: start;
}

.price {
  font-weight: bold;

  .multiplier {
    font-size: 12px;
    font-weight: normal;
  }
}

.provider {
  display: grid;
  justify-items: center;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 0.3rem;

  .name {
    justify-self: flex-start;
  }
}

.checkboxes {
  display: flex;
  flex-direction: column;
  row-gap: 0.3rem;

  div {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
  }
}

.custom {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;

  .label {
    display: flex;
    width: 100%;
  }

  .fields {
    display: flex;
    flex-direction: row;
    width: 100%;
    gap: 0.2rem;

    input {
      width: 100%;
    }
  }
}

.reasons-wrapper {

  .icon {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;

    color: #FFC107;
    font-size: 16px;
  }

  .reasons {
    display: flex;
    flex-direction: column;
    position: absolute;
    bottom: calc(100% + 0.5rem);
    background: #0e1114;
    opacity: 0.9;
    border-radius: 12px;
    padding: 1rem;
    z-index: 10;
    word-wrap: anywhere;
    gap: 1rem;

    max-height: 10rem;
    width: 20rem;
    overflow-y: scroll;


    .reason {
      display: flex;
      flex-direction: row;
      gap: 0.5rem;
      text-align: start;
    }

    i {
      color: #FFC107;
      font-size: 16px;
    }
  }
}</style>