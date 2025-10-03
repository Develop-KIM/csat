<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <scheduler-status />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import SchedulerStatus from "@/components/SchedulerStatus.vue";

export default {
  name: "Dashboard",

  components: {
    SchedulerStatus,
  },
};
</script>
