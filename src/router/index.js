import { createRouter, createWebHistory } from 'vue-router'
import FlashcardsView from '../views/FlashcardsView.vue'
import ViewTwo from '../views/ViewTwo.vue'
import ViewThree from '../views/ViewThree.vue'
import ViewFour from '../views/ViewFour.vue'
import AIGenerator from '@/views/AIGenerator.vue'
import RecoveryValue from '@/views/RecoveryValue.vue'
import ExchangeRates from '@/views/ExchangeRates.vue'
import RSyss from '@/views/RSyss.vue'
import Expenses from '@/views/Expenses.vue'
import PersonnelCosts from '@/views/PersonnelCosts.vue'
import Accruals from '@/views/Accruals.vue'
import NetRealizableValue from '@/views/NetRealizableValue.vue'

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
    {
      path: '/ai',
      name: 'ai',
      component: AIGenerator,
    },
    {
      path: '/extra/atervinningsvarde',
      name: 'recovery',
      component: RecoveryValue,
    },
    {
      path: '/extra/vaxelkurser',
      name: 'exchange-rates',
      component: ExchangeRates,
    },
    {
      path: '/extra/r_syss',
      name: 'r-syss',
      component: RSyss,
    },
    {
      path: '/extra/utgifter',
      name: 'expenses',
      component: Expenses,
    },
    {
      path: '/extra/personalkostnader',
      name: 'personnel-costs',
      component: PersonnelCosts,
    },
    {
      path: '/extra/periodisering',
      name: 'accruals',
      component: Accruals,
    },
    {
      path: '/extra/nettoforsaljningsvarde',
      name: 'net-realizable',
      component: NetRealizableValue,
    },
  ],
})

export default router
