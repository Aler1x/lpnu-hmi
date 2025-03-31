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
  },
  {
    path: '/evacuate',
    name: 'Evacuate',
    component: () => import('@/views/Evacuate.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // @ts-expect-error
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router 