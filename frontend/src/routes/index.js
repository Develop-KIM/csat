import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

export const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/",
      redirect: "/dashboard",
    },
    {
      path: "/dashboard",
      name: "Dashboard",
      component: () => import("@/pages/Dashboard.vue"),
    },
    {
      path: "/condition-search",
      name: "ConditionSearch",
      component: () => import("@/pages/ConditionSearch.vue"),
    },
  ],
});
