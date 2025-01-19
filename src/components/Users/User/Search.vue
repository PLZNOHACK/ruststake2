<template>
  <div class='search'>
    <input type='text' class='steamID' placeholder='Enter a Steam ID' v-model='steamID'/>
    <Button class='confirm' label='Confirm' @click="$emit('search', steamID)" />
  </div>
</template>

<script>
import Button from '@/components/Button'
import _ from 'lodash'
import { useToast } from 'vue-toastification'

export default {
  name: 'Search',
  components: { Button },
  data() {
    return {
      steamID: '',
    }
  },
  props: {
    query: {
      type: String,
      default: ''
    },
  },
  emits: ['search'],
  setup() {
    const toast = useToast();
    return {toast}
  },
  mounted() {
    if(!_.isEmpty(this.query)) {
      this.steamID = this.query
      this.$emit('search', this.steamID)
    }
  },
}
</script>

<style scoped>
  .search {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100%;
  }

  input {
    width: 68%;
    height: 2.5em;
  }

  .confirm {
    width: 30%;
    height: 2.5em;
  }
</style>