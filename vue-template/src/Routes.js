// this is the router file for the application and it is used to define the routes for the application and the components that are rendered for each route
// the routes are defined in the routes array and each route has a path, name and component
import Vue from 'vue';
import Router from 'vue-router';

import Layout from '@/components/Layout/Layout';
import Login from '@/pages/Login/Login';
import ErrorPage from '@/pages/Error/Error';

import Companies from '@/components/Companies';
import Contacts from '@/components/Contacts';
import Tables from '@/components/Tables';

Vue.use(Router);

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/error',
      name: 'Error',
      component: ErrorPage,
    },
    {
      path: '/app',
      name: 'Layout',
      component: Layout,
      children: [
        {
          path: '/app/companies',
          name: 'Companies',
          component: Companies,
          beforeEnter: (to, from, next) => {
            const token = window.localStorage.getItem('authenticated'); // get token from local storage to check if logged in
            if (!token || token === 'false') { // if not logged in redirect to login
              next('/login');
            } else {
              next();
            }
          },
        },
        {
          path: '/app/contacts',
          name: 'Contacts',
          component: Contacts,
          beforeEnter: (to, from, next) => {
            const token = window.localStorage.getItem('authenticated');
            if (!token || token === 'false') {
              next('/login');
            } else {
              next();
            }
          },
        },
        {
          path: '/app/tables',
          name: 'Tables',
          component: Tables,
        },
      ],
    },
    {
      path: '*',
      name: 'Error',
      component: ErrorPage,
    },
  ],
});
