import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw }  from 'vue-router';
import DashboardView from '../views/DashboardView.vue'
// import DomainsView from '../views/DomainsView.vue'

export const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardView,
    props: { moduleName: 'Dashboard', icon: 'mdi-monitor-dashboard' },
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
    props: { moduleName: 'Domain Designer', icon: 'mdi-pencil-ruler' },
    name: 'Domain Designer',
    component: () => import('@/views/Domains/ModuleDrawer.vue'),
    children: [
        { 
          path: 'list',
          name: 'List Domains',
          component: () => import('@/views/Domains/ModuleList.vue'),
          props: { childName: 'List Domains', icon: 'mdi-table' },
        },
        { 
          path: 'create',
          name: 'New Domain',
          component: () => import('@/views/Domains/ModuleAddEdit.vue'),
          props: { childName: 'New Domain', icon: 'mdi-ballot' },
        }, 
        { 
          path: 'update/:id',
          name: 'Update Domain',
          component: () => import('@/views/Domains/ModuleAddEdit.vue'),
          props: { childName: 'Update Domain', icon: 'mdi-ballot' },
        },
        { 
          path: 'overview/:id',
          name: 'Domain Overview',
          component: () => import('@/views/Domains/DomainOverview.vue'),
          props: { childName: 'Domain Overview', icon: 'mdi-ballot' },
        },
        // 
    ]
  },
  {
    path: '/entities',
    props: { moduleName: 'Entities', icon: 'mdi-pencil-ruler' },
    name: 'Entities',
    component: () => import('@/views/Entities/ModuleDrawer.vue'),
    children: [
        { 
          path: 'list',
          name: 'List Entities',
          component: () => import('@/views/Entities/ModuleList.vue'),
          props: { childName: 'List Entities', icon: 'mdi-table' },
        },
        { 
          path: 'create',
          name: 'New Entity',
          component: () => import('@/views/Entities/ModuleAddEdit.vue'),
          props: { childName: 'New Entity', icon: 'mdi-ballot' },
        }, 
        { 
          path: 'update/:id',
          name: 'Update Entity',
          component: () => import('@/views/Entities/ModuleAddEdit.vue'),
          props: { childName: 'Update Entity', icon: 'mdi-ballot' },
        },
        { 
          path: 'overview/:id',
          name: 'Entity Overview',
          component: () => import('@/views/Entities/EntityOverview.vue'),
          props: { childName: 'Entity Overview', icon: 'mdi-ballot' },
        },
        // 
    ]
  },
  {
    path: '/profile',
    name: 'My Profile',
    component: () => import('@/views/MyProfileView.vue'),
    props: { moduleName: 'My Profile', icon: 'mdi-account-box-outline' },
  },
  /** {
    path: '/staff',
    props: { moduleName: 'Staff', icon: 'mdi-account-multiple-outline' },
    name: 'Staff',
    component: () => import('@/views/Domains/ModuleDrawer.vue'),
    children: [
      { 
        path: 'list',
        name: 'List Staff',
        component: () => import('@/views/Domains/ModuleList.vue'),
        props: { childName: 'List Staff', icon: 'mdi-table' },
      },
      { 
        path: 'create',
        name: 'New Staff',
        component: () => import('@/views/Domains/ModuleAddEdit.vue'),
        props: { childName: 'New Staff', icon: 'mdi-ballot' },
      }, 
      { 
        path: 'update/:id',
        name: 'Update Staff',
        component: () => import('@/views/Domains/ModuleAddEdit.vue'),
        props: { childName: 'Update Staff', icon: 'mdi-ballot' },
      }, 
    ]
  },
  {
    path: '/customers',
    props: { moduleName: 'Customers', icon: 'mdi-account-group' },
    name: 'Customers',
    component: () => import('@/views/Domains/ModuleDrawer.vue'),
    children: [
      { 
        path: 'list',
        name: 'List Customers',
        component: () => import('@/views/Domains/ModuleList.vue'),
        props: { childName: 'List Customers', icon: 'mdi-table' },
      },
      { 
        path: 'create',
        name: 'New Customer',
        component: () => import('@/views/Domains/ModuleAddEdit.vue'),
        props: { childName: 'New Customer', icon: 'mdi-ballot' },
      }, 
      { 
        path: 'update/:id',
        name: 'Update Customer',
        component: () => import('@/views/Domains/ModuleAddEdit.vue'),
        props: { childName: 'Update Customer', icon: 'mdi-ballot' },
      }, 
    ]
  },
  {
    path: '/services',
    props: { moduleName: 'Services', icon: 'mdi-basket-outline' },
    name: 'Services',
    component: () => import('@/views/Domains/ModuleDrawer.vue'),
    children: []
  },
  {
    path: '/products',
    props: { moduleName: 'Products', icon: 'mdi-basket-outline' },
    name: 'Products',
    component: () => import('@/views/Domains/ModuleDrawer.vue'),
    children: []
  },
  {
    path: '/suppliers',
    props: { moduleName: 'Suppliers', icon: 'mdi-nature-people' },
    name: 'Suppliers',
    component: () => import('@/views/Domains/ModuleDrawer.vue'),
    children: []
  },
  {
    path: '/orders',
    props: { moduleName: 'Orders', icon: 'mdi-cart' },
    name: 'Orders',
    component: () => import('@/views/Domains/ModuleDrawer.vue'),
    children: []
  },
  {
    path: '/sales',
    props: { moduleName: 'Sales', icon: 'mdi-point-of-sale' },
    name: 'Sales',
    component: () => import('@/views/Domains/ModuleDrawer.vue'),
    children: []
  },
  {
    path: '/pos',
    props: { moduleName: 'Point of Sales', icon: 'mdi-point-of-sale' },
    name: 'Point of Sales',
    component: () => import('@/views/Domains/ModuleDrawer.vue'),
    children: []
  },
  {
    path: '/cash-flow',
    props: { moduleName: 'Cash Flow', icon: 'mdi-point-of-sale' },
    name: 'Cash Flow',
    component: () => import('@/views/Domains/ModuleDrawer.vue'),
    children: []
  },
  {
    path: '/loyalty',
    props: { moduleName: 'Loyalty', icon: 'mdi-point-of-sale' },
    name: 'Loyalty',
    component: () => import('@/views/Domains/ModuleDrawer.vue'),
    children: []
  },
  {
    path: '/risk',
    props: { moduleName: 'Risk', icon: 'mdi-point-of-sale' },
    name: 'Risk',
    component: () => import('@/views/Domains/ModuleDrawer.vue'),
    children: []
  },
  {
    path: '/appointments',
    props: { moduleName: 'Appointments', icon: 'mdi-point-of-sale' },
    name: 'Appointments',
    component: () => import('@/views/Domains/ModuleDrawer.vue'),
    children: []
  }, */
  { 
    name: 'wildcard', 
    path: '/:pathMatch(.*)*', 
    redirect: '/',
    props: { moduleName: 'wildcard', icon: 'mdi-account-box-outline' }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'is-active router-link-active',
  routes: routes as RouteRecordRaw[],
})

export default router
