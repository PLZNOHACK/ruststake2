<template>
  <div class="main">
    <div v-if="usersLoaded && users" class="dropdown">
      <select v-model="selectedUser">
        <option v-for="(user, index) in users" :key="index" :value="user" class="userButton">{{user.personaname}} ({{user.steamid}})</option>
      </select>
    </div>
    <div v-if="selectedUser" class="permissions">
      <div class="permission">
        <input v-model="selectedUser.permissions.manage_access" type="checkbox" id="manageaccess">
        <label for="manageaccess">Manage Access</label>
      </div>
      <div class="permission">
        <input v-model="selectedUser.permissions.manage_bots" type="checkbox" id="managebots">
        <label for="managebots">Manage Bots</label>
      </div>
      <div class="permission">
        <input v-model="selectedUser.permissions.manage_partners" type="checkbox" id="managepartners">
        <label for="managepartners">Manage Partners</label>
      </div>
      <div class="permission">
        <input v-model="selectedUser.permissions.send_partner" type="checkbox" id="sendpartner" name="sendpartner" value="sendpartner">
        <label for="sendpartner">Send Partners</label>
      </div>
      <div class="permission">
        <input v-model="selectedUser.permissions.send_custom" type="checkbox" id="sendcustom" name="sendcustom" value="sendcustom">
        <label for="sendcustom">Send Custom</label>
      </div>
      <div class="permission">
        <input v-model="selectedUser.permissions.view_history" type="checkbox" id="viewhistory" name="viewhistory" value="viewhistory">
        <label for="viewhistory">View History</label>
      </div>
      <div class="permission">
        <input v-model="selectedUser.permissions.access_finance" type="checkbox" id="accessfinance" name="accessfinance" value="accessfinance">
        <label for="accessfinance">Access Finance</label>
      </div>
      <div class="permission">
        <input v-model="selectedUser.permissions.access_stats" type="checkbox" id="accessstats" name="accessstats" value="accessstats">
        <label for="accessstats">Access Stats</label>
      </div>
      <div class="permission">
        <input v-model="selectedUser.permissions.access_affiliates" type="checkbox" id="accessaffiliates" name="accessaffiliates" value="accessaffiliates">
        <label for="accessaffiliates">Access Affiliates</label>
      </div>
      <div class="permission">
        <input v-model="selectedUser.permissions.access_users" type="checkbox" id="accessusers" name="accessusers" value="accessusers">
        <label for="accessusers">Access Users</label>
      </div>
      <div class="permission">
        <input v-model="selectedUser.permissions.access_prices" type="checkbox" id="accessprices" name="accessprices" value="accessprices">
        <label for="accessprices">Access Prices</label>
      </div>
      <div class="permission">
        <input v-model="selectedUser.permissions.manage_users" type="checkbox" id="manageusers" name="manageusers" value="manageusers">
        <label for="manageusers">Manage Users</label>
      </div>
      <div class="permission">
        <input v-model="selectedUser.permissions.manage_backpack" type="checkbox" id="managebackpack" name="managebackpack" value="managebackpack">
        <label for="managebackpack">Manage Backpack</label>
      </div>
      <div class="permission">
        <input v-model="selectedUser.permissions.manage_offers" type="checkbox" id="manageoffers" name="manageoffers" value="manageoffers">
        <label for="manageoffers">Manage Offers</label>
      </div>
      <div class="permission">
        <input v-model="selectedUser.permissions.access_pushing" type="checkbox" id="accesspushing" name="accesspushing" value="accesspushing">
        <label for="accesspushing">Access Pushing</label>
      </div>
      <div class="permission">
        <input v-model="selectedUser.permissions.update_pushing" type="checkbox" id="updatepushing" name="updatepushing" value="updatepushing">
        <label for="updatepushing">Update Pushing</label>
      </div>
      <div class="permission">
        <input v-model="selectedUser.permissions.update_balance" type="checkbox" id="updatebalance" name="updatebalance" value="updatebalance">
        <label for="updatebalance">Update Balance</label>
      </div>
      <div class="permission">
        <input v-model="selectedUser.permissions.update_role" type="checkbox" id="updaterole" name="updaterole" value="updaterole">
        <label for="updaterole">Update Role</label>
      </div>
    </div>
    <Button v-if="selectedUser" class="updatePermissionsButton" label="Update Permissions" @click="updateUser"/>
  </div>
</template>
<script>
import {useToast, TYPE} from "vue-toastification";
import Button from "@/components/Button";

export default {
  name: "UsersDropdown",
  components: {
    Button
  },
  setup() {
    const toast = useToast();
    return {toast}
  },
  data() {
    return {
      usersLoaded: false,
      users: [],
      selectedUser: null,
    }
  },
  methods: {
    async updateUser() {
      const res = await fetch((process.env.VUE_APP_MODE === 'production' ? process.env.VUE_APP_API_URL : process.env.VUE_APP_API_URL_DEV) + "/users/update", {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({user: this.selectedUser})
      })
      let response = await res.json();
      this.toast(response.message, {type: response.success ? TYPE.SUCCESS : TYPE.ERROR});
    },
    async loadUsers() {
      const res = await fetch((process.env.VUE_APP_MODE === 'production' ? process.env.VUE_APP_API_URL : process.env.VUE_APP_API_URL_DEV) + "/users", {
        credentials: 'include',
      })
      try {
        let response = await res.json()
        if (response.success === true) {
          this.users = response.users;
          this.usersLoaded = true;
        } else {
          this.toast.error(response.message);
        }
      } catch (e) {
        console.log(e)
      }
    }
  },
  async mounted() {
    await this.loadUsers();
  }
}
</script>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.dropdown {
  width: 100%;
  height: 20%;
}

select {
  color: white;
  border-radius: 7px;
  width: 100%;
  height: 100%;
  background: #1e242b;
  border: solid 2px #2d333c;
}

.permissions {
  display: grid;
  overflow: auto;
  grid-template-columns: 1fr 1fr;
  height: 63%;
  margin: 1% 0;
}

.permission {
  display: flex;
  align-items: center;
  height: 2em;
}

.updatePermissionsButton {
  height: 15%;
  width: 100%;
}
</style>
