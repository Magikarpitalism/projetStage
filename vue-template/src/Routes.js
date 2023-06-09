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

// Use the Router functionality in this Vue instance. 
Vue.use(Router);

// Export a new Router instance. 
export default new Router({
  // Set the mode to 'hash' to include the # symbol in the URL for simulated pages/URLs.
  mode: 'hash',

  // Define the routes for the application.
  routes: [
    {
      // The 'path' is the URL where the route will be active.
      path: '/login',
      // The 'name' is a unique identifier for the route.
      name: 'Login',
      // The 'component' is the Vue component that will be displayed when this route is active.
      component: Login,
    },
    // Similar blocks for 'error', 'app' paths, etc. as explained above.
    {
      path: '/app',
      name: 'Layout',
      component: Layout,

      // The 'children' array is used for nested routes. These routes will be active when the parent route ('/app') is active.
      children: [
        {
          path: '/app/companies',
          name: 'Companies',
          component: Companies,
          
          // 'beforeEnter' is a navigation guard. This function runs before the route is entered.
          beforeEnter: (to, from, next) => {
            // Fetches a token from the local storage. This is often used for authentication.
            const token = window.localStorage.getItem('authenticated');
            
            // If no token is present or token is 'false', redirect to login page.
            if (!token || token === 'false') {
              next('/login');
            } else {
              next(); // If authenticated, proceed to the route.
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
    // A catch-all route for non-defined routes. '*' will match everything. If none of the above routes are matched, this route will be used.
    {
      path: '*',
      name: 'Error',
      component: ErrorPage,
    },
  ],
});
