import api from "./index";

export const kiwoomStatus = {
  getTokenStatus() {
    return api.get("/kiwoom/token/status");
  },

  getTokenRefreshStatus() {
    return api.get("/kiwoom/token/refresh/status");
  },

  getCleanupStatus() {
    return api.get("/kiwoom/tokens/cleanup/status");
  },

  getDepositDetail() {
    return api.get("/portfolio/deposit");
  },

  getAccountBalance() {
    return api.get("/portfolio/balance");
  },

  getDashboard() {
    return api.get("/portfolio/dashboard");
  },
};
