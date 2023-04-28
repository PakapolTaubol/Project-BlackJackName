import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import BlackJack from "../views/BlackJack.vue";
const history = createWebHistory()
const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/blackjack',
        name: 'BlackJack',
        component: BlackJack
    }
]
const router = createRouter({ history, routes })
export default router