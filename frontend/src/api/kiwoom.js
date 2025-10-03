import api from "./index";

export const kiwoomStatus = {
  getTokenStatus() {
    return api.get("/kiwoom/token/status");
  },
};
