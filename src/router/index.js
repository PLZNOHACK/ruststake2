import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Tradeoffer from "@/views/Tradeoffer";
import History from "@/views/History";
import Stats from "@/views/Stats";
import Autobet from "@/views/Autobet";
import Finance from "@/views/Finance";
import Affiliates from "@/views/Affiliates";
import Users from "@/views/Users";
import Prices from "@/views/Prices";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/stats",
    name: "Stats",
    component: Stats,
  },
  {
    path: "/tradeoffer",
    name: "Tradeoffer",
    component: Tradeoffer,
  },
  {
    path: "/history",
    name: "History",
    component: History,
  },
  {
    path: "/storage",
    name: "Storage",
    component: Autobet,
  },
  {
    path: "/finance",
    name: "Finance",
    component: Finance,
  },
  {
    path: "/affiliates",
    name: "Affiliates",
    component: Affiliates,
  },
  {
    path: "/users/:steamID?",
    name: "Users",
    component: Users,
  },
  {
    path: "/prices",
    name: "Prices",
    component: Prices,
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
