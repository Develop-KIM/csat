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
      loading: false,
      interval: null,
    };
  },

  mounted() {
    this.fetchDashboard();
    this.interval = setInterval(() => {
      this.fetchDashboard();
    }, 30000);
  },

  beforeDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  },

  methods: {
    async fetchDashboard() {
      this.loading = true;
      try {
        const response = await kiwoomStatus.getDashboard();

        this.dashboardData = response.data.data;
        this.lastUpdated = new Date().toLocaleTimeString("ko-KR");
      } catch (error) {
        console.error("대시보드 조회 실패:", error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
