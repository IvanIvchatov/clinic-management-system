import { createWebHistory, createRouter } from "vue-router";
import Home from './components/Home'
import Login from './components/Login'
import Clients from './components/pages/Clients'
import Descriptions from './components/pages/Descriptions'
import Services from './components/pages/Services'
import Collaborator from './components/pages/Collaborator'
import Salary from './components/pages/Salary'
import Settings from './components/pages/Settings'
import CashBox from './components/pages/Сashbox'
import store from './store'
import guest from './middleware/guest'
import auth from './middleware/auth'

const routes = [
  {
    path: '/', component: Home,
    redirect: '/clients',
    children: [
      {
        path: 'clients',
        component: Clients,
        meta: {
          middleware: [
            auth
          ]
        }
      },
      {
        path: 'descriptions',
        component: Descriptions,
        meta: {
          middleware: [
            auth
          ]
        }
      },
      {
        path: 'services',
        component: Services,
        meta: {
          middleware: [
            auth
          ]
        }
      },
      {
        path: 'employers',
        component: Collaborator,
        meta: {
          middleware: [
            auth
          ]
        }
      },
      {
        path: 'salary',
        component: Salary,
        meta: {
          middleware: [
            auth
          ]
        }
      },
      {
        path: 'cashbox',
        component: CashBox,
        meta: {
          middleware: [
            auth
          ]
        }
      },
      {
        path: 'settings',
        component: Settings,
        meta: {
          middleware: [
            auth
          ]
        }
      },
    ]
  },
  {
    path: '/login', component: Login,
    meta: {
      middleware: [
        guest
      ]
    }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (!to.meta.middleware) {
      return next()
  }
  const middleware = to.meta.middleware
  const context = {
      to,
      from,
      next,
      store
  }
  return middleware[0]({
      ...context
  })
})

export default router;
