const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');

// Load env from backend folder
dotenv.config({ path: path.join(__dirname, 'backend', '.env') });

const testJWT = () => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    console.error('❌ JWT_SECRET is not defined in .env');
    return;
  }

  console.log('✅ JWT_SECRET found in .env');

  try {
    const payload = { id: 'test_user_id', role: 'admin' };
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    console.log('✅ JWT Token generated successfully');

    const decoded = jwt.verify(token, secret);
    if (decoded.id === payload.id) {
      console.log('✅ JWT Token verified successfully');
      console.log('🚀 JWT Configuration is working perfectly!');
    }
  } catch (error) {
    console.error('❌ JWT Test failed:', error.message);
  }
};

testJWT();
