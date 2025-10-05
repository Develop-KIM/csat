<template>
  <v-app-bar
    app
    clipped-left
    color="primary"
    dark
    flat
    :height="$vuetify.breakpoint.smAndDown ? 60 : 100"
  >
    <v-container fluid :class="$vuetify.breakpoint.smAndDown ? 'px-4' : 'px-8'">
      <v-row align="center">
        <v-col cols="auto" v-if="$vuetify.breakpoint.smAndDown">
          <v-app-bar-nav-icon
            @click="$emit('toggle-drawer')"
            class="mr-2"
          ></v-app-bar-nav-icon>
        </v-col>

        <v-col cols="auto">
          <v-toolbar-title
            :class="$vuetify.breakpoint.smAndDown ? 'text-body-1' : 'text-h6'"
            class="font-weight-bold"
          >
            CSAT
          </v-toolbar-title>
        </v-col>

        <v-spacer></v-spacer>

        <v-col cols="auto">
          <div
            :class="$vuetify.breakpoint.smAndDown ? 'px-2 py-1' : 'px-6 py-3'"
            class="d-flex align-center"
          >
            <kiwoom-status />
            <v-divider
              vertical
              :class="$vuetify.breakpoint.smAndDown ? 'mx-2' : 'mx-4'"
              class="divider-custom"
            ></v-divider>
            <theme-toggle />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script>
import KiwoomStatus from "@/components/KiwoomStatus.vue";
import ThemeToggle from "@/components/ThemeToggle.vue";

export default {
  name: "AppHeader",

  components: {
    KiwoomStatus,
    ThemeToggle,
  },
};
</script>

<style>
.divider-custom {
  color: rgba(255, 255, 255, 0.3);
}
</style>
