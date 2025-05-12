const bcrypt = require('bcryptjs');

const password = 'enzoadmin'; // Desired password
bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
    return;
  }
  console.log('Hashed password:', hash);
});