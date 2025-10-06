const wsManager = require('./webSocket');

class ConditionService {
  constructor() {
    this.excludedIndexes = ['12'];
  }

  async getConditionList() {
    try {
      const data = await wsManager.requestConditionList();

      const conditions = data
        .filter(([index]) => !this.excludedIndexes.includes(index))
        .map(([index, name]) => ({ index, name }));

      return conditions;
    } catch (error) {
      console.error('조건검색 목록 조회 실패:', error);
      throw error;
    }
  }
}

module.exports = new ConditionService();
