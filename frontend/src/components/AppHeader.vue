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
        <v-col cols="auto">
          <v-toolbar-title
            :class="$vuetify.breakpoint.smAndDown ? 'text-body-1' : 'text-h6'"
            class="font-weight-bold"
          >
            CSAT
          </v-toolbar-title>
        </v-col>

        <v-spacer></v-spacer>

        <v-col cols="auto" v-if="$vuetify.breakpoint.mdAndUp">
          <div class="px-6 py-3 d-flex align-center">
            <kiwoom-status />
            <v-divider vertical class="mx-4 divider-custom"></v-divider>
            <theme-toggle />
          </div>
        </v-col>

        <!-- 모바일: 햄버거 버튼만 표시 (오른쪽) -->
        <v-col cols="auto" v-if="$vuetify.breakpoint.smAndDown">
          <v-app-bar-nav-icon
            @click="$emit('toggle-drawer')"
          ></v-app-bar-nav-icon>
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
