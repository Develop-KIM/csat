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
};
