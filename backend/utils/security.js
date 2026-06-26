const bcrypt = require('bcrypt');
const xss = require('xss');

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

const sanitize = (input) => {
  if (typeof input !== 'string') return input;
  // Trim spaces and sanitize HTML
  return xss(input.trim());
};

module.exports = {
  hashPassword,
  comparePassword,
  sanitize
};
