<template>
  <v-app>
    <v-app-bar app color="primary" dark elevation="2">
      <v-toolbar-title class="font-weight-bold"> CSAT </v-toolbar-title>
      <v-spacer></v-spacer>
      <kiwoom-status class="mr-2" />
      <theme-toggle />
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import KiwoomStatus from "@/components/KiwoomStatus.vue";
import ThemeToggle from "@/components/ThemeToggle.vue";

export default {
  name: "App",
  components: {
    KiwoomStatus,
    ThemeToggle,
  },
};
</script>
