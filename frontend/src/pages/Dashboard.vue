<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <scheduler-status />

        <v-progress-linear
          v-if="loading"
          indeterminate
          color="primary"
          class="mt-4"
        ></v-progress-linear>

        <AccountBalance
          v-if="!loading"
          class="mt-4"
          :balance="dashboardData.deposit.balance"
          :orderAvailable="dashboardData.deposit.orderAvailable"
          :profit="dashboardData.portfolio.totalProfitLoss"
          :lastUpdated="lastUpdated"
        />

        <PortfolioSummary
          v-if="!loading"
          class="mt-4"
          :totalPurchaseAmount="dashboardData.portfolio.totalPurchaseAmount"
          :totalEvaluationAmount="dashboardData.portfolio.totalEvaluationAmount"
          :totalProfitLoss="dashboardData.portfolio.totalProfitLoss"
          :totalProfitRate="dashboardData.portfolio.totalProfitRate"
        />

        <StockList
          v-if="!loading"
          class="mt-4"
          :stocks="dashboardData.portfolio.stocks"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import SchedulerStatus from "@/components/SchedulerStatus.vue";
import AccountBalance from "@/components/AccountBalance.vue";
import PortfolioSummary from "@/components/PortfolioSummary.vue";
import StockList from "@/components/StockList.vue";
import { PortfolioSSE } from "@/services/portfolioSSE";
import { kiwoomStatus } from "@/api/kiwoom";

export default {
  name: "Dashboard",

  components: {
    SchedulerStatus,
    AccountBalance,
    PortfolioSummary,
    StockList,
  },

  data() {
    return {
      dashboardData: {
        deposit: {
          balance: "0",
          orderAvailable: "0",
          profit: "0",
        },
        portfolio: {
          totalPurchaseAmount: "0",
          totalEvaluationAmount: "0",
          totalProfitLoss: "0",
          totalProfitRate: "0",
          stocks: [],
        },
      },
      lastUpdated: "-",
      loading: true,
      error: null,
      portfolioSSE: null,
    };
  },

  async mounted() {
    const initial = await kiwoomStatus.getDashboard();
    this.dashboardData = initial.data.data;
    this.loading = false;

    this.connectSSE();
  },

  beforeDestroy() {
    if (this.portfolioSSE) {
      this.portfolioSSE.disconnect();
    }
  },

  methods: {
    connectSSE() {
      this.portfolioSSE = new PortfolioSSE();

      this.portfolioSSE.connect({
        onInitialData: (data) => {
          console.log("초기 데이터 수신");
          this.dashboardData = data;
          this.lastUpdated = new Date().toLocaleTimeString("ko-KR");
          this.loading = false;
        },

        onDepositUpdate: (data) => {
          console.log("예수금 업데이트");
          this.dashboardData.deposit = data.deposit;
          this.lastUpdated = new Date().toLocaleTimeString("ko-KR");
        },

        onStockUpdate: (data) => {
          console.log("종목 실시간 업데이트:", data.stocks.length, "개");
          this.dashboardData.portfolio.stocks = data.stocks;
          this.lastUpdated = new Date().toLocaleTimeString("ko-KR");
        },

        onError: (errorMsg) => {
          console.error("포트폴리오 스트림 에러:", errorMsg);
          this.error = errorMsg;
          this.loading = false;
        },
      });
    },
  },
};
</script>
