<!-- The 'template' section defines the structure of this Sidebar component. -->
<template>
  <!-- A 'nav' HTML element is used to wrap navigation links, usually located in header or footer. -->
  <!-- The :class directive allows you to dynamically toggle classes -->
  <nav :class="{sidebar: true}">
    <!-- The 'header' HTML element is used to contain introductory and navigational information. -->
    <header class="logo">
      <!-- 'router-link' is used for navigational links that automatically generates the 'href' attribute -->
      <!-- When clicked, the app's view changes to the '/app/companies' route -->
      <router-link to="/app/companies">
        <!-- An 'img' HTML element is used to embed an image in the document. -->
        <img src="@/assets/icons/logo-yif-blanc-1.png" alt="Logo"/>
      </router-link>
    </header>

    <!-- 'ul' HTML element represents an unordered list of items. -->
    <ul class="nav">
      <!-- NavLink is a custom component that's used to represent each link in the navigation. -->
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
      <!-- Currently commented out link for 'Tables' -->
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
// Import 'vuex' mapState and mapActions helper functions.
// These make it easier to interact with the Vuex store.
import { mapState, mapActions } from 'vuex';
// Import the NavLink component
import NavLink from './NavLink/NavLink';

export default {
  name: 'Sidebar', // Define the component name
  components: { NavLink }, // Register NavLink as a subcomponent
  methods: {
    // Map the 'layout' Vuex module's 'changeSidebarActive' and 'switchSidebar' actions to local methods
    ...mapActions('layout', ['changeSidebarActive', 'switchSidebar']),
    setActiveByRoute() {
      // Get the current route's fullPath, split it by '/', remove the last path segment, and then join it again
      const paths = this.$route.fullPath.split('/');
      paths.pop();
      // Call the 'changeSidebarActive' action with the updated path
      this.changeSidebarActive(paths.join('/'));
    },
  },
  created() {
    // Call 'setActiveByRoute' when the component is created
    this.setActiveByRoute();
  },
  computed: {
    // Map the 'layout' Vuex module's 'sidebarClose' and 'sidebarActiveElement' state properties to local computed properties
    ...mapState('layout', {
      // Get the opposite value of 'sidebarClose' (i.e., whether the sidebar is opened)
      sidebarOpened: state => !state.sidebarClose,
      // Get the current active sidebar element
      activeItem: state => state.sidebarActiveElement,
    }),
  },
};
</script>

<!-- Import a scoped SCSS stylesheet named 'Sidebar.scss'. -->
<!-- The 'scoped' attribute limits the styles to this component only. -->
<style src="./Sidebar.scss" lang="scss" scoped/>