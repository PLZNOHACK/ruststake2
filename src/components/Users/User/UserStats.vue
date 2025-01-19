<template>
<div class='userStats'>
  <div class='last_login'>Last login: {{ user.user_stats.last_login.substr(0, user.user_stats.last_login.indexOf(','))  }}</div>
  <div class='last_os'>Last OS: {{ user.user_stats.last_os }}</div>
  <div class='browser'>Browser: {{ user.user_stats.browser }}</div>
  <div class='last_ip'>Last IP: {{ user.user_stats.last_ip }}</div>
</div>
</template>

<script>
export default {
  name: 'UserStats',
  props: {
    user: {
      type: Object,
    },
  },
}
</script>

<style scoped>
.userStats {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>