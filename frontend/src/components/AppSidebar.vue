<template>
  <v-navigation-drawer
    :value="value"
    @input="$emit('input', $event)"
    app
    clipped
    :temporary="$vuetify.breakpoint.smAndDown"
    :permanent="$vuetify.breakpoint.mdAndUp"
    width="240"
  >
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

export default {
  name: "AppSidebar",

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
