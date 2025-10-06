import api from "./index";

export const tokenStatus = {
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
