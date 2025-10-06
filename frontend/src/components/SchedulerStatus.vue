<template>
  <v-card class="scheduler-status">
    <v-card-title class="d-flex justify-space-between align-center">
      <span
        :class="$vuetify.breakpoint.smAndDown ? 'text-subtitle-1' : 'text-h6'"
        >토큰 스케줄러 상태</span
      >
      <span class="text-caption grey--text">
        마지막 업데이트: {{ lastUpdated }}
      </span>
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="6">
          <div class="scheduler-card">
            <div class="d-flex align-center justify-space-between mb-3">
              <h3 class="scheduler-title">재발급 스케줄러</h3>
              <v-chip
                :color="refreshStatus.isRunning ? 'success' : 'error'"
                label
                :small="$vuetify.breakpoint.smAndDown"
              >
                {{ refreshStatus.isRunning ? "실행 중" : "중지됨" }}
              </v-chip>
            </div>

            <v-divider class="mb-3"></v-divider>

            <div class="status-details">
              <div class="status-item">
                <span class="status-label">스케줄러 상태:</span>
                <span class="status-value">
                  <v-icon
                    small
                    :color="refreshStatus.isRunning ? 'success' : 'grey'"
                  >
                    {{
                      refreshStatus.isRunning
                        ? "mdi-check-circle"
                        : "mdi-circle-outline"
                    }}
                  </v-icon>
                  {{ refreshStatus.isRunning ? "활성화" : "비활성화" }}
                </span>
              </div>

              <div class="status-item">
                <span class="status-label">재발급 작업:</span>
                <span class="status-value">
                  <v-icon
                    small
                    :color="refreshStatus.isRefreshing ? 'warning' : 'grey'"
                  >
                    {{
                      refreshStatus.isRefreshing
                        ? "mdi-loading mdi-spin"
                        : "mdi-check"
                    }}
                  </v-icon>
                  {{ refreshStatus.isRefreshing ? "진행 중" : "대기 중" }}
                </span>
              </div>

              <div class="status-item">
                <span class="status-label">갱신 버퍼:</span>
                <span class="status-value"
                  >{{ refreshStatus.bufferMinutes }}분</span
                >
              </div>

              <div class="status-item">
                <span class="status-label">실행 시간:</span>
                <span class="status-value">평일 08:00</span>
              </div>
            </div>
          </div>
        </v-col>

        <v-col cols="12" md="6">
          <div class="scheduler-card">
            <div class="d-flex align-center justify-space-between mb-3">
              <h3 class="scheduler-title">정리 스케줄러</h3>
              <v-chip
                :color="cleanupStatus.isRunning ? 'success' : 'error'"
                label
                :small="$vuetify.breakpoint.smAndDown"
              >
                {{ cleanupStatus.isRunning ? "실행 중" : "중지됨" }}
              </v-chip>
            </div>

            <v-divider class="mb-3"></v-divider>

            <div class="status-details">
              <div class="status-item">
                <span class="status-label">스케줄러 상태:</span>
                <span class="status-value">
                  <v-icon
                    small
                    :color="cleanupStatus.isRunning ? 'success' : 'grey'"
                  >
                    {{
                      cleanupStatus.isRunning
                        ? "mdi-check-circle"
                        : "mdi-circle-outline"
                    }}
                  </v-icon>
                  {{ cleanupStatus.isRunning ? "활성화" : "비활성화" }}
                </span>
              </div>

              <div class="status-item">
                <span class="status-label">정리 작업:</span>
                <span class="status-value">
                  <v-icon
                    small
                    :color="cleanupStatus.isCleaning ? 'warning' : 'grey'"
                  >
                    {{
                      cleanupStatus.isCleaning
                        ? "mdi-loading mdi-spin"
                        : "mdi-check"
                    }}
                  </v-icon>
                  {{ cleanupStatus.isCleaning ? "진행 중" : "대기 중" }}
                </span>
              </div>

              <div class="status-item">
                <span class="status-label">삭제 기준:</span>
                <span class="status-value"
                  >만료 후 {{ cleanupStatus.daysAfterExpiry }}일</span
                >
              </div>

              <div class="status-item">
                <span class="status-label">실행 시간:</span>
                <span class="status-value">매주 토요일 00:00</span>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { tokenStatus } from "@/api/token";
import { SchedulerSSE } from "@/services/schedulerSSE";

export default {
  name: "SchedulerStatus",

  data() {
    return {
      refreshStatus: {
        isRunning: false,
        isRefreshing: false,
        bufferMinutes: 0,
      },
      cleanupStatus: {
        isRunning: false,
        isCleaning: false,
        daysAfterExpiry: 0,
      },
      lastUpdated: "-",
      loading: false,
      schedulerSSE: null,
    };
  },

  mounted() {
    this.fetchStatus();
    this.connectSSE();
  },

  beforeDestroy() {
    if (this.schedulerSSE) {
      this.schedulerSSE.disconnect();
    }
  },

  methods: {
    connectSSE() {
      this.schedulerSSE = new SchedulerSSE();

      this.schedulerSSE.connect({
        onRefreshStatus: (data) => {
          this.refreshStatus = data;
          this.lastUpdated = new Date().toLocaleTimeString("ko-KR");
        },
        onCleanupStatus: (data) => {
          this.cleanupStatus = data;
          this.lastUpdated = new Date().toLocaleTimeString("ko-KR");
        },
      });
    },

    async fetchStatus() {
      this.loading = true;
      try {
        const [refreshRes, cleanupRes] = await Promise.all([
          tokenStatus.getTokenRefreshStatus(),
          tokenStatus.getCleanupStatus(),
        ]);

        this.refreshStatus = refreshRes.data.data;
        this.cleanupStatus = cleanupRes.data.data;
        this.lastUpdated = new Date().toLocaleTimeString("ko-KR");
      } catch (error) {
        console.error("스케줄러 상태 조회 실패:", error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.scheduler-status {
  margin: 16px 0;
}

.scheduler-card {
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fafafa;
}

.status-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.scheduler-title {
  font-size: 16px;
  font-weight: bold;
}

.status-label {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.6);
}

.status-value {
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
  color: rgba(0, 0, 0, 0.87);
}

.theme--dark .status-label {
  color: rgba(255, 255, 255, 0.7);
}

.theme--dark .status-value {
  color: rgba(255, 255, 255, 0.95);
}

.theme--dark .scheduler-card {
  background-color: #1e1e1e;
  border-color: #424242;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.mdi-spin {
  animation: spin 1s linear infinite;
}

@media (max-width: 960px) {
  .scheduler-card {
    padding: 8px;
  }

  .scheduler-title {
    font-size: 14px;
  }

  .status-label,
  .status-value {
    font-size: 12px;
  }
}
</style>
