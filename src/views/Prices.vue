<template>
  <div class="page">
    <div class="menu" ref="top">
      <div class="nav">
        <Button v-for="(value, id) in sections" :label="value" :key="id" @click="scrollToSection(id)"/>
      </div>
      <div class="lastUpdated" :class="{ outdated }" v-if="lastUpdated">{{ lastUpdated }}</div>
      <div class="settings">
        <div>
          <span>Price multiplier</span>
          <input v-model="settings.priceMultiplier" :disabled="!settings.loaded" @change="updateSettings" type="number">
        </div>
        <div>
          <span>Price tolerance</span>
          <input v-model="settings.priceTolerance" :disabled="!settings.loaded" @change="updateSettings" type="number">
        </div>
        <div>
          <span>Correlation tolerance</span>
          <input v-model="settings.correlationTolerance" :disabled="!settings.loaded" @change="updateSettings" type="number">
        </div>
        <!-- Refetch button with refresh icon -->
        <Button icon="fa-solid fa-sync" label="Reload" @click="loadPrices" />

        <!-- Force update button -->
        <Button icon="fa-solid fa-cloud-arrow-down" label="Force update" @click="forceUpdate" />
      </div>
    </div>

    <template v-for="(elements, id) in items" :key="id">
      <div class="section-header" :ref="id">
        <div class="title">
          <Loader2 v-if="loading" />
          {{ sections[id] }} ({{ elements.length }} items)
        </div>
        <Button label="Back to top" icon="fa-solid fa-arrow-up" @click="scrollToSection('top')" backgroundColor="rgba(51, 142, 255, 0.25)" textColor="rgba(51, 142, 255, 1)" />
      </div>
      <div class="items">
        <Item 
          v-for="item in elements" 
          :key="item.id" 
          :item="item" 
          :priceMultiplier="settings.priceMultiplier"
          @update:customPrice="val => updateCustomPrice(item.item, {enabled: val.enabled, price: val.price})"
          @update:disabled="val => updateDisabled(item.item, val)"
          @update:override="val => updateOverride(item.item, val)"
        />
      </div>
    </template>
  </div>
</template>

<script>
import Item from '@/components/Prices/Item';
import Button from '@/components/Button';
import Loader2 from '@/components/Loader2';

import {useToast} from "vue-toastification";

export default {
  name: 'Prices',
  components: {
    Item,
    Button,
    Loader2
  },

  setup() {
    const toast = useToast();
    return {toast}
  },
  async mounted() {
    this.getSettings();
    this.loadPrices();
  },
  data() {
    return {
      loading: false,

      lastUpdated: null,
      outdated: false,

      items: {
        disabled: [],
        custom: [],
        overriden: [],
        notAccepted: [],
        accepted: [],
      },

      sections: {
        disabled: 'Disabled',
        custom: 'Custom',
        overriden: 'Overriden',
        notAccepted: 'Not Accepted',
        accepted: 'Accepted',
      },

      settings: {
        loaded: false,
        priceTolerance: 0,
        priceMultiplier: 0,
        correlationTolerance: 0,
      }
    };
  },
  methods: {
    async loadPrices() {
      if (this.loading) {
        return;
      }

      this.clearItems();

      this.loading = true;

      const priceSheet = await this.getPrices();

      const prices = priceSheet.items;

      const lastUpdate = new Date(priceSheet.updatedAt);
      this.lastUpdated = `Last updated: ${lastUpdate.toLocaleDateString()} ${lastUpdate.toLocaleTimeString()}`;

      this.outdated = (new Date() - lastUpdate) > 1000 * 60 * 15;

      prices.sort((a, b) => {0
        return b.price - a.price;
      })

      prices.forEach(item => {
        if (item.disabled) {
          this.items.disabled.push(item);
          return
        }

        if (item.custom && item.custom.enabled) {
          this.items.custom.push(item);
          return
        }

        if (item.override) {
          this.items.overriden.push(item);
          return
        }

        if (!item.accepted) {
          this.items.notAccepted.push(item);
          return
        }

        this.items.accepted.push(item);
      })

      this.loading = false;
    },

    async getPrices() {
      const res = await fetch((process.env.VUE_APP_MODE === 'production' ? process.env.VUE_APP_API_URL : process.env.VUE_APP_API_URL_DEV) + "/prices", {
        credentials: 'include',
      })
      let response = await res.json();

      if (!response.success) {
        this.toast.error("Failed to fetch prices!");
        return [];
      }

      return response.data;
    },

    async getSettings() {
      try {
        const res = await fetch((process.env.VUE_APP_MODE === 'production' ? process.env.VUE_APP_API_URL : process.env.VUE_APP_API_URL_DEV) + "/prices/settings", {
        credentials: 'include',
      })
      let response = await res.json();

      this.settings = {...response, loaded: true}
      } catch (e) {
        this.toast.error("Failed to fetch settings!");
      }
    },

    async updateSettings() {
      try {
        const res = await fetch((process.env.VUE_APP_MODE === 'production' ? process.env.VUE_APP_API_URL : process.env.VUE_APP_API_URL_DEV) + "/prices/updateSettings", {
          credentials: 'include',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ priceTolerance: this.settings.priceTolerance, priceMultiplier: this.settings.priceMultiplier, correlationTolerance: this.settings.correlationTolerance })
        })
        let response = await res.json();
        this.toast.success(response.msg);
      } catch (e) {
        this.toast.error("Failed to update settings!");
      }
    },

    async forceUpdate() {
      const res = await fetch((process.env.VUE_APP_MODE === 'production' ? process.env.VUE_APP_API_URL : process.env.VUE_APP_API_URL_DEV) + "/prices/forceUpdate", {
        credentials: 'include',
      })
      let response = await res.json();

      if (!response.success) {
        this.toast.error("Failed to force update!");
        return;
      }

      this.toast.success("Successfully forced update! Reloading...");
      await this.loadPrices();
    },

    clearItems() {
      this.items = {
        disabled: [],
        custom: [],
        overriden: [],
        notAccepted: [],
        accepted: [],
      }
    },

    scrollToSection(id) {
      let el = this.$refs[id];

      if (Array.isArray(el)) {
        el = el[0];
      }
      
      el.scrollIntoView({ behavior: 'smooth' });
    },

    async updateCustomPrice(item, payload) {

      const { enabled, price } = payload;

      const res = await fetch((process.env.VUE_APP_MODE === 'production' ? process.env.VUE_APP_API_URL : process.env.VUE_APP_API_URL_DEV) + "/prices/setPrice", {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ item, enabled, price })
      })
      let response = await res.json();

      if (!response.success) {
        this.toast.error(`Failed to set custom price: ${response.msg}`);
      } else {
        this.rearrangeItem(item, {custom: {enabled, price}});
        this.toast.success(`Successfully set custom price for ${item}`);
      }
    },

    async updateDisabled(item, disable) {
      const res = await fetch((process.env.VUE_APP_MODE === 'production' ? process.env.VUE_APP_API_URL : process.env.VUE_APP_API_URL_DEV) + "/prices/disable", {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ item, disable })
      })
      let response = await res.json();

      if (!response.success) {
        this.toast.error(`Failed to set disabled: ${response.msg}`);
      } else {
        this.rearrangeItem(item, {disabled: disable});
        this.toast.success(`Successfully set disabled for ${item}`);
      }
    },

    async updateOverride(item, override) {
      const res = await fetch((process.env.VUE_APP_MODE === 'production' ? process.env.VUE_APP_API_URL : process.env.VUE_APP_API_URL_DEV) + "/prices/override", {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ item, override })
      })
      let response = await res.json();

      if (!response.success) {
        this.toast.error(`Failed to set override: ${response.msg}`);
      } else {
        this.rearrangeItem(item, {override});
        this.toast.success(`Successfully set override for ${item}`);
      }
    },

    rearrangeItem(item, update) {
      const currentCategory = item.disabled ? 'disabled' : (item.custom && item.custom.enabled) ? 'custom' : item.override ? 'overriden' : item.accepted ? 'accepted' : 'notAccepted';

      const index = this.items[currentCategory].findIndex(i => i.item === item.item);

      if (index === -1) {
        return;
      }

      let itemObj = this.items[currentCategory].splice(index, 1);

      itemObj = {
        ...itemObj,
        ...update
      }

      const newCategory = itemObj.disabled ? 'disabled' : itemObj.custom.enabled ? 'custom' : itemObj.override ? 'overriden' : itemObj.accepted ? 'accepted' : 'notAccepted';

      this.items[newCategory].push(itemObj);
    },
  },
};
</script>

<style lang="scss" scoped>

.menu {
  display: flex;
  justify-content: space-between;
  width: 100%;

  .nav {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
  }

  .lastUpdated {
    font-weight: 500;
    &.outdated {
      color: red;
    }
  }

  .settings {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
  }

  .button {
    padding: 0.5em;
  }
}

.menu button {
  padding: 0.5em;
  font-size: 1em;
}

.section-header {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  margin: 1em 0;

  .title {
    font-size: 1.5em;
    font-weight: bold;
    justify-content: center;
  }

  .button {
    padding: 0.5em;
  }
}

.page {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1em;
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  box-sizing: border-box;
}

.items {
  /* make this a grid, where you fit as many items in a row as possible */
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1em;
  width: 100%;
  box-sizing: border-box;
}
</style>