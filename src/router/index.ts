import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw }  from 'vue-router';
import DashboardView from '../views/DashboardView.vue'
import { useEntitiesStore } from '@/stores';
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
    path: '/infrastructure',
    props: { moduleName: 'Infrastructure', icon: 'mdi-alpha-e-box' },
    name: 'Infrastructure',
    component: () => import('@/views/Infrastructure/ModuleDrawer.vue'),
    children: [
      { 
        path: 'schemas/list',
        name: 'Schema Components',
        component: () => import('@/views/Infrastructure/Schemas/ModuleList.vue'),
        props: { childName: 'Schema Components', icon: 'mdi-table' },
      },
      { 
        path: 'schemas/create',
        name: 'New Schema',
        component: () => import('@/views/Infrastructure/Schemas/ModuleAddEdit.vue'),
        props: { childName: 'New Schema', icon: 'mdi-ballot' },
      }, 
      { 
        path: 'schemas/update/:id',
        name: 'Update Schema',
        component: () => import('@/views/Infrastructure/Schemas/ModuleAddEdit.vue'),
        props: { childName: 'Update Schema', icon: 'mdi-pencil' },
      },
      { 
        path: 'schemas/overview/:id',
        name: 'Schema Overview',
        component: () => import('@/views/Infrastructure/Schemas/SchemaOverview.vue'),
        props: { childName: 'Schema Overview', icon: 'mdi-ballot' },
      }
    ]
  },
  {
    path: '/apis',
    props: { moduleName: 'API Designer', icon: 'mdi-pencil-ruler' },
    name: 'API Designer',
    component: () => import('@/views/Domains/ModuleDrawer.vue'),
    children: [
        { 
          path: 'import',
          name: 'Import OAS API',
          component: () => import('@/views/API/APIIMporter.vue'),
          props: { childName: 'Import OAS API', icon: 'mdi-table' },
        },
    ]
  },
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
          props: { childName: 'Update Domain', icon: 'mdi-pencil' },
        },
        { 
          path: 'overview/:id',
          name: 'Domain Overview',
          component: () => import('@/views/Domains/DomainOverview.vue'),
          props: { childName: 'Domain Overview', icon: 'mdi-ballot' },
        },
        { 
          path: 'entity/:id/properties/list',
          name: 'Edit Entity properties',
          component: () => import('@/views/Entities/EntityOverview.vue'),
          props: { childName: 'Edit Entity properties', icon: 'mdi-pencil' },
        },
        // 
    ]
  },
  {
    path: '/entities',
    props: { moduleName: 'Entities', icon: 'mdi-alpha-e-box' },
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
          props: { childName: 'Update Entity', icon: 'mdi-pencil' },
        },
        { 
          path: 'overview/:id',
          name: 'Entity Overview',
          component: () => import('@/views/Entities/EntityOverview.vue'),
          props: { childName: 'Entity Overview', icon: 'mdi-ballot' },
        },
        { 
          path: 'coder/:id',
          name: 'Etity IDE',
          component: () => import('@/views/Entities/ModuleCoder.vue'),
          props: { childName: 'Entity IDE', icon: 'mdi-pencil' },
        }
    ]
  },
  {
    path: '/properties',
    props: { moduleName: 'Properties', icon: 'mdi-alpha-e-box' },
    name: 'Properties',
    component: () => import('@/views/Properties/ModuleDrawer.vue'),
    children: [
        { 
          path: 'list',
          name: 'List Properties',
          component: () => import('@/views/Properties/ModuleList.vue'),
          props: { childName: 'List Properties', icon: 'mdi-table' },
        },
        { 
          path: 'create',
          name: 'New Property',
          component: () => import('@/views/Properties/ModuleAddEdit.vue'),
          props: { childName: 'New Property', icon: 'mdi-ballot' },
        }, 
        { 
          path: 'update/:id',
          name: 'Update Property',
          component: () => import('@/views/Properties/ModuleAddEdit.vue'),
          props: { childName: 'Update Property', icon: 'mdi-pencil' },
        },
        { 
          path: 'overview/:id',
          name: 'Property Overview',
          component: () => import('@/views/Properties/PropertyOverview.vue'),
          props: { childName: 'Property Overview', icon: 'mdi-ballot' },
        }
    ]
  },
  {
    path: '/changes',
    props: { moduleName: 'History', icon: 'mdi-alpha-e-box' },
    name: 'History',
    component: () => import('@/views/DataEvents/ModuleDrawer.vue'),
    children: [
        { 
          path: 'list',
          name: 'List History',
          component: () => import('@/views/DataEvents/ModuleList.vue'),
          props: { childName: 'List History', icon: 'mdi-table' },
        },
        { 
          path: 'overview/:id',
          name: 'Component Change Overview',
          component: () => import('@/views/DataEvents/DataEventOverview.vue'),
          props: { childName: 'Component Change Overview', icon: 'mdi-ballot' },
        }
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
  }, 
  { 
    name: 'wildcard', 
    path: '/:pathMatch(.*)*', 
    redirect: '/',
    props: { moduleName: 'wildcard', icon: 'mdi-account-box-outline' }
  }*/
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'is-active router-link-active',
  routes: routes as RouteRecordRaw[],
});


router.beforeEach(async (to, from) => {
  const entityStore = useEntitiesStore();
  console.log(to.path);
  if(to.path === '/entities/create' || to.path === '/properties/create' || (to.path as string).indexOf('/entities/coder/') > -1 ) {
      console.log(from.path)
      if(from.path.toString().indexOf('domains/overview')) {
        // back to verview
        entityStore.goTo = from.path;
      }
  }
});

export default router
