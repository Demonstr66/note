import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home.vue")
  },
  {
    path: "/note/:id",
    name: "Note",
    component: () => import("../views/Note.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  routes
});

export default router;
