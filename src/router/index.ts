import { createRouter, createWebHistory } from 'vue-router'
import WorkTimeView from '@/views/WorkTimeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'WorkTimeView',
      component: WorkTimeView,
    },
  ],
})

export default router
