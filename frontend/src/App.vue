<template>
  <v-app>
    <app-header @toggle-drawer="drawer = !drawer" />
    <app-sidebar v-model="drawer" />
    <v-main>
      <v-container fluid>
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
