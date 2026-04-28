import { createRouter, createWebHistory } from "vue-router";
import HomeMain from "../components/main/HomeMain.vue";
import LinksMain from "../components/main/LinksMain.vue";
import ex1 from "../components/exercise/ex1.vue";
import ex1_colab from "../components/exercise/ex1_colab.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeMain,
  },
  {
    path: "/links",
    name: "links",
    component: LinksMain,
  },
  {
    path: "/ex1",
    name: "ex1",
    component: ex1,
  },
    {
    path: "/ex1_colab",
    name: "ex1_colab",
    component: ex1_colab,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;