// Générateur de code de sécurité numérique (par défaut 6 chiffres)
const generateSecurityCode = (length = 6) => {
  const digits = '0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  return code;
};

module.exports = generateSecurityCode;
