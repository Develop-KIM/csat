<!-- components/PortfolioSummary.vue -->
<template>
  <v-card class="portfolio-summary">
    <v-card-title class="d-flex justify-space-between align-center">
      <span
        :class="$vuetify.breakpoint.smAndDown ? 'text-subtitle-1' : 'text-h6'"
      >
        포트폴리오 요약
      </span>
    </v-card-title>

    <v-card-text>
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <div class="summary-card">
            <div class="d-flex align-center justify-space-between mb-2">
              <span class="summary-label">총 매입금액</span>
              <v-icon color="blue lighten-2">mdi-shopping</v-icon>
            </div>
            <div class="summary-value">
              ₩{{ formatNumber(totalPurchaseAmount) }}
            </div>
          </div>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <div class="summary-card">
            <div class="d-flex align-center justify-space-between mb-2">
              <span class="summary-label">총 평가금액</span>
              <v-icon color="green lighten-2">mdi-chart-line</v-icon>
            </div>
            <div class="summary-value">
              ₩{{ formatNumber(totalEvaluationAmount) }}
            </div>
          </div>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <div class="summary-card">
            <div class="d-flex align-center justify-space-between mb-2">
              <span class="summary-label">총 평가손익</span>
              <v-icon :color="profitIconColor">{{ profitIcon }}</v-icon>
            </div>
            <div class="summary-value" :class="profitClass">
              {{ formatProfit(totalProfitLoss) }}
            </div>
          </div>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <div class="summary-card">
            <div class="d-flex align-center justify-space-between mb-2">
              <span class="summary-label">수익률</span>
              <v-icon :color="profitIconColor">{{ profitIcon }}</v-icon>
            </div>
            <div class="summary-value" :class="profitClass">
              {{ formatProfitRate(totalProfitRate) }}
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "PortfolioSummary",

  props: {
    totalPurchaseAmount: {
      type: String,
      default: "0",
    },
    totalEvaluationAmount: {
      type: String,
      default: "0",
    },
    totalProfitLoss: {
      type: String,
      default: "0",
    },
    totalProfitRate: {
      type: String,
      default: "0",
    },
  },

  computed: {
    profitClass() {
      const num = parseFloat(this.totalProfitRate);
      if (num > 0) return "profit--text";
      if (num < 0) return "loss--text";
      return "neutral--text";
    },

    profitIcon() {
      const num = parseFloat(this.totalProfitRate);
      if (num > 0) return "mdi-trending-up";
      if (num < 0) return "mdi-trending-down";
      return "mdi-minus";
    },

    profitIconColor() {
      const num = parseFloat(this.totalProfitRate);
      if (num > 0) return "profit";
      if (num < 0) return "loss";
      return "neutral";
    },
  },

  methods: {
    formatNumber(value) {
      return parseInt(value).toLocaleString();
    },

    formatProfit(value) {
      const num = parseInt(value);
      const sign = num > 0 ? "+" : "";
      return `${sign}₩${num.toLocaleString()}`;
    },

    formatProfitRate(value) {
      const num = parseFloat(value);
      const sign = num > 0 ? "+" : "";
      return `${sign}${num.toFixed(2)}%`;
    },
  },
};
</script>

<style scoped>
.portfolio-summary {
  margin: 16px 0;
}

.summary-card {
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fafafa;
}

.summary-label {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.6);
}

.summary-value {
  font-size: 18px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.87);
}

.profit--text {
  color: #f44336;
}

.loss--text {
  color: #2196f3;
}

.neutral--text {
  color: rgba(0, 0, 0, 0.87);
}

.theme--dark .summary-label {
  color: rgba(255, 255, 255, 0.7);
}

.theme--dark .summary-value {
  color: rgba(255, 255, 255, 0.95);
}

.theme--dark .summary-card {
  background-color: #1e1e1e;
  border-color: #424242;
}

@media (max-width: 960px) {
  .summary-card {
    padding: 12px;
  }

  .summary-label {
    font-size: 12px;
  }

  .summary-value {
    font-size: 16px;
  }
}
</style>
