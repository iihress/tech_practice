async function test() {
  try {
    const email = `test${Date.now()}@test.com`;
    console.log('Registering...', email);
    
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
    console.log('Register status:', regRes.status);
    if (regRes.status !== 201) {
      console.log('Register failed:', regData);
      return;
    }
    
    const token = regData.access_token;
    
    console.log('Fetching dashboard stats...');
    const statRes = await fetch('http://localhost:3000/api/dashboard/stats', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Stats status:', statRes.status);
    const statData = await statRes.json();
    console.log('Stats response:', statData);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

test();
