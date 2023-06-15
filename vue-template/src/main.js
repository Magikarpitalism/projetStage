// this is the main entry point of our application and it is defined in src\main.js, it work by importing the Vue library and the App component and then creating a new Vue instance and passing in the App component as the render function
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import Toasted from 'vue-toasted';
import VCalendar from 'v-calendar';
import VueApexCharts from 'vue-apexcharts';
import VModal from 'vue-js-modal';
import Modal from '@/components/modal';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import store from './store';
import router from './Routes';
import App from './App';
import layoutMixin from './mixins/layout';

// Import the Companies and Contacts components
import Companies from './components/Companies.vue';
import Contacts from './components/Contacts.vue';
// import Tables from './components/Tables.vue';

Vue.use(BootstrapVue);
Vue.use(VCalendar, {
  firstDayOfWeek: 2
});

Vue.component('apexchart', VueApexCharts);
Vue.mixin(layoutMixin);
Vue.use(Toasted, {duration: 10000});
Vue.use(VModal)

// Register the Companies and Contacts components
Vue.component('Companies', Companies);
Vue.component('Contacts', Contacts);
// Vue.component('Tables', Tables);
Vue.component('Modal', Modal);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
});
