const http = require('http');

// Simple test to check if capstone fields are included in teacher API response
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/teachers',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer test-token'
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('Response received:', JSON.stringify(response, null, 2));
      
      if (response.success && response.teachers && response.teachers.length > 0) {
        const firstTeacher = response.teachers[0];
        console.log('\n=== Checking for capstone fields ===');
        console.log('capstone_adviser_available:', 'capstone_adviser_available' in firstTeacher);
        console.log('capstone_schedule:', 'capstone_schedule' in firstTeacher);
        
        if ('capstone_adviser_available' in firstTeacher) {
          console.log('SUCCESS: Capstone advising fields are now included in the API response!');
        } else {
          console.log('ISSUE: Capstone advising fields are still missing from the API response.');
        }
      }
    } catch (error) {
      console.error('Error parsing response:', error);
    }
  });
});

req.on('error', (error) => {
  console.error('Request error:', error);
});

req.end();
