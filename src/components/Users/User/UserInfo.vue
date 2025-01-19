<template>
  <div class='userInfo'>
    <img class='avatar' :src='user.photo'  alt='avatar'/>
    <div class='details'>
      <div class='name'>
        <span class='username'>{{user.name}}</span>
        <select v-model='role' @change='changeRole'>
          <option disabled value=""></option>
          <option value='admin'>Admin</option>
          <option value='mod'>Mod</option>
          <option value='helper'>Helper</option>
          <option value='verified'>Verified</option>
          <option value='user'>User</option>
        </select>
      </div>
      <div class='steamID'>
        <a target=”_blank” :href="'http://steamcommunity.com/profiles/' + user.steamID">{{user.steamID}}</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserInfo',
  emits: ['updateUser'],
  props: {
    user: {
      type: Object,
    },
  },
  watch: {
    user: {
      handler: function(val) {
        this.role = val.role;
      },
      deep: true,
    },
  },
  data() {
    return {
      role: ''
    }
  },
  mounted() {
    this.role = this.user.role
  },
  methods: {
    changeRole() {
      this.$emit('updateUser', 'role', this.role)
    }
  }
}
</script>

<style scoped>
.userInfo {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.avatar {
  height: 5em;
  border-radius: 12px;
}

.details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.2em;
  padding: 0 0.7em;
}

.name {
  font-weight: bold;
  font-size: 20px;
  display: flex;
  gap: 0.3em;
  align-items: center;
  justify-content: center;
}

.username {
  text-overflow: ellipsis;
  max-width: 7em;
  overflow: hidden;
  white-space: nowrap;
}

a {
  text-decoration: none;
  color: white;
}
</style>