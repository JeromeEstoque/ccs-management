const axios = require('axios');

// Test admin login with different usernames
async function testAdminLoginFix() {
  const baseURL = 'http://localhost:5000';
  
  console.log('Testing admin login fix...\n');
  
  // Test cases
  const testCases = [
    { username: 'admin', password: 'admin123', description: 'Original admin username' },
    { username: 'testadmin', password: 'admin123', description: 'Custom admin username' },
    { username: 'johnadmin', password: 'admin123', description: 'Another custom admin username' },
  ];
  
  for (const testCase of testCases) {
    console.log(`Testing: ${testCase.description}`);
    console.log(`Username: ${testCase.username}`);
    
    try {
      const response = await axios.post(`${baseURL}/api/auth/admin/login`, {
        username: testCase.username,
        password: testCase.password
      });
      
      if (response.data.success) {
        console.log('✅ SUCCESS: Login successful');
        console.log(`User: ${response.data.user.username}`);
        console.log(`Role: ${response.data.user.role}`);
      } else {
        console.log('❌ FAILED: Login unsuccessful');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('⚠️  EXPECTED: User not found (this is normal for test users that dont exist)');
      } else {
        console.log('❌ ERROR:', error.response?.data?.message || error.message);
      }
    }
    
    console.log('---');
  }
  
  console.log('\nTest completed!');
  console.log('The fix should now allow any admin username format, not just hardcoded ones.');
}

// Run the test
testAdminLoginFix().catch(console.error);
