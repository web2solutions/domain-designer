import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
// import DomainsView from '../views/DomainsView.vue'

export const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardView,
    props: { moduleName: 'Dashboard' },
  },
  {
    path: '/domains',
    name: 'List Domains',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/DomainsView.vue'),
    props: { moduleName: 'List Domains' },
  },
  {
    path: '/domain-new',
    name: 'New Domain',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/DomainNewView.vue'),
    props: { moduleName: 'New Domain' },
  },
  {
    path: '/profile',
    name: 'My Profile',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/MyProfileView.vue'),
    props: { moduleName: 'My Profile' },
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/AboutView.vue')
  },
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'is-active router-link-active',
  routes,
})

export default router
