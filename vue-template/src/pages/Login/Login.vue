<template>
  <!-- Create a div element with the class 'auth-page' -->
  <div class="auth-page">
    <!-- 'b-container' is a BootstrapVue component for a responsive fixed-width container -->
    <b-container>
      <!-- 'Widget' is a custom component with its own structure and functionality -->
      <Widget class="widget-auth mx-auto" title="<h3 class='mt-0'>Login to your Web App</h3>" customHeader>
        <!-- A form with the submit event being intercepted by Vue.js, preventing the default form submission behavior -->
        <form class="mt" @submit.prevent="performLogin">
          <!-- 'b-alert' is a BootstrapVue component for contextual feedback messages. 
            It's being displayed only if 'errorMessage' is truthy (i.e., it exists and is not empty) -->
          <b-alert class="alert-sm" variant="danger" :show="!!errorMessage">
            <!-- The text content of the alert box is the error message -->
            {{errorMessage}}
          </b-alert>
          <!-- 'b-form-group' is a BootstrapVue component grouping form controls with a label -->
          <b-form-group label="login" label-for="login">
            <!-- 'b-input-group' is a BootstrapVue component for grouping a series of buttons/addons and an input -->
            <b-input-group>
              <b-input-group-text slot="prepend"><i class="la la-user text-white"></i></b-input-group-text>
              <!-- An input element, with two-way data binding with the 'login' data property -->
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
              <!-- An input element, with two-way data binding with the 'api_key' data property -->
              <input id="api_key"
                v-model="api_key"
                class="form-control input-transparent pl-3"
                type="password"
                required
                placeholder="api_key"/>
            </b-input-group>
          </b-form-group>
          <!-- 'b-button' is a BootstrapVue component for clickable buttons -->
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
    <!-- The 'footer' HTML element is used to contain information about the document or a section -->
    <footer class="auth-footer">
      Light Blue Vue Admin Dashboard Template - Made by <a href="https://flatlogic.com" target="_blank">Flatlogic</a>
    </footer>
  </div>
</template>

<script>
// Import the 'Widget' component and the 'axios' library
import Widget from '@/components/Widget/Widget';
import axios from 'axios';

// Setting 'withCredentials' to true enables cross-site Access-Control requests to be made using credentials like cookies and headers
axios.defaults.withCredentials = true;

export default {
  name: 'LoginPage', // Define the component name
  components: { Widget }, // Register 'Widget' as a subcomponent
  data() {
    return {
      errorMessage: null, // Initialize the error message to null
      login: null, // Initialize the login input field to null
      api_key: null // Initialize the api_key input field to null
    };
  },
  methods: {
    async performLogin() {
      try {
        console.log("login:", this.login, "api_key:", this.api_key);
        // Send a POST request to the authentication endpoint
        const response = await axios.post('http://localhost:5000/api/token', {
          login: this.login,
          api_key: this.api_key
        }, {
          headers: {
            'Content-Type': 'application/json' // Specify the content type of the request
          }
        });

        console.log('Response:', response);

        // Extract the token from the response data
        const token = response.data.access_token;
        // Store the token in local storage
        window.localStorage.setItem('authenticated', token);
        // Set the default Authorization header for all future Axios requests
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
        // Navigate to the '/app/companies' route
        this.$router.push('/app/companies');
      } catch (error) {
        console.error("Error getting JWT token:", error.response && error.response.data);
        console.error("Server error:", error.response && error.response.data && error.response.data.detail);
        // Set the error message, defaulting to "Error getting JWT token." if no detailed message is provided
        this.errorMessage = (error.response && error.response.data && error.response.data.detail) || "Error getting JWT token.";
        return;
      }
    },
  },
};
</script>