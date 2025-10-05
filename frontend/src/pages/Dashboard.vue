<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <scheduler-status />

        <AccountBalance class="mt-4" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import SchedulerStatus from "@/components/SchedulerStatus.vue";
import AccountBalance from "@/components/AccountBalance.vue";

export default {
  name: "Dashboard",

  components: {
    SchedulerStatus,
    AccountBalance,
  },
};
</script>
