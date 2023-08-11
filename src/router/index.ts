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
  /* {
    path: '/domains',
    name: 'List Domains',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/Domains/DomainsView.vue'),
    props: { moduleName: 'List Domains' },
  }, */
  {
    path: '/domains',
    props: { moduleName: 'Domain Designer' },
    component: () => import('@/views/Domains/ModuleDrawer.vue'),
    children: [
        { 
          path: 'list',
          name: 'List Domains',
          component: () => import('@/views/Domains/ModuleList.vue'),
          props: { childName: 'List Domains', icon: 'mdi-table' },
        },
        { 
          path: 'new',
          name: 'New Domain',
          component: () => import('@/views/Domains/ModuleAddEdit.vue'),
          props: { childName: 'New Domain', icon: 'mdi-ballot' },
        }, 
    ]
  },
  {
    path: '/profile',
    name: 'My Profile',
    component: () => import('@/views/MyProfileView.vue'),
    props: { moduleName: 'My Profile' },
  },
  {
    path: '/about',
    name: 'about',
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
