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
    const token = regData.access_token;
    
    console.log('Token Payload:');
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    console.log(JSON.parse(jsonPayload));
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

test();
