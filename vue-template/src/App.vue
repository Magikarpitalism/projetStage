<template>
  <router-view />
</template>

<script>
window.addEventListener('error', function (event) {
  console.error('Uncaught error:', event.error);
});
export default {
  name: 'App',
  created() {
    const currentPath = this.$router.history.current.path;

    if (window.localStorage.getItem('authenticated') === 'false') {
      this.$router.push('/login'); // redirect to login page if not authenticated
    }

    if (currentPath === '/' || currentPath === '/app') {
      this.$router.push('/login');
    }
  },
};
</script>

<style src="./styles/theme.scss" lang="scss" />
