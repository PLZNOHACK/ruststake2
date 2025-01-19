import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";
import VueSocketIO from "vue-3-socket.io";
import SocketIO from "socket.io-client";
import vfmPlugin from "vue-final-modal";
import tooltip from "./directives/tooltip.js";
import "@/assets/tooltip.css";


require("dotenv").config();

const app = createApp(App);

app.use(store).use(router).mount("#app");

const toastOptions = {
  position: POSITION.BOTTOM_RIGHT,
};
app.use(Toast, toastOptions);

app.directive("tooltip", tooltip);

const socketOptions = {
  withCredentials: true,
  upgrade: false,
  transports: ["websocket"],
};

let vueSocketIO = new VueSocketIO({
  debug: process.env.VUE_APP_MODE !== "production",
  connection: SocketIO(
    process.env.VUE_APP_MODE === "production"
      ? process.env.VUE_APP_SOCKET_URL
      : process.env.VUE_APP_SOCKET_URL_DEV,
    socketOptions
  ),
  vuex: {
    store,
    actionPrefix: "SOCKET_",
    mutationPrefix: "SOCKET_",
  },
});

app.use(vueSocketIO);
app.use(vfmPlugin);
