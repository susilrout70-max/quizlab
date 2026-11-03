process.env.NODE_ENV = 'test';
process.env.VERCEL = '1';

import dotenv from 'dotenv';
import assert from 'assert';
import http from 'http';
import path from 'path';

dotenv.config({ path: path.resolve('server/.env') });
dotenv.config({ path: path.resolve('.env') });

const imported = await import('./dist/index.js');
const app = imported.default?.default || imported.default || imported;
const { pool, query } = await import('./dist/db/index.js');

async function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer(app);
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      resolve({ server, baseUrl: `http://127.0.0.1:${port}` });
    });
  });
}

async function main() {
  console.log('🚀 Starting Comprehensive Authentication Test Suite against Neon DB...\n');

  const { server, baseUrl } = await startServer();

  let studentToken = null;
  let teacherToken = null;
  const uniqueTimestamp = Date.now();
  const studentEmail = `student_${uniqueTimestamp}@quizlab.test`;
  const teacherEmail = `teacher_${uniqueTimestamp}@quizlab.test`;
  const securePassword = 'TestPassword123!';

  try {
    // 1. Health check (/api/health and /health)
    console.log('🧪 Test 1: GET /api/health and /health');
    const healthRes = await fetch(`${baseUrl}/api/health`);
    assert.strictEqual(healthRes.status, 200);
    const healthData = await healthRes.json();
    assert.strictEqual(healthData.database, 'connected');
    console.log('   ✅ GET /api/health returned 200 with database connected.');

    const healthRootRes = await fetch(`${baseUrl}/health`);
    assert.strictEqual(healthRootRes.status, 200);
    console.log('   ✅ GET /health (route without /api) returned 200 successfully.');

    // 2. Student Signup
    console.log('\n🧪 Test 2: POST /api/auth/signup (Student Registration)');
    const studentSignupRes = await fetch(`${baseUrl}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: studentEmail,
        password: securePassword,
        full_name: 'Alex Student',
        role: 'student'
      }),
    });
    assert.strictEqual(studentSignupRes.status, 201);
    const studentSignupData = await studentSignupRes.json();
    assert.ok(studentSignupData.token, 'Must return JWT token');
    assert.strictEqual(studentSignupData.user.email, studentEmail.toLowerCase());
    assert.strictEqual(studentSignupData.user.role, 'student');
    studentToken = studentSignupData.token;
    console.log('   ✅ Student registered successfully with role=student and valid JWT.');

    // 3. Verify Database Persistence for Student
    console.log('\n🧪 Test 3: Direct Database Verification for Student');
    const studentDbCheck = await query('SELECT id, email, full_name, role FROM users WHERE email = $1', [studentEmail]);
    assert.strictEqual(studentDbCheck.rows.length, 1);
    assert.strictEqual(studentDbCheck.rows[0].role, 'student');
    assert.strictEqual(studentDbCheck.rows[0].full_name, 'Alex Student');
    console.log('   ✅ Student record verified in Neon PostgreSQL table.');

    // 4. Teacher Signup (Valid Code)
    console.log('\n🧪 Test 4: POST /api/auth/signup (Teacher Registration with QUIZLAB_TEACHER_2026)');
    const teacherSignupRes = await fetch(`${baseUrl}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: teacherEmail,
        password: securePassword,
        full_name: 'Prof. Miller',
        role: 'teacher',
        teacher_code: 'QUIZLAB_TEACHER_2026'
      }),
    });
    assert.strictEqual(teacherSignupRes.status, 201);
    const teacherSignupData = await teacherSignupRes.json();
    assert.ok(teacherSignupData.token);
    assert.strictEqual(teacherSignupData.user.email, teacherEmail.toLowerCase());
    assert.strictEqual(teacherSignupData.user.role, 'teacher');
    teacherToken = teacherSignupData.token;
    console.log('   ✅ Teacher registered successfully with role=teacher and valid JWT.');

    // 5. Verify Database Persistence for Teacher
    console.log('\n🧪 Test 5: Direct Database Verification for Teacher');
    const teacherDbCheck = await query('SELECT id, email, full_name, role FROM users WHERE email = $1', [teacherEmail]);
    assert.strictEqual(teacherDbCheck.rows.length, 1);
    assert.strictEqual(teacherDbCheck.rows[0].role, 'teacher');
    console.log('   ✅ Teacher record verified in Neon PostgreSQL table.');

    // 6. Teacher Signup with Invalid Code
    console.log('\n🧪 Test 6: POST /api/auth/signup (Teacher with Invalid Code)');
    const badCodeRes = await fetch(`${baseUrl}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `badteacher_${uniqueTimestamp}@quizlab.test`,
        password: securePassword,
        full_name: 'Fake Teacher',
        role: 'teacher',
        teacher_code: 'WRONG_CODE_XYZ'
      }),
    });
    assert.strictEqual(badCodeRes.status, 400);
    const badCodeData = await badCodeRes.json();
    assert.strictEqual(badCodeData.error.code, 'INVALID_INVITE_CODE');
    console.log('   ✅ Rejected invalid teacher invite code with HTTP 400.');

    // 7. Duplicate Email Registration
    console.log('\n🧪 Test 7: Duplicate Email Rejection');
    const dupRes = await fetch(`${baseUrl}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: studentEmail,
        password: securePassword,
        full_name: 'Duplicate Student'
      }),
    });
    assert.strictEqual(dupRes.status, 409);
    const dupData = await dupRes.json();
    assert.strictEqual(dupData.error.code, 'ACCOUNT_EXISTS');
    console.log('   ✅ Rejected duplicate email with HTTP 409.');

    // 8. Invalid Email Format
    console.log('\n🧪 Test 8: Invalid Email Validation');
    const invalidEmailRes = await fetch(`${baseUrl}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'not-an-email',
        password: securePassword,
        full_name: 'Test Name'
      }),
    });
    assert.strictEqual(invalidEmailRes.status, 400);
    const invalidEmailData = await invalidEmailRes.json();
    assert.strictEqual(invalidEmailData.error.code, 'VALIDATION_ERROR');
    console.log('   ✅ Rejected invalid email with HTTP 400.');

    // 9. Short Password Validation (< 6 chars)
    console.log('\n🧪 Test 9: Password Length Validation (< 6 chars)');
    const shortPassRes = await fetch(`${baseUrl}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `shortpass_${uniqueTimestamp}@quizlab.test`,
        password: '123',
        full_name: 'Test Name'
      }),
    });
    assert.strictEqual(shortPassRes.status, 400);
    const shortPassData = await shortPassRes.json();
    assert.strictEqual(shortPassData.error.code, 'VALIDATION_ERROR');
    console.log('   ✅ Rejected short password with HTTP 400.');

    // 10. Student Login (Success)
    console.log('\n🧪 Test 10: POST /api/auth/login (Student Success)');
    const studentLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: studentEmail,
        password: securePassword
      }),
    });
    assert.strictEqual(studentLoginRes.status, 200);
    const studentLoginData = await studentLoginRes.json();
    assert.ok(studentLoginData.token);
    assert.strictEqual(studentLoginData.user.role, 'student');
    console.log('   ✅ Student login succeeded with HTTP 200 and role=student.');

    // 11. Teacher Login (Success)
    console.log('\n🧪 Test 11: POST /api/auth/login (Teacher Success)');
    const teacherLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: teacherEmail,
        password: securePassword
      }),
    });
    assert.strictEqual(teacherLoginRes.status, 200);
    const teacherLoginData = await teacherLoginRes.json();
    assert.ok(teacherLoginData.token);
    assert.strictEqual(teacherLoginData.user.role, 'teacher');
    console.log('   ✅ Teacher login succeeded with HTTP 200 and role=teacher.');

    // 12. Login with Wrong Password
    console.log('\n🧪 Test 12: POST /api/auth/login (Wrong Password)');
    const wrongPassRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: studentEmail,
        password: 'WrongPassword999!'
      }),
    });
    assert.strictEqual(wrongPassRes.status, 401);
    const wrongPassData = await wrongPassRes.json();
    assert.strictEqual(wrongPassData.error.code, 'INVALID_CREDENTIALS');
    console.log('   ✅ Rejected wrong password with HTTP 401.');

    // 13. Login with Non-Existent Email
    console.log('\n🧪 Test 13: POST /api/auth/login (Non-existent Email)');
    const nonExistRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'nobody_exists_xyz@quizlab.test',
        password: securePassword
      }),
    });
    assert.strictEqual(nonExistRes.status, 401);
    const nonExistData = await nonExistRes.json();
    assert.strictEqual(nonExistData.error.code, 'INVALID_CREDENTIALS');
    console.log('   ✅ Rejected non-existent user with HTTP 401.');

    // 14. GET /api/auth/me (Protected Route with Student Token)
    console.log('\n🧪 Test 14: GET /api/auth/me (Authenticated Student)');
    const meRes = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    assert.strictEqual(meRes.status, 200);
    const meData = await meRes.json();
    assert.strictEqual(meData.user.email, studentEmail.toLowerCase());
    assert.strictEqual(meData.user.role, 'student');
    console.log('   ✅ Protected route /api/auth/me verified student identity.');

    // 15. GET /api/auth/me (Protected Route with Teacher Token)
    console.log('\n🧪 Test 15: GET /api/auth/me (Authenticated Teacher)');
    const meTeacherRes = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${teacherToken}` }
    });
    assert.strictEqual(meTeacherRes.status, 200);
    const meTeacherData = await meTeacherRes.json();
    assert.strictEqual(meTeacherData.user.email, teacherEmail.toLowerCase());
    assert.strictEqual(meTeacherData.user.role, 'teacher');
    console.log('   ✅ Protected route /api/auth/me verified teacher identity.');

    // 16. GET /api/auth/me (Unauthenticated)
    console.log('\n🧪 Test 16: GET /api/auth/me without token');
    const meUnauthRes = await fetch(`${baseUrl}/api/auth/me`);
    assert.strictEqual(meUnauthRes.status, 401);
    console.log('   ✅ Unauthenticated request correctly rejected with HTTP 401.');

    // 17. GET /api/auth/me (Invalid token)
    console.log('\n🧪 Test 17: GET /api/auth/me with invalid token');
    const meBadTokenRes = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Authorization: 'Bearer this_is_a_garbage_token' }
    });
    assert.strictEqual(meBadTokenRes.status, 403);
    console.log('   ✅ Tampered/invalid token correctly rejected with HTTP 403.');

    // 18. POST /api/auth/logout
    console.log('\n🧪 Test 18: POST /api/auth/logout');
    const logoutRes = await fetch(`${baseUrl}/api/auth/logout`, { method: 'POST' });
    assert.strictEqual(logoutRes.status, 200);
    console.log('   ✅ Logout endpoint returned HTTP 200.');

    // 19. Unmatched Route (404)
    console.log('\n🧪 Test 19: Unmatched Route 404 handler');
    const notFoundRes = await fetch(`${baseUrl}/api/unmatched-route-xyz`);
    assert.strictEqual(notFoundRes.status, 404);
    const notFoundData = await notFoundRes.json();
    assert.strictEqual(notFoundData.error.code, 'NOT_FOUND');
    console.log('   ✅ Unmatched /api/* route returned standardized 404 JSON.');

    console.log('\n🎉 ALL 19 AUTHENTICATION & DATABASE TESTS PASSED WITH 100% SUCCESS!');
  } finally {
    server.close();
    await pool.end();
  }
}

main().catch((err) => {
  console.error('\n❌ Test Suite Failed:', err);
  process.exit(1);
});
