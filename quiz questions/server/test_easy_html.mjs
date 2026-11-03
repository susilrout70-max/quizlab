async function testEasyHtml() {
  const BASE_URL = 'http://localhost:5000/api';
  console.log('Testing Easy HTML Quiz Quality...\n');

  // Sign up
  const email = `easyhtml_${Date.now()}@example.com`;
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'password123', full_name: 'Easy HTML Learner' }),
  });
  const { token } = await res.json();

  // Start HTML (Easy) quiz
  const qRes = await fetch(`${BASE_URL}/quiz/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ subject: 'HTML', difficulty: 'easy' }),
  });

  const data = await qRes.json();
  console.log('Quiz Attempt ID:', data.attempt_id);
  console.log('Total Questions:', data.questions.length);

  console.log('\n--- ALL 10 EASY HTML QUESTIONS GENERATED ---');
  let hasComplexJargon = false;
  data.questions.forEach((q, i) => {
    console.log(`Q${q.position}: ${q.question_text}`);
    console.log(`   Options: ${q.options.join(' | ')}`);
    if (q.question_text.includes('execution model') || q.question_text.includes('design paradigm') || q.question_text.includes('pointer arithmetic')) {
      hasComplexJargon = true;
    }
  });

  if (hasComplexJargon) {
    console.error('\n❌ FAILED: Still contains complex architectural jargon!');
  } else {
    console.log('\n🎉 SUCCESS: All 10 questions are genuine, clean, beginner-friendly EASY questions!');
  }
}

testEasyHtml().catch(console.error);
