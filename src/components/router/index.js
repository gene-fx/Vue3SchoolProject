import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/HomeView.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/Alunos",
    name: "Alunos",
    component: () =>
      import(/* webpackChunkName: "alunos" */ "../views/AlunosView.vue"),
  },
  {
    path: "/Professores",
    name: "Professores",
    component: () =>
      import(
        /* webpackChunkName: "professores" */ "../views/ProfessoresView.vue"
      ),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
