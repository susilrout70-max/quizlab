process.env.NODE_ENV = 'test';
process.env.VERCEL = '1';
process.env.DATABASE_URL = '';
process.env.JWT_SECRET = 'test-only-secret-for-auth-api-tests';

import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';

const imported = await import('./dist/index.js');
const app = imported.default?.default || imported.default || imported;

let server;
let baseUrl;

before(async () => {
  await new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

after(async () => {
  if (server) {
    server.close();
    server.closeAllConnections?.();
  }
  const { pool } = await import('./dist/db/index.js');
  await pool.end();
});

describe('QuizLab Auth API Automated Tests', () => {
  const testEmail = `test_${Date.now()}@quizlab.test`;
  const testPassword = 'SecurePassword123!';
  const testFullName = 'Test Student';
  let testToken;

  test('POST /api/auth/signup - creates new user account (201)', async () => {
    const res = await fetch(`${baseUrl}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Connection': 'close' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        full_name: testFullName,
      }),
    });

    const data = await res.json();
    assert.equal(res.status, 201);
    assert.ok(data.token, 'Token must be present in signup response');
    assert.equal(data.user.email, testEmail.toLowerCase());
    testToken = data.token;
  });

  test('POST /api/auth/signup - returns 503 when production database is unavailable', async () => {
    process.env.NODE_ENV = 'production';
    try {
      const res = await fetch(`${baseUrl}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Connection': 'close' },
        body: JSON.stringify({
          email: `unavailable_${Date.now()}@quizlab.test`,
          password: testPassword,
          full_name: testFullName,
        }),
      });

      const data = await res.json();
      assert.equal(res.status, 503);
      assert.equal(data.error.code, 'DATABASE_UNAVAILABLE');
    } finally {
      process.env.NODE_ENV = 'test';
    }
  });

  test('POST /api/auth/signup - returns 503 when JWT_SECRET is not configured', async () => {
    const previousNodeEnv = process.env.NODE_ENV;
    const previousJwtSecret = process.env.JWT_SECRET;
    process.env.NODE_ENV = 'production';
    delete process.env.JWT_SECRET;

    try {
      const res = await fetch(`${baseUrl}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Connection': 'close' },
        body: JSON.stringify({
          email: `no_secret_${Date.now()}@quizlab.test`,
          password: testPassword,
          full_name: testFullName,
        }),
      });

      const data = await res.json();
      assert.equal(res.status, 503);
      assert.equal(data.error.code, 'JWT_SECRET_MISSING');
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
      if (previousJwtSecret === undefined) {
        delete process.env.JWT_SECRET;
      } else {
        process.env.JWT_SECRET = previousJwtSecret;
      }
    }
  });

  test('POST /api/auth/signup - refuses teacher registration without a configured invite code', async () => {
    const previousInviteCode = process.env.TEACHER_INVITE_CODE;
    delete process.env.TEACHER_INVITE_CODE;

    try {
      const res = await fetch(`${baseUrl}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Connection': 'close' },
        body: JSON.stringify({
          email: `teacher_${Date.now()}@quizlab.test`,
          password: testPassword,
          full_name: 'Test Teacher',
          role: 'teacher',
          teacher_code: 'anything',
        }),
      });

      const data = await res.json();
      assert.equal(res.status, 503);
      assert.equal(data.error.code, 'TEACHER_SIGNUP_NOT_CONFIGURED');
    } finally {
      if (previousInviteCode === undefined) {
        delete process.env.TEACHER_INVITE_CODE;
      } else {
        process.env.TEACHER_INVITE_CODE = previousInviteCode;
      }
    }
  });

  test('POST /api/ai/chat - requires authentication', async () => {
    const res = await fetch(`${baseUrl}/api/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Connection': 'close' },
      body: JSON.stringify({ message: 'Explain photosynthesis.' }),
    });

    assert.equal(res.status, 401);
  });

  test('POST /api/quiz/submit - grades only server-saved answers', async () => {
    const startRes = await fetch(`${baseUrl}/api/quiz/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${testToken}`, Connection: 'close' },
      body: JSON.stringify({ subject: 'HTML', difficulty: 'easy' }),
    });
    const startData = await startRes.json();
    assert.equal(startRes.status, 201);

    const answerRes = await fetch(`${baseUrl}/api/quiz/answer/${startData.attempt_id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${testToken}`, Connection: 'close' },
      body: JSON.stringify({ position: 1, selected_option: 0 }),
    });
    assert.equal(answerRes.status, 200);

    const submitRes = await fetch(`${baseUrl}/api/quiz/submit/${startData.attempt_id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${testToken}`, Connection: 'close' },
      body: JSON.stringify({ answers: { 1: 3 } }),
    });
    const submitData = await submitRes.json();
    assert.equal(submitRes.status, 200);
    assert.equal(submitData.questions[0].selected_option, 0);
  });

  test('POST /api/auth/signup - rejects duplicate email with 409 and standardized error shape', async () => {
    const res = await fetch(`${baseUrl}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Connection': 'close' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        full_name: testFullName,
      }),
    });

    const data = await res.json();
    assert.equal(res.status, 409);
    assert.ok(data.error, 'Error object must be present');
    assert.equal(data.error.code, 'ACCOUNT_EXISTS');
    assert.equal(typeof data.error.message, 'string');
  });

  test('POST /api/auth/login - succeeds with correct credentials (200)', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Connection': 'close' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    });

    const data = await res.json();
    assert.equal(res.status, 200);
    assert.ok(data.token, 'Token must be present');
    assert.equal(data.user.email, testEmail.toLowerCase());
  });

  test('POST /api/auth/login - returns 401 and standardized error on wrong password', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Connection': 'close' },
      body: JSON.stringify({
        email: testEmail,
        password: 'WrongPassword!',
      }),
    });

    const data = await res.json();
    assert.equal(res.status, 401);
    assert.ok(data.error);
    assert.equal(data.error.code, 'INVALID_CREDENTIALS');
    assert.equal(data.error.message, 'Invalid email or password');
  });

  test('POST /api/auth/login - returns 401 and standardized error on non-existent email', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Connection': 'close' },
      body: JSON.stringify({
        email: 'nobody_123456789@nonexistent.domain',
        password: 'SomePassword123!',
      }),
    });

    const data = await res.json();
    assert.equal(res.status, 401);
    assert.ok(data.error);
    assert.equal(data.error.code, 'INVALID_CREDENTIALS');
  });

  test('POST /api/auth/login - returns 400 when email or password is missing', async () => {
    const resMissingPass = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Connection': 'close' },
      body: JSON.stringify({ email: testEmail }),
    });

    const data = await resMissingPass.json();
    assert.equal(resMissingPass.status, 400);
    assert.ok(data.error);
    assert.equal(data.error.code, 'VALIDATION_ERROR');

    const resMissingEmail = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Connection': 'close' },
      body: JSON.stringify({ password: testPassword }),
    });

    const data2 = await resMissingEmail.json();
    assert.equal(resMissingEmail.status, 400);
    assert.ok(data2.error);
    assert.equal(data2.error.code, 'VALIDATION_ERROR');
  });

  test('GET /api/auth/me - requires valid token (401 without token)', async () => {
    const res = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { 'Connection': 'close' },
    });
    assert.equal(res.status, 401);
  });

  test('GET /api/health - returns database status or safe degraded state', async () => {
    const res = await fetch(`${baseUrl}/api/health`, {
      headers: { 'Connection': 'close' },
    });
    assert.ok(res.status === 200 || res.status === 500);
    const data = await res.json();
    assert.ok(data);
  });

  test('GET /api/unmatched-route - returns 404 with standardized error response', async () => {
    const res = await fetch(`${baseUrl}/api/unmatched-route`, {
      headers: { 'Connection': 'close' },
    });
    const data = await res.json();
    assert.equal(res.status, 404);
    assert.equal(data.error.code, 'NOT_FOUND');
  });
});
