const request = require('supertest');
const app = require('../../app');
const tokenRefreshScheduler = require('../../scheduler/tokenRefreshScheduler');
const tokenCleanupScheduler = require('../../scheduler/tokenCleanupScheduler');

jest.mock('../../scheduler/tokenRefreshScheduler');
jest.mock('../../scheduler/tokenCleanupScheduler');

describe('GET /api/kiwoom/token/refresh/status', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('토큰 재발급 스케줄러 상태 조회 성공 - 실행 중', async () => {
    tokenRefreshScheduler.getStatus.mockReturnValue({
      isRunning: true,
      isRefreshing: false,
      bufferMinutes: 30,
    });

    const response = await request(app).get('/api/kiwoom/token/refresh/status');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual({
      isRunning: true,
      isRefreshing: false,
      bufferMinutes: 30,
    });
  });

  test('토큰 재발급 스케줄러 상태 조회 성공 - 재발급 중', async () => {
    tokenRefreshScheduler.getStatus.mockReturnValue({
      isRunning: true,
      isRefreshing: true,
      bufferMinutes: 30,
    });

    const response = await request(app).get('/api/kiwoom/token/refresh/status');

    expect(response.status).toBe(200);
    expect(response.body.data.isRefreshing).toBe(true);
  });

  test('토큰 재발급 스케줄러 상태 조회 성공 - 중지됨', async () => {
    tokenRefreshScheduler.getStatus.mockReturnValue({
      isRunning: false,
      isRefreshing: false,
      bufferMinutes: 30,
    });

    const response = await request(app).get('/api/kiwoom/token/refresh/status');

    expect(response.status).toBe(200);
    expect(response.body.data.isRunning).toBe(false);
  });

  test('에러 발생 시 500 반환', async () => {
    tokenRefreshScheduler.getStatus.mockImplementation(() => {
      throw new Error('Scheduler error');
    });

    const response = await request(app).get('/api/kiwoom/token/refresh/status');

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
  });
});

describe('GET /api/kiwoom/tokens/cleanup/status', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('토큰 정리 스케줄러 상태 조회 성공 - 실행 중', async () => {
    tokenCleanupScheduler.getStatus.mockReturnValue({
      isRunning: true,
      isCleaning: false,
      daysAfterExpiry: 7,
    });

    const response = await request(app).get(
      '/api/kiwoom/tokens/cleanup/status',
    );

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual({
      isRunning: true,
      isCleaning: false,
      daysAfterExpiry: 7,
    });
  });

  test('토큰 정리 스케줄러 상태 조회 성공 - 정리 중', async () => {
    tokenCleanupScheduler.getStatus.mockReturnValue({
      isRunning: true,
      isCleaning: true,
      daysAfterExpiry: 7,
    });

    const response = await request(app).get(
      '/api/kiwoom/tokens/cleanup/status',
    );

    expect(response.status).toBe(200);
    expect(response.body.data.isCleaning).toBe(true);
  });

  test('토큰 정리 스케줄러 상태 조회 성공 - 중지됨', async () => {
    tokenCleanupScheduler.getStatus.mockReturnValue({
      isRunning: false,
      isCleaning: false,
      daysAfterExpiry: 7,
    });

    const response = await request(app).get(
      '/api/kiwoom/tokens/cleanup/status',
    );

    expect(response.status).toBe(200);
    expect(response.body.data.isRunning).toBe(false);
  });

  test('에러 발생 시 500 반환', async () => {
    tokenCleanupScheduler.getStatus.mockImplementation(() => {
      throw new Error('Scheduler error');
    });

    const response = await request(app).get(
      '/api/kiwoom/tokens/cleanup/status',
    );

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
  });
});

describe('스케줄러 상태 통합 테스트', () => {
  test('두 스케줄러 모두 실행 중인 상태', async () => {
    tokenRefreshScheduler.getStatus.mockReturnValue({
      isRunning: true,
      isRefreshing: false,
      bufferMinutes: 30,
    });
    tokenCleanupScheduler.getStatus.mockReturnValue({
      isRunning: true,
      isCleaning: false,
      daysAfterExpiry: 7,
    });

    const [refreshResponse, cleanupResponse] = await Promise.all([
      request(app).get('/api/kiwoom/token/refresh/status'),
      request(app).get('/api/kiwoom/tokens/cleanup/status'),
    ]);

    expect(refreshResponse.body.data.isRunning).toBe(true);
    expect(cleanupResponse.body.data.isRunning).toBe(true);
  });
});
