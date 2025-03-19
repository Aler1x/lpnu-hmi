import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@//views//Home.vue')
  },
  {
    path: '/map',
    name: 'Map',
    component: () => import('@//views//MapView.vue')
  },
  {
    path: '/flood-monitor',
    name: 'FloodMonitor',
    component: () => import('@//views//FloodMonitor.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router 