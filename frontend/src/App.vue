<!-- App.vue -->
<template>
  <v-app>
    <app-header @toggle-drawer="drawer = !drawer" />
    <app-sidebar v-model="drawer" />
    <v-main class="d-flex flex-column">
      <v-container fluid class="flex-grow-1">
        <router-view />
      </v-container>
    </v-main>
    <app-footer />
  </v-app>
</template>

<script>
import AppHeader from "@/components/AppHeader.vue";
import AppSidebar from "@/components/AppSidebar.vue";
import AppFooter from "@/components/AppFooter.vue";

export default {
  name: "App",

  components: {
    AppHeader,
    AppSidebar,
    AppFooter,
  },

  data() {
    return {
      drawer: true,
    };
  },
};
</script>

<style>
.v-main {
  min-height: 100vh;
}

@media (max-width: 960px) {
  .v-main {
    min-height: calc(100vh - 60px) !important;
  }
}
</style>
