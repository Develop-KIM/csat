<template>
  <v-card class="account-balance">
    <v-card-title class="d-flex justify-space-between align-center">
      <span
        :class="$vuetify.breakpoint.smAndDown ? 'text-subtitle-1' : 'text-h6'"
      >
        계좌 정보
      </span>
      <span class="text-caption grey--text">
        마지막 업데이트: {{ lastUpdated }}
      </span>
    </v-card-title>

    <v-card-text>
      <v-row>
        <v-col cols="12" sm="4">
          <div class="balance-card">
            <div class="d-flex align-center justify-space-between mb-2">
              <span class="balance-label">예수금</span>
              <v-icon color="blue lighten-2">mdi-cash</v-icon>
            </div>
            <div class="balance-value">₩{{ formatNumber(balance) }}</div>
          </div>
        </v-col>

        <v-col cols="12" sm="4">
          <div class="balance-card">
            <div class="d-flex align-center justify-space-between mb-2">
              <span class="balance-label">주문가능</span>
              <v-icon color="green lighten-2">mdi-cart</v-icon>
            </div>
            <div class="balance-value">₩{{ formatNumber(orderAvailable) }}</div>
          </div>
        </v-col>

        <v-col cols="12" sm="4">
          <div class="balance-card">
            <div class="d-flex align-center justify-space-between mb-2">
              <span class="balance-label">평가손익</span>
              <v-icon :color="profitIconColor">{{ profitIcon }}</v-icon>
            </div>
            <div class="balance-value" :class="profitClass">
              {{ formatProfit(profit) }}
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { kiwoomStatus } from "@/api/kiwoom";

export default {
  name: "AccountBalance",

  data() {
    return {
      balance: "0",
      orderAvailable: "0",
      profit: "0",
      lastUpdated: "-",
      loading: false,
      interval: null,
    };
  },

  computed: {
    profitClass() {
      const num = parseInt(this.profit);
      if (num > 0) return "profit--text";
      if (num < 0) return "loss--text";
      return "neutral--text";
    },

    profitIcon() {
      const num = parseInt(this.profit);
      if (num > 0) return "mdi-trending-up";
      if (num < 0) return "mdi-trending-down";
      return "mdi-minus";
    },

    profitIconColor() {
      const num = parseInt(this.profit);
      if (num > 0) return "profit";
      if (num < 0) return "loss";
      return "neutral";
    },
  },

  mounted() {
    this.fetchBalance();
    this.interval = setInterval(() => {
      this.fetchBalance();
    }, 30000);
  },

  beforeDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  },

  methods: {
    async fetchBalance() {
      this.loading = true;
      try {
        const response = await kiwoomStatus.getDepositDetail();

        this.balance = response.data.data.balance;
        this.orderAvailable = response.data.data.orderAvailable;
        this.profit = response.data.data.profit;
        this.lastUpdated = new Date().toLocaleTimeString("ko-KR");
      } catch (error) {
        console.error("계좌 정보 조회 실패:", error);
      } finally {
        this.loading = false;
      }
    },

    formatNumber(value) {
      return parseInt(value).toLocaleString();
    },

    formatProfit(value) {
      const num = parseInt(value);
      return `₩${Math.abs(num).toLocaleString()}`;
    },
  },
};
</script>

<style scoped>
.account-balance {
  margin: 16px 0;
}

.balance-card {
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fafafa;
}

.balance-label {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.6);
}

.balance-value {
  font-size: 18px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.87);
}

.theme--dark .balance-label {
  color: rgba(255, 255, 255, 0.7);
}

.theme--dark .balance-value {
  color: rgba(255, 255, 255, 0.95);
}

.theme--dark .balance-card {
  background-color: #1e1e1e;
  border-color: #424242;
}

@media (max-width: 960px) {
  .balance-card {
    padding: 12px;
    margin-bottom: 8px;
  }

  .balance-label {
    font-size: 12px;
  }

  .balance-value {
    font-size: 16px;
  }
}
</style>
