import Vue from 'vue'
import VueRouter from 'vue-router'
import Meta from 'vue-meta';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import Outages from '../views/Outages.vue';
import OrgList from '../views/OrgList.vue';
import OrgInfo from '../views/OrgInfo.vue';
import EnergyEfficiency from '../views/EnergyEfficiency.vue';
import Realty from '../views/Realty.vue';
import Overhaul from '@/views/Overhaul.vue';
import OverhaulIndex from '@/views/Overhaul/Index';
import JobsTypes from '@/views/Overhaul/JobsTypes';
import ContributionHistory from '@/views/Overhaul/ContributionHistory';
import Entrances from '@/views/Overhaul/Entrances';
import CollectionRate from '@/views/Overhaul/CollectionRate';
import AccountsReceivable from '@/views/Overhaul/AccountsReceivable';
import Ventilation from '@/views/Ventilation';
// import VentilationIndex from '@/views/Ventilation/Index';
import VentilationCondition from '@/views/Ventilation/VentilationCondition';
import VentilationInput from "@/views/Ventilation/VentilationInput";
import VentilationOutput from "@/views/Ventilation/VentilationOutput";
import VentilationСhimneys from "@/views/Ventilation/VentilationСhimneys";
import UserSettings from '../views/UserSettings.vue';

Vue.use(VueRouter)
Vue.use(Meta)

const routes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/outages',
    name: 'Outages',
    component: Outages
  },
  {
    path: '/orglist',
    name: 'OrgList',
    component: OrgList
  },
  {
    path: '/organization',
    name: 'OrgInfo',
    component: OrgInfo,
    props: true
  },
  {
    path: '/energy-efficiency',
    name: 'EnergyEfficiency',
    component: EnergyEfficiency
  },
  {
    path: '/realty',
    name: 'Realty',
    component: Realty
  },
  {
    path: '/overhaul',
    component: Overhaul,
    children: [
      {
        path: '',
        name: 'Overhaul',
        component: OverhaulIndex,
      },
      {
        path: 'jobs-types',
        name: 'JobsTypes',
        component: JobsTypes,
      },
      {
        path: 'contribution-history',
        name: 'ContributionHistory',
        component: ContributionHistory,
      },
      {
        path: 'entrances',
        name: 'Entrances',
        component: Entrances,
      },
      {
        path: 'collection-rate',
        name: 'CollectionRate',
        component: CollectionRate,
      },
      {
        path: 'accounts-receivable',
        name: 'AccountsReceivable',
        component: AccountsReceivable,
      },
    ],
  },
  {
    path: '/ventilation',
    name: 'Ventilation',
    component: Ventilation,
    children: [
      {
        path: 'chimneys',
        name: 'VentilationСhimneys',
        component: VentilationСhimneys,
      },
      {
        path: 'condition',
        name: 'VentilationCondition',
        component: VentilationCondition,
        redirect: { name: 'VentilationInput' },
        children: [
          {
            path: 'input',
            name: 'VentilationInput',
            component: VentilationInput,
          },
          {
            path: 'output',
            name: 'VentilationOutput',
            component: VentilationOutput,
          },
        ]
      }
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/user-settings',
    name: 'UserSettings',
    component: UserSettings
  },
  {
    path: '*',
    redirect: "/outages",
  }
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
})

const openRoutes = ['Login', 'ResetPassword']; // not auth
const freeRoutes = []; // for all

router.beforeEach((to, from, next) => {
    if (localStorage.token && localStorage.isAuth && openRoutes.includes(to.name)) {
        router.push('/');
    } else if ((localStorage.token && localStorage.isAuth) || openRoutes.includes(to.name) || freeRoutes.includes(to.name)) {
        next();
    } else {
        router.push({'name': 'Login'});
    }
})

export default router
