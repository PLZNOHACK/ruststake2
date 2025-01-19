<template>
<div v-if='user.punishments' class="punishments">
  <div class='punishment'>
    <div class='info'>
      <div>Banned: {{ user.punishments.banned}}</div>
      <div class='until' v-if='user.punishments.banned && user.punishments.ban_end_date'>
        Until: {{ new Date(user.punishments.ban_end_date).toLocaleDateString("en-US") }}
        {{ new Date(user.punishments.ban_end_date).toLocaleTimeString("en-US") }}
      </div>
    </div>
    <div class='options'>
      <input class='reason' type='text' v-model='ban_reason' placeholder='Enter a reason'>
      <Button class='confirm' :label="user.punishments.banned ? 'Unban' : 'Ban'" :background-color="user.punishments.banned ? 'rgba(51, 142, 255, 1)' : 'rgba(200, 39, 33, 1)'" @click="swapPunishment('ban')" />
    </div>
  </div>
  <div class='punishment'>
    <div class='info'>
      <div>Muted: {{ user.punishments.muted}}</div>
      <div class='until' v-if='user.punishments.muted && user.punishments.mute_end_date'>
        Until: {{ new Date(user.punishments.mute_end_date).toLocaleDateString("en-US") }}
        {{ new Date(user.punishments.mute_end_date).toLocaleTimeString("en-US") }}
      </div>
    </div>
    <div class='options'>
      <input class='reason' type='text' v-model='mute_reason' placeholder='Enter a reason'>
      <Button class='confirm' :label="user.punishments.muted ? 'Unmute' : 'Mute'" :background-color="user.punishments.muted ? 'rgba(51, 142, 255, 1)' : 'rgba(200, 39, 33, 1)'" @click="swapPunishment('mute')" />
    </div>
  </div>
  <div class='punishment'>
    <div class='info'>
      Withdraw blocked: {{ user.withdraw_blocked}}
    </div>
    <Button @click='withdrawBlock' class='confirm_block' :label="user.withdraw_blocked ? 'Unblock' : 'Block'" :background-color="user.withdraw_blocked  ? 'rgba(51, 142, 255, 1)' : 'rgba(200, 39, 33, 1)'" />
  </div>
</div>
</template>

<script>
import Button from '@/components/Button'
import { useToast } from 'vue-toastification'
export default {
  name: 'Punishments',
  components: { Button },
  emits: ['updateUser', 'reloadUser'],
  props: {
    user: {
      type: Object,
    },
  },
  data() {
    return {
      banned: {type: Boolean},
      ban_reason: {type: String},
      muted: {type: Boolean},
      mute_reason: {type: String}
    }
  },
  setup() {
    const toast = useToast();
    return {toast}
  },
  mounted() {
    this.ban_reason = this.user.punishments.banned ? this.user.punishments.ban_reason || '' : ''
    this.mute_reason = this.user.punishments.muted ? this.user.punishments.mute_reason || '' : ''
  },
  methods: {
    async swapPunishment(type) {
      if ((this.user.punishments.banned && type === 'ban') || (this.user.punishments.muted && type === 'mute')) {
        if(type === 'ban') this.$emit('updateUser', 'punishments.banned', false)
        if(type === 'mute') this.$emit('updateUser', 'punishments.muted', false)
      } else {
        const res = await fetch((process.env.VUE_APP_MODE === 'production' ? process.env.VUE_APP_API_URL : process.env.VUE_APP_API_URL_DEV) + "/user/" + type, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ steamID: this.user.steamID, reason: this.ban_reason })
        })
        let response = await res.json();
        if (!response.success) {
          this.toast.error(response.message);
        } else {
          if (response.data.success || response.data.updated) {
            this.toast.success('Success: User punished!')
            this.$emit('reloadUser', this.user.steamID)
          }
        }
      }
    },
    withdrawBlock() {
      this.$emit('updateUser', 'withdraw_blocked', !this.user.withdraw_blocked)
    }
  }
}
</script>

<style scoped>
.punishments {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

.punishment {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

.info {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  gap: 1em;
}

.options {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.until {
  font-size: 14px;
}

.reason {
  width: 65%;
}

.confirm {
  width: 30%;
}

.confirm_block {
  width: 100%;
  height: 25px;
}


</style>