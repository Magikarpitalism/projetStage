<template>
  <!-- The <router-view> component is a placeholder that gets replaced by the component matching the current path. -->
  <router-view />
</template>

<script>
// Add a global error listener to the window object. This will log any uncaught errors to the console.
window.addEventListener('error', function (event) {
  console.error('Uncaught error:', event.error);
});

export default {
  // Set the name of this Vue component.
  name: 'App',

  // The 'created' lifecycle hook runs after the instance has been created.
  created() {
    // Get the current path of the router.
    const currentPath = this.$router.history.current.path;

    // If the user is not authenticated, redirect them to the login page.
    // We determine this by checking if the 'authenticated' item in local storage is 'false'.
    if (window.localStorage.getItem('authenticated') === 'false') {
      this.$router.push('/login');
    }

    // If the current path is '/' or '/app', redirect the user to the login page.
    if (currentPath === '/' || currentPath === '/app') {
      this.$router.push('/login');
    }
  },
};
</script>

<style src="./styles/theme.scss" lang="scss" />
<!-- Import a SCSS stylesheet named 'theme.scss'. The 'lang' attribute specifies that the styling language is SCSS. -->