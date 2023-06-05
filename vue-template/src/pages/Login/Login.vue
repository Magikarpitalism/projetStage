<template>
  <div class="auth-page">
    <b-container>
      <Widget class="widget-auth mx-auto" title="<h3 class='mt-0'>Login to your Web App</h3>" customHeader>
        <form class="mt" @submit.prevent="performLogin">
          <b-alert class="alert-sm" variant="danger" :show="!!errorMessage">
            {{errorMessage}}
          </b-alert>
          <b-form-group label="login" label-for="login">
            <b-input-group>
              <b-input-group-text slot="prepend"><i class="la la-user text-white"></i></b-input-group-text>
              <input id="login"
                v-model="login"
                class="form-control input-transparent pl-3"
                type="login"
                required
                placeholder="login"/>
            </b-input-group>
          </b-form-group>
          <b-form-group label="api_key" label-for="api_key">
            <b-input-group>
              <b-input-group-text slot="prepend"><i class="la la-lock text-white"></i></b-input-group-text>
              <input id="api_key"
                v-model="api_key"
                class="form-control input-transparent pl-3"
                type="password"
                required
                placeholder="api_key"/>
            </b-input-group>
          </b-form-group>
          <div class="bg-widget auth-widget-footer">
            <b-button type="submit" variant="danger" class="auth-btn" size="sm">
              <span class="auth-btn-circle">
                <i class="la la-caret-right"></i>
              </span>
              Login
            </b-button>
            <br>
          </div>
        </form>
      </Widget>
    </b-container>
    <footer class="auth-footer">
      Light Blue Vue Admin Dashboard Template - Made by <a href="https://flatlogic.com" target="_blank">Flatlogic</a>
    </footer>
  </div>
</template>

<script>
import Widget from '@/components/Widget/Widget';
import axios from 'axios';

axios.defaults.withCredentials = true;

export default {
  name: 'LoginPage',
  components: { Widget },
  data() {
    return {
      errorMessage: null,
      login: null, 
      api_key: null
    };
  },
  methods: {
    async performLogin() {
      try {
        console.log("login:", this.login, "api_key:", this.api_key);
        // Request to the authentication endpoint
        const response = await axios.post('http://localhost:5000/api/token', {
          login: this.login,
          api_key: this.api_key
        }, {
  headers: {
    'Content-Type': 'application/json' // <-- Specifying the Content-Type
  }
});
console.log('Response:', response);

      // Save the returned token
      const token = response.data.access_token;
      window.localStorage.setItem('authenticated', token); //use of the local storage to store the token in the browser memory
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token; //set the token in the header of the axios request 
      this.$router.push('/app/companies');
      } catch (error) {
        console.error("Error getting JWT token:", error.response && error.response.data);
        console.error("Server error:", error.response && error.response.data && error.response.data.detail);
        this.errorMessage = (error.response && error.response.data && error.response.data.detail) || "Error getting JWT token.";
        return;
  }
    },
  },
};
</script>