async function run() {
  const base = 'http://127.0.0.1:5000/api';
  console.log('Testing Numerical & Scientific Subjects Quiz Generation...\n');

  // 1. Sign up
  const email = `mathuser_${Date.now()}@example.com`;
  const regRes = await fetch(`${base}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ full_name: 'Science Math Student', email, password: 'password123' })
  });
  const regData = await regRes.json();
  const token = regData.token;
  console.log('User signed up successfully. Token present:', !!token);

  const testSubjects = [
    { subject: 'Linear Algebra', diff: 'medium' },
    { subject: 'Physics', diff: 'medium' },
    { subject: 'Chemistry', diff: 'easy' },
    { subject: 'Mathematics', diff: 'easy' }
  ];

  for (const { subject, diff } of testSubjects) {
    console.log(`\n======================================================`);
    console.log(`SUBJECT: ${subject} (${diff.toUpperCase()})`);
    console.log(`======================================================`);
    const startRes = await fetch(`${base}/quiz/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ subject, difficulty: diff })
    });

    const startData = await startRes.json();
    if (!startRes.ok) {
      console.error('Error starting quiz:', startData);
      continue;
    }

    console.log(`Attempt ID: ${startData.attempt_id}`);
    console.log(`Total questions: ${startData.questions.length}`);

    // Print all questions briefly
    startData.questions.forEach((q, idx) => {
      console.log(`\n  Q${idx + 1}: ${q.question_text}`);
      console.log(`     Options: ${q.options.map((opt, i) => `[${String.fromCharCode(65 + i)}] ${opt}`).join('  |  ')}`);
    });
  }
}

run().catch(console.error);
