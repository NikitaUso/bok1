import { createRouter, createWebHistory } from 'vue-router'
import FlashcardsView from '../views/FlashcardsView.vue'
import ViewTwo from '../views/ViewTwo.vue'
import ViewThree from '../views/ViewThree.vue'
import ViewFour from '../views/ViewFour.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'flashcards',
      component: FlashcardsView,
    },
    {
      path: '/tva',
      name: 'two',
      component: ViewTwo,
    },
    {
      path: '/tre',
      name: 'three',
      component: ViewThree,
    },
    {
      path: '/fyra',
      name: 'four',
      component: ViewFour,
    },
  ],
})

export default router
