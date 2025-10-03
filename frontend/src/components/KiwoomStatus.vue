<template>
  <div class="d-flex align-center">
    <v-icon
      :color="statusColor"
      :small="$vuetify.breakpoint.smAndDown"
      class="mr-2"
    >
      mdi-circle
    </v-icon>
    <span
      :class="$vuetify.breakpoint.smAndDown ? 'text-caption' : 'text-body-1'"
      class="font-weight-medium"
    >
      {{ statusText }}
    </span>
  </div>
</template>

<script>
import { kiwoomStatus } from "@/api/kiwoom";

export default {
  name: "KiwoomStatus",

  data() {
    return {
      isConnected: false,
    };
  },

  computed: {
    statusColor() {
      return this.isConnected ? "success" : "error";
    },
    statusText() {
      return this.isConnected ? "키움 연결됨" : "키움 연결 안 됨";
    },
  },

  mounted() {
    this.checkStatus();
  },

  methods: {
    async checkStatus() {
      try {
        const response = await kiwoomStatus.getTokenStatus();
        this.isConnected = response.data.data.is_connected;
      } catch (error) {
        console.error("키움 상태 조회 실패:", error);
        this.isConnected = false;
      }
    },
  },
};
</script>
