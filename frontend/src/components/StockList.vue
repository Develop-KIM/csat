<!-- components/StockList.vue -->
<template>
  <v-card class="stock-list">
    <v-card-title class="d-flex justify-space-between align-center">
      <span
        :class="$vuetify.breakpoint.smAndDown ? 'text-subtitle-1' : 'text-h6'"
      >
        보유 종목
      </span>
      <v-chip small color="primary" outlined>
        {{ stocks.length }}개 보유
      </v-chip>
    </v-card-title>

    <v-card-text>
      <v-simple-table v-if="stocks.length > 0">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">종목명</th>
              <th class="text-right">보유수량</th>
              <th class="text-right">매입가</th>
              <th class="text-right">현재가</th>
              <th class="text-right">평가금액</th>
              <th class="text-right">평가손익</th>
              <th class="text-right">수익률</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="stock in stocks" :key="stock.stockCode">
              <td>
                <div>
                  <div class="font-weight-bold">{{ stock.stockName }}</div>
                  <div class="text-caption grey--text">
                    {{ stock.stockCode }}
                  </div>
                </div>
              </td>
              <td class="text-right">{{ formatNumber(stock.quantity) }}주</td>
              <td class="text-right">
                ₩{{ formatNumber(stock.purchasePrice) }}
              </td>
              <td class="text-right">
                ₩{{ formatNumber(stock.currentPrice) }}
              </td>
              <td class="text-right">
                ₩{{ formatNumber(stock.evaluationAmount) }}
              </td>
              <td
                class="text-right"
                :class="getProfitClass(stock.evaluationProfit)"
              >
                {{ formatProfit(stock.evaluationProfit) }}
              </td>
              <td class="text-right" :class="getProfitClass(stock.profitRate)">
                {{ formatProfitRate(stock.profitRate) }}
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>

      <div v-else class="text-center pa-8 grey--text">
        보유 중인 종목이 없습니다.
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "StockList",

  props: {
    stocks: {
      type: Array,
      default: () => [],
    },
  },

  methods: {
    formatNumber(value) {
      return parseInt(value).toLocaleString();
    },

    formatProfit(value) {
      const num = parseInt(value);
      return `₩${num.toLocaleString()}`;
    },

    formatProfitRate(value) {
      const num = parseFloat(value);
      const sign = num > 0 ? "+" : "";
      return `${sign}${num.toFixed(2)}%`;
    },

    getProfitClass(value) {
      const num = parseFloat(value);
      if (num > 0) return "profit--text";
      if (num < 0) return "loss--text";
      return "neutral--text";
    },
  },
};
</script>

<style scoped>
.stock-list {
  margin: 16px 0;
}

.profit--text {
  color: #f44336;
  font-weight: bold;
}

.loss--text {
  color: #2196f3;
  font-weight: bold;
}

.neutral--text {
  color: rgba(0, 0, 0, 0.87);
}

.theme--dark .neutral--text {
  color: rgba(255, 255, 255, 0.87);
}

@media (max-width: 960px) {
  .v-data-table >>> th,
  .v-data-table >>> td {
    font-size: 12px;
    padding: 8px 4px;
  }
}
</style>
