import { createWebHistory, createRouter } from "vue-router";
import Home from './components/Home'
import Login from './components/Login'
import Dashboard from './components/pages/Dashboard'
import Clients from './components/pages/Clients'
import Services from './components/pages/Services'
import Staff from './components/pages/Staff'
import Centers from './components/pages/Centers'
import store from './store'
import guest from './middleware/guest'
import auth from './middleware/auth'

const page = (path, component, title, subtitle) => ({
  path, component, meta: { middleware: [auth], title, subtitle },
});

const routes = [
  {
    path: '/', component: Home,
    redirect: '/dashboard',
    children: [
      page('dashboard', Dashboard, 'Dashboard', 'Overview of your clinic network'),
      page('clients', Clients, 'Clients', 'Client records and contact details'),
      page('services', Services, 'Services', 'Price list and service catalog'),
      page('staff', Staff, 'Staff', 'Specialists working in your centers'),
      page('centers', Centers, 'Centers', 'Locations of your clinic network'),
    ]
  },
  { path: '/login', component: Login, meta: { middleware: [guest] } },
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

const router = createRouter({ history: createWebHistory(), routes });

router.beforeEach((to, from, next) => {
  if (!to.meta.middleware) return next();
  return to.meta.middleware[0]({ to, from, next, store });
});

export default router;
