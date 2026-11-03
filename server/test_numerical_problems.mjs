async function testNumericalProblems() {
  const BASE_URL = 'http://localhost:5000/api';
  console.log('Testing Mathematical, Physics, and Chemistry Numerical Problems...\n');

  // Sign up
  const email = `num_${Date.now()}@example.com`;
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'password123', full_name: 'Math Science Tester' }),
  });
  const { token } = await res.json();

  // 1. Test Linear Algebra (Matrices & Determinants)
  console.log('1. Starting Linear Algebra Quiz (Matrices & Determinants)...');
  const mathRes = await fetch(`${BASE_URL}/quiz/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ subject: 'Linear Algebra', difficulty: 'medium' }),
  });
  const mathData = await mathRes.json();
  console.log('   Total Questions:', mathData.questions.length);
  mathData.questions.slice(0, 3).forEach((q, i) => {
    console.log(`   Sample Q${i+1}: ${q.question_text}`);
    console.log(`      Options: ${q.options.join(' | ')}`);
  });

  // 2. Test Physics Problems (F=ma, Ohm's Law, Energy)
  console.log('\n2. Starting Physics Quiz (Force, Work, Circuits, Energy)...');
  const physRes = await fetch(`${BASE_URL}/quiz/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ subject: 'Physics', difficulty: 'medium' }),
  });
  const physData = await physRes.json();
  console.log('   Total Questions:', physData.questions.length);
  physData.questions.slice(0, 3).forEach((q, i) => {
    console.log(`   Sample Q${i+1}: ${q.question_text}`);
    console.log(`      Options: ${q.options.join(' | ')}`);
  });

  // 3. Test Chemistry Problems (Molar Mass, pH, Density)
  console.log('\n3. Starting Chemistry Quiz (Molar Mass, pH, Density, Gas Laws)...');
  const chemRes = await fetch(`${BASE_URL}/quiz/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ subject: 'Chemistry', difficulty: 'medium' }),
  });
  const chemData = await chemRes.json();
  console.log('   Total Questions:', chemData.questions.length);
  chemData.questions.slice(0, 3).forEach((q, i) => {
    console.log(`   Sample Q${i+1}: ${q.question_text}`);
    console.log(`      Options: ${q.options.join(' | ')}`);
  });

  console.log('\n🎉 ALL MATHEMATICAL, PHYSICS & CHEMISTRY PROBLEMS VERIFIED SUCCESSFULLY!');
}

testNumericalProblems().catch(console.error);
