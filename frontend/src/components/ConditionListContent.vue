<template>
  <v-list two-line>
    <v-alert v-if="conditions.length === 0" type="info" text>
      조건이 없습니다.
    </v-alert>
    <v-list-item-group v-else v-model="selectedIndex" color="primary">
      <v-list-item
        v-for="condition in conditions"
        :key="condition.index"
        @click="$emit('select', condition)"
      >
        <v-list-item-avatar>
          <v-chip small color="primary">{{ condition.index }}</v-chip>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{ condition.name }}</v-list-item-title>
          <v-list-item-subtitle
            >인덱스: {{ condition.index }}</v-list-item-subtitle
          >
        </v-list-item-content>

        <v-list-item-action>
          <v-icon color="grey lighten-1">mdi-chevron-right</v-icon>
        </v-list-item-action>
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<script>
export default {
  name: "ConditionListContent",

  props: {
    conditions: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      selectedIndex: null,
    };
  },
};
</script>
