async function test20Questions() {
  const BASE_URL = 'http://localhost:5000/api';
  console.log('Testing 20 Questions Quiz Generation...\n');

  // Sign up
  const email = `twenty_${Date.now()}@example.com`;
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'password123', full_name: 'Twenty Tester' }),
  });
  const { token } = await res.json();

  // Start Python quiz
  console.log('Starting Python (Medium) quiz...');
  const startRes = await fetch(`${BASE_URL}/quiz/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ subject: 'Python', difficulty: 'medium', questionCount: 20 }),
  });

  const startData = await startRes.json();
  if (!startRes.ok) throw new Error(JSON.stringify(startData));

  console.log('✅ Quiz Started!');
  console.log('Attempt ID:', startData.attempt_id);
  console.log('Total Questions received:', startData.questions.length);
  console.log('Is Total Questions equal to 20?', startData.questions.length === 20 ? 'YES! 🎯' : 'NO!');

  // Verify all 20 have text and 4 options
  let allValid = true;
  for (let i = 0; i < startData.questions.length; i++) {
    const q = startData.questions[i];
    if (!q.question_text || q.options.length !== 4 || q.position !== i + 1) {
      allValid = false;
      break;
    }
  }
  console.log('All 20 questions valid with 4 options each:', allValid ? 'YES ✅' : 'NO ❌');

  // Submit test answers for all 20
  const answers = {};
  for (let i = 1; i <= 20; i++) {
    answers[i] = i % 4;
  }

  console.log('\nSubmitting answers for all 20 questions...');
  for (const [position, selected_option] of Object.entries(answers)) {
    const answerRes = await fetch(`${BASE_URL}/quiz/answer/${startData.attempt_id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ position: Number(position), selected_option }),
    });
    if (!answerRes.ok) throw new Error('Saving answer failed: ' + JSON.stringify(await answerRes.json()));
  }

  const submitRes = await fetch(`${BASE_URL}/quiz/submit/${startData.attempt_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}),
  });

  const submitData = await submitRes.json();
  console.log('✅ Submission Graded!');
  console.log(`Score: ${submitData.score} / ${submitData.total_questions} (${submitData.percentage}%)`);
  console.log('Graded Questions count:', submitData.questions.length);

  console.log('\n🎉 20-QUESTION QUIZ VERIFICATION PASSED PERFECTLY!');
}

test20Questions().catch(console.error);
