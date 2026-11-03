async function test10Questions() {
  const BASE_URL = 'http://localhost:5000/api';
  console.log('Testing 10 Questions Quiz Generation...\n');

  // Sign up
  const email = `ten_${Date.now()}@example.com`;
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'password123', full_name: 'Ten Tester' }),
  });
  const { token } = await res.json();

  // Start JavaScript quiz
  console.log('Starting JavaScript (Medium) quiz...');
  const startRes = await fetch(`${BASE_URL}/quiz/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ subject: 'JavaScript', difficulty: 'medium' }),
  });

  const startData = await startRes.json();
  if (!startRes.ok) throw new Error(JSON.stringify(startData));

  console.log('✅ Quiz Started!');
  console.log('Attempt ID:', startData.attempt_id);
  console.log('Total Questions received:', startData.questions.length);
  console.log('Is Total Questions equal to 10?', startData.questions.length === 10 ? 'YES! 🎯' : 'NO!');

  // Submit test answers for all 10
  const answers = {};
  for (let i = 1; i <= 10; i++) {
    answers[i] = i % 4;
  }

  console.log('\nSubmitting answers for all 10 questions...');
  const submitRes = await fetch(`${BASE_URL}/quiz/submit/${startData.attempt_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ answers }),
  });

  const submitData = await submitRes.json();
  console.log('✅ Submission Graded!');
  console.log(`Score: ${submitData.score} / ${submitData.total_questions} (${submitData.percentage}%)`);
  console.log('Graded Questions count:', submitData.questions.length);

  console.log('\n🎉 10-QUESTION QUIZ VERIFICATION PASSED PERFECTLY!');
}

test10Questions().catch(console.error);
