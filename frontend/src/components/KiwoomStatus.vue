<template>
  <v-chip :color="statusColor" :text-color="textColor" small class="px-3">
    <v-icon left small>{{ statusIcon }}</v-icon>
    <span class="font-weight-medium">{{ statusText }}</span>
  </v-chip>
</template>

<script>
import { kiwoomApi } from "@/api/kiwoom";

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
    textColor() {
      return "white";
    },
    statusIcon() {
      return this.isConnected ? "mdi-check-circle" : "mdi-alert-circle";
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
        const response = await kiwoomApi.getTokenStatus();
        this.isConnected = response.data.data.is_connected;
      } catch (error) {
        console.error("키움 상태 조회 실패:", error);
        this.isConnected = false;
      }
    },
  },
};
</script>
