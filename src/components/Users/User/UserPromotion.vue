<template>
  <div v-if='user && user.name_bonus_status' class='UserPromotion'>
    <div class='status'>
      <div>Name:
        <span class='bool-true' v-if='user.name_bonus_status.active'>TRUE</span>
        <span class='bool-false' v-else>FALSE</span>
      </div>
      <div>Avatar:
        <span class='bool-true' v-if='user.name_bonus_status.avatarActive'>TRUE</span>
        <span class='bool-false' v-else>FALSE</span>
      </div>
    </div>
    <div v-if='active'>Active Since: {{ new Date(user.name_bonus_status.activeSince).toLocaleString() }}</div>
    <div v-if='active'>Last Check: {{ new Date(user.name_bonus_status.lastDisableCheck).toLocaleString() }}</div>
    <div v-if='active'>Days Active: {{ user.name_bonus_status.daysActive }}</div>
  </div>
</template>

<script>
export default {
  name: 'UserPromotion',
  props: {
    user: {
      type: Object,
    },
  },
  data() {
    return {
      active: {default: false, type: Boolean}
    }
  },
  mounted() {
    this.active = this.user.name_bonus_status.active && this.user.name_bonus_status.avatarActive;
  },
}
</script>

<style scoped>
.UserPromotion {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 0.5em;
}

.status {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 2em;
}

.bool-true {
  font-weight: bold;
  color: #41FF68;
}

.bool-false {
  font-weight: bold;
  color: #F83C63;
}
</style>