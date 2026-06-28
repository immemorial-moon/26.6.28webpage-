const jwt = require('jsonwebtoken');

const JWT_SECRET = 'forum-secret-key-2024';
const JWT_EXPIRES_IN = '7d';

// 生成 token
const generateToken = (userId, username, nickname) => {
  return jwt.sign({ id: userId, username, nickname }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

// 验证 token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// 中间件：验证登录状态
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: '请先登录' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ success: false, message: '登录已过期，请重新登录' });
  }

  req.user = decoded;
  next();
};

module.exports = { generateToken, verifyToken, authenticateToken };