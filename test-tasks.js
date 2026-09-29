async function test() {
  try {
    const email = `test${Date.now()}@test.com`;
    
    const regRes = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test',
        email: email,
        password: 'password123'
      })
    });
    
    const regData = await regRes.json();
    const token = regData.access_token;
    
    console.log('Fetching tasks board...');
    const taskRes = await fetch('http://localhost:3000/api/tasks/board', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Tasks status:', taskRes.status);
    console.log(await taskRes.text());
  } catch (error) {
    console.error('Error:', error.message);
  }
}

test();
