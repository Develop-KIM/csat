const ConditionService = require('../../services/conditionService');
const wsManager = require('../../services/webSocket');

jest.mock('../../services/webSocket');

describe('ConditionService', () => {
  let conditionService;

  beforeEach(() => {
    jest.clearAllMocks();
    conditionService = require('../../services/conditionService');
  });

  describe('getConditionList', () => {
    test('조건 목록을 정상적으로 반환해야 함', async () => {
      const mockData = [
        ['1', '단타(시초가 9시 30분까지)'],
        ['2', '장중단타'],
        ['12', '수정중'],
        ['3', '단타&스윙/눌림타점'],
      ];

      wsManager.requestConditionList.mockResolvedValue(mockData);

      const result = await conditionService.getConditionList();

      expect(result).toEqual([
        { index: '1', name: '단타(시초가 9시 30분까지)' },
        { index: '2', name: '장중단타' },
        { index: '3', name: '단타&스윙/눌림타점' },
      ]);
      expect(result).not.toContainEqual({ index: '12', name: '수정중' });
    });

    test('인덱스 12는 제외되어야 함', async () => {
      const mockData = [
        ['12', '수정중'],
        ['1', '단타'],
      ];

      wsManager.requestConditionList.mockResolvedValue(mockData);

      const result = await conditionService.getConditionList();

      expect(result.length).toBe(1);
      expect(result[0].index).toBe('1');
    });

    test('모든 데이터가 제외 대상이면 빈 배열을 반환해야 함', async () => {
      const mockData = [['12', '수정중']];

      wsManager.requestConditionList.mockResolvedValue(mockData);

      const result = await conditionService.getConditionList();

      expect(result).toEqual([]);
    });

    test('빈 배열이 오면 빈 배열을 반환해야 함', async () => {
      wsManager.requestConditionList.mockResolvedValue([]);

      const result = await conditionService.getConditionList();

      expect(result).toEqual([]);
    });

    test('WebSocket 에러 시 에러를 throw해야 함', async () => {
      const error = new Error('WebSocket 연결 실패');
      wsManager.requestConditionList.mockRejectedValue(error);

      await expect(conditionService.getConditionList()).rejects.toThrow(
        'WebSocket 연결 실패',
      );
    });

    test('데이터 형식이 올바르게 변환되어야 함', async () => {
      const mockData = [['1', '조건명']];

      wsManager.requestConditionList.mockResolvedValue(mockData);

      const result = await conditionService.getConditionList();

      expect(result[0]).toHaveProperty('index');
      expect(result[0]).toHaveProperty('name');
      expect(result[0].index).toBe('1');
      expect(result[0].name).toBe('조건명');
    });
  });
});
