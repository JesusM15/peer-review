const bcrypt = require('bcryptjs');

const password = 'password123';
const saltRounds = 10;

bcrypt.genSalt(saltRounds, (err, salt) => {
  if (err) {
    console.error('Error generando salt:', err);
    return;
  }
  
  bcrypt.hash(password, salt, (err, hash) => {
    if (err) {
      console.error('Error hasheando:', err);
      return;
    }
    
    console.log('Password:', password);
    console.log('Hash:', hash);
    
    // Verificar que funciona
    bcrypt.compare(password, hash, (err, result) => {
      console.log('Verificación:', result ? 'OK ✓' : 'FAIL ✗');
    });
  });
});
