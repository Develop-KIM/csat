import api from "./index";

export const condition = {
  getConditionList() {
    return api.get("/condition/list");
  },
};
