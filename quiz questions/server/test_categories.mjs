async function testCategories() {
  const BASE_URL = 'http://localhost:5000/api';
  console.log('Testing Category & Sub-Subject Selection...\n');

  // Sign up a test user
  const email = `catuser_${Date.now()}@example.com`;
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'password123', full_name: 'Bob Explorer' }),
  });
  const { token } = await res.json();

  const subjectsToTest = [
    { subject: 'JavaScript', diff: 'medium' },
    { subject: 'React.js', diff: 'easy' },
    { subject: 'Python', diff: 'difficult' },
    { subject: 'HTML', diff: 'easy' },
    { subject: 'DSA', diff: 'medium' },
    { subject: 'DBMS', diff: 'difficult' }
  ];

  for (const { subject, diff } of subjectsToTest) {
    console.log(`Testing Start Quiz: [${subject}] (${diff})...`);
    const qRes = await fetch(`${BASE_URL}/quiz/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ subject, difficulty: diff }),
    });

    const qData = await qRes.json();
    if (!qRes.ok) throw new Error(`Failed for ${subject}: ` + JSON.stringify(qData));
    console.log(`   ✅ Attempt: ${qData.attempt_id}`);
    console.log(`   ✅ Question Count: ${qData.questions.length}`);
    console.log(`   ✅ Sample Q1: "${qData.questions[0].question_text}"`);
    console.log(`   ✅ 4 Options:`, qData.questions[0].options.length === 4 ? 'OK' : 'FAIL');
  }

  console.log('\n🎉 ALL CATEGORY & SUBJECT QUIZZES GENERATED SUCCESSFULLY!');
}

testCategories().catch(console.error);
