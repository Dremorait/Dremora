const jwt = require('jsonwebtoken');

const adminRequired = (req, res, next) => {
  // Allow JWT in headers or cookies
  const token = req.cookies?.admin_token || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden. Admin role required.' });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized. Invalid or expired token.' });
  }
};

const internRequired = (req, res, next) => {
  const token = req.cookies?.intern_token || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'intern') {
      return res.status(403).json({ error: 'Forbidden. Intern role required.' });
    }
    req.intern = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized. Invalid or expired token.' });
  }
};

module.exports = {
  adminRequired,
  internRequired
};
