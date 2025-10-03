import api from "./index";

export const kiwoomApi = {
  getTokenStatus() {
    return api.get("/kiwoom/token/status");
  },
};
