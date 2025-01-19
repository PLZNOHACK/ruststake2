<template>
  <div v-if="!loggedIn" class="login">
    <LoginButton />
  </div>
  <div class="main" v-else>
    <Header :user="user" />
    <div class="content">
      <router-view :user="user" />
    </div>
  </div>
</template>

<script>
import LoginButton from "@/components/LoginButton";
import Header from "@/components/Header";

export default {
  components: {
    Header,
    LoginButton
  },
  data () {
    return {
      loggedIn: Boolean,
      user: {
        type: Object,
        default: null,
      },
    }
  },
  created() {
    document.title = `${process.env.VUE_APP_SITE_NAME} | Admin Panel`
  },
  async mounted() {
    await this.isLoggedIn();
  },
  methods: {
    async isLoggedIn() {
      const res = await fetch((process.env.VUE_APP_MODE === 'production' ? process.env.VUE_APP_API_URL : process.env.VUE_APP_API_URL_DEV) + "/loggedin", {
        credentials: 'include',
      })
      try {
        let response = await res.json()
        this.loggedIn = response.auth;
        this.user = response.user;
      } catch (e) {
        console.log(e.message)
      }
    },
  },
}
</script>

<style>
@media only screen and (max-width: 900px) {

  .content {
    overflow: scroll !important;
  }

  .profits {
    flex-direction: column !important;
  }

  .profitChart {
    width: 100% !important;
    margin: 7% 0;
    padding: 0 !important;
  }

  .bots {
    grid-template-columns: repeat(1, 1fr) !important;
    width: 100% !important;
  }

  .otherControls {
    display: none !important;
  }

  .workspace {
    flex-direction: column !important;
  }
  .refreshButton {
    width: 20% !important;
  }

  .statsItem {
    font-size: 14px !important;
    margin-bottom: 3% !important;
    width: 100% !important;
  }

  .stats {
    margin-top: 3% !important;
    height: auto !important;
    flex-direction: column !important;
  }

  .statsButton {
    width: 9% !important;
    height: 80% !important;
    font-size: 16px !important;
  }

  .statsAmount {
    font-size: 15px !important;
  }

  .subSectionTitle {
    font-size: 16px !important;
  }

  .partnersSectionTitleText {
    font-size: 16px !important;
  }

  .home {
    height: auto !important;
  }

  .mainContent {
    top: 0 !important;
    overflow: auto !important;
  }

  .permissions {
    margin: 3% 0;
  }

  .subSection {
    width: 100% !important;
    margin-bottom: 4% !important;
  }

  .mobileGraph {
    height: 70% !important;
  }

  .chartButton {
    width: 10% !important;
  }

  .notifications {
    width: 70% !important;
    left: 28% !important;
  }

  .partnersSectionTitle {
    font-size: 10px !important;
    margin-top: 10%;
  }

  .controlSection {
    display: flex;
    top: 6%;
    flex-direction: column;
    height: 100% !important;
  }

  .sendCustomButton {
    height: 1.5em !important;
    margin-top: 2.5% !important;
  }

  .updatePermissionsButton {
    height: 1.5em !important;
    margin-top: 2.5% !important;
  }

  .menu {
    margin-left: 0 !important;
  }

  .menuItem {
    margin: 0 !important;
    padding: 0 2% !important;
  }

  .items {
    margin-top: 5% !important;
    font-size: 9px !important;
  }

  .tradeurl {
    font-size: 7px;
  }

  .addBotFinalButton {
    height: 1.5em !important;
    margin-top: 2.5% !important;
  }

  .addBotButton {
    width: 5em !important;
  }

  .partnerAddButton {
    width: 30% !important;
  }

  .sendButton {
    width: 70% !important;
  }

  .removeButton {
    width: 35% !important;
  }

  .balances {
    flex-direction: column !important;
  }

  .balance {
    margin-top: 1em !important;
  }

  .balanceWrapper {
    width: 100% !important;
  }

  .cashouts {
    grid-template-columns: repeat(1, 1fr) !important;
  }

  .grid {
    display: flex !important;
    overflow-y: scroll !important;
    flex-direction: column;
  }

  body {
    font-size: 12px;
  }
}

#app {
  width: 100%;
  height: 100%;
  display: flex;
  font-family: 'Roboto', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #fff;
}

html {
  height: 100%;
}

#page {
  overflow: auto;
}

body {
  height: 100%;
  background: #15171B;
  margin: 0;
}

input {
  color: white;
  background-color: #1E242B;
  border: solid 2px #2d333c;
  border-radius: 7px;
  display: flex;
  text-align: center;
  align-items: center;
}

select {
  color: white;
  border-radius: 7px;
  background: #1e242b;
  border: solid 2px #2d333c;
  display: flex;
  text-align: center;
  align-items: center;
}

canvas {
  padding: 0 !important;
}

.content {
  margin-top: 5vh;
  height: 95vh;
}

.main {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.login {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

::-webkit-scrollbar {
  width: 0.5em;
}

::-webkit-scrollbar-thumb {
  background-color: #1e242b;
  border-radius: 0.5em;
}

::-webkit-scrollbar-corner {
  /*
  background-image: url(resources/corner.png);
  background-repeat: no-repeat;
  */
  background: transparent;
}

.notifications {
  position: fixed;
  left: 78%;
  bottom: 3%;
  width: 20%;
}
</style>
