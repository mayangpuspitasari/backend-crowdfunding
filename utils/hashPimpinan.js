// hashPassword.js
const bcrypt = require('bcrypt');

// Ganti ini dengan password yang ingin di-hash
const password = 'pimpinanlazismu';

const generateHash = async () => {
  try {
    const hashed = await bcrypt.hash(password, 10);
    console.log('Password asli :', password);
    console.log('Hash bcrypt   :', hashed);
  } catch (err) {
    console.error('Gagal hash password:', err);
  }
};

generateHash();
