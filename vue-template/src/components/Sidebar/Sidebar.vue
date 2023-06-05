<!-- this is the part that diesplay the button on the left side of the screen -->
<template>
  <nav
    :class="{sidebar: true}"
  >
    <header class="logo">
      <router-link to="/app/companies">
        <img src="@/assets/icons/logo-yif-blanc-1.png" alt="Logo"/>
      </router-link>
    </header>

    <ul class="nav">
      <NavLink
        header="Companies"
        link="/app/companies"
        iconName="flaticon-home-3"
        index="companies"
        isHeader
      />
      <NavLink
        header="Contacts"
        link="/app/contacts"
        iconName="flaticon-home-3"
        index="contacts"
        isHeader
      />
      <!-- <NavLink
        header="Tables"
        link="/app/tables"
        iconName="flaticon-home-3"
        index="tables"
        isHeader
      /> -->
    </ul>
  </nav>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import NavLink from './NavLink/NavLink';

export default {
  name: 'Sidebar',
  components: { NavLink },
  methods: {
    ...mapActions('layout', ['changeSidebarActive', 'switchSidebar']),
    setActiveByRoute() {
      const paths = this.$route.fullPath.split('/');
      paths.pop();
      this.changeSidebarActive(paths.join('/'));
    },
  },
  created() {
    this.setActiveByRoute();
  },
  computed: {
    ...mapState('layout', {
      sidebarOpened: state => !state.sidebarClose,
      activeItem: state => state.sidebarActiveElement,
    }),
  },
};
</script>

<!-- Sidebar styles should be scoped -->
<style src="./Sidebar.scss" lang="scss" scoped>

</style>
