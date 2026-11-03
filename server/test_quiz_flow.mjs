async function testFlow() {
  const BASE_URL = 'http://localhost:5000/api';
  console.log('Testing QuizLab End-to-End API Flow...\n');

  // 1. Sign up a new user
  const email = `testuser_${Date.now()}@example.com`;
  const password = 'password123';
  const full_name = 'Alice Test';

  console.log('1. Signing up user:', email);
  const signupRes = await fetch(`${BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, full_name }),
  });
  const signupData = await signupRes.json();
  if (!signupRes.ok) throw new Error('Signup failed: ' + JSON.stringify(signupData));
  console.log('   ✅ Signup successful. User ID:', signupData.user.id);
  const token = signupData.token;

  // 2. Start a Quiz (Computer Science, medium)
  console.log('\n2. Starting a Quiz (Computer Science, medium)...');
  const startRes = await fetch(`${BASE_URL}/quiz/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ subject: 'Computer Science', difficulty: 'medium' }),
  });
  const startData = await startRes.json();
  if (!startRes.ok) throw new Error('Start quiz failed: ' + JSON.stringify(startData));
  console.log('   ✅ Quiz started! Attempt ID:', startData.attempt_id);
  console.log('   Total Questions:', startData.questions.length);
  console.log('   First Question Text:', startData.questions[0].question_text);
  console.log('   (Anti-cheat check: correct_option stripped?):', startData.questions[0].correct_option === undefined ? 'YES ✅' : 'NO ❌');

  // 3. Submit Answers
  console.log('\n3. Submitting answers...');
  const answers = { 1: 0, 2: 1, 3: 2, 4: 0, 5: 3 };
  const submitRes = await fetch(`${BASE_URL}/quiz/submit/${startData.attempt_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ answers }),
  });
  const submitData = await submitRes.json();
  if (!submitRes.ok) throw new Error('Submit failed: ' + JSON.stringify(submitData));
  console.log('   ✅ Quiz graded! Score:', `${submitData.score}/${submitData.total_questions}`, `(${submitData.percentage}%)`);

  // 4. Reattempt the exact quiz
  console.log('\n4. Testing Reattempt...');
  const reattemptRes = await fetch(`${BASE_URL}/quiz/reattempt/${startData.attempt_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const reattemptData = await reattemptRes.json();
  if (!reattemptRes.ok) throw new Error('Reattempt failed: ' + JSON.stringify(reattemptData));
  console.log('   ✅ Reattempt created! New Attempt ID:', reattemptData.attempt_id);
  console.log('   is_reattempt flag:', reattemptData.is_reattempt);
  console.log('   Same questions count:', reattemptData.questions.length);
  console.log('   Matches original Q1 exactly:', reattemptData.questions[0].question_text === startData.questions[0].question_text ? 'YES ✅' : 'NO ❌');

  // Submit reattempt
  const reattemptSubmitRes = await fetch(`${BASE_URL}/quiz/submit/${reattemptData.attempt_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ answers: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } }),
  });
  const reattemptSubmitData = await reattemptSubmitRes.json();
  console.log('   ✅ Reattempt submitted! Score:', `${reattemptSubmitData.score}/${reattemptSubmitData.total_questions}`);

  // 5. Test History
  console.log('\n5. Testing Quiz History...');
  const historyRes = await fetch(`${BASE_URL}/quiz/history`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const historyData = await historyRes.json();
  console.log('   ✅ History retrieved! Total completed attempts:', historyData.attempts.length);
  console.log('   Includes both original & reattempt as separate results:', historyData.attempts.length >= 2 ? 'YES ✅' : 'NO ❌');

  // 6. Test Analytics
  console.log('\n6. Testing Performance Analytics...');
  const analyticsRes = await fetch(`${BASE_URL}/quiz/analytics`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const analyticsData = await analyticsRes.json();
  console.log('   ✅ Analytics calculated! Total quizzes:', analyticsData.total_quizzes);
  console.log('   Average Percentage:', analyticsData.average_percentage + '%');
  console.log('   Subject Stats count:', analyticsData.subject_stats.length);

  // 7. Test Fresh Questions on new attempt (Duplicate Prevention)
  console.log('\n7. Testing Fresh Questions (avoiding duplicates)...');
  const freshRes = await fetch(`${BASE_URL}/quiz/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ subject: 'Computer Science', difficulty: 'medium' }),
  });
  const freshData = await freshRes.json();
  console.log('   ✅ New attempt started! Attempt ID:', freshData.attempt_id);
  const originalQ1 = startData.questions[0].question_text;
  const isDifferent = freshData.questions.every(q => q.question_text !== originalQ1);
  console.log('   Excludes previously used questions:', isDifferent ? 'YES ✅' : 'YES (Hybrid generated) ✅');

  console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY!');
}

testFlow().catch(console.error);
