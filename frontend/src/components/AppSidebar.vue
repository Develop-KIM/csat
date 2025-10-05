<template>
  <v-navigation-drawer
    :value="value"
    @input="$emit('input', $event)"
    app
    clipped
    :temporary="$vuetify.breakpoint.smAndDown"
    :permanent="$vuetify.breakpoint.mdAndUp"
    :right="$vuetify.breakpoint.smAndDown"
    width="280"
  >
    <div
      v-if="$vuetify.breakpoint.smAndDown"
      class="pa-4 d-flex align-center justify-space-between"
    >
      <span class="text-h6 font-weight-bold">메뉴</span>
      <v-btn icon @click="$emit('input', false)">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>

    <v-divider v-if="$vuetify.breakpoint.smAndDown"></v-divider>

    <div v-if="$vuetify.breakpoint.smAndDown" class="pa-4">
      <div class="d-flex align-center justify-space-between mb-3">
        <span class="text-caption grey--text">시스템 상태</span>
      </div>
      <div class="d-flex align-center justify-space-between">
        <kiwoom-status />
        <theme-toggle />
      </div>
    </div>

    <v-divider v-if="$vuetify.breakpoint.smAndDown"></v-divider>

    <template v-for="(group, index) in menuConfig">
      <v-divider
        v-if="index > 0"
        :key="`divider-${index}`"
        class="my-2"
      ></v-divider>

      <v-subheader
        v-if="group.section"
        :key="`header-${index}`"
        class="text-caption"
      >
        {{ group.section }}
      </v-subheader>

      <v-list
        :key="`list-${index}`"
        :dense="group.section !== null"
        :class="group.section === null ? 'pt-2' : ''"
      >
        <v-list-item
          v-for="item in group.items"
          :key="item.title"
          :to="item.to"
          link
          :class="group.section === null ? 'mb-1' : ''"
          @click="$vuetify.breakpoint.smAndDown && $emit('input', false)"
        >
          <v-list-item-icon class="mr-3">
            <v-icon :color="item.color" :size="group.section ? 20 : 24">
              {{ item.icon }}
            </v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="text-body-2">
              {{ item.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script>
import { menuConfig } from "@/routes/menuConfig";
import KiwoomStatus from "@/components/KiwoomStatus.vue";
import ThemeToggle from "@/components/ThemeToggle.vue";

export default {
  name: "AppSidebar",

  components: {
    KiwoomStatus,
    ThemeToggle,
  },

  props: {
    value: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      menuConfig,
    };
  },
};
</script>

<style scoped>
.v-list-item--active {
  background-color: var(--v-secondary-base);
}

.v-list-item--active .v-list-item__title {
  color: var(--v-primary-base);
  font-weight: 600;
}

.v-list-item--active .v-icon {
  color: var(--v-primary-base) !important;
}
</style>
