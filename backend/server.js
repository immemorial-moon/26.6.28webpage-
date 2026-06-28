const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const db = require('./db');  // 👈 这里引用了刚创建的 db.js

const app = express();
const PORT = 3000;

// 中间件,用于处理跨域和解析 JSON 请求体
app.use(cors());
app.use(bodyParser.json());

// 定义 JWT 相关函数（在使用之前）
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'forum-secret-key-2024';
const JWT_EXPIRES_IN = '7d';

const generateToken = (userId, username, nickname) => {
  return jwt.sign({ id: userId, username, nickname }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// 5. 定义 authenticateToken 中间件（重要：在使用它的路由之前定义）
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

// 获取留言（返回昵称）
app.get('/api/messages', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT m.id, m.username, m.nickname, m.content, m.created_at 
       FROM messages m 
       ORDER BY m.created_at DESC`
    );
    res.json({
      success: true,
      data: rows.map(row => ({
        id: row.id,
        username: row.username,
        nickname: row.nickname || row.username,
        text: row.content,
        time: new Date(row.created_at).toLocaleString()
      }))
    });
  } catch (error) {
    console.error('查询失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 添加留言（需要认证，使用昵称）
app.post('/api/messages', authenticateToken, async (req, res) => {
  const { text, nickname } = req.body;
  const username = req.user.username;  // 从 token 获取
  
  if (!text) {
    return res.status(400).json({ success: false, message: '内容不能为空' });
  }
  
  try {
    const [result] = await db.query(
      'INSERT INTO messages (username, nickname, content) VALUES (?, ?, ?)',
      [username, nickname || username, text]
    );
    
    res.json({
      success: true,
      data: {
        id: result.insertId,
        username,
        nickname: nickname || username,
        text,
        time: new Date().toLocaleString()
      }
    });
  } catch (error) {
    console.error('插入失败:', error);
    res.status(500).json({ success: false, message: '保存失败' });
  }
});






// ========== 用户注册 ==========
app.post('/api/auth/register', async (req, res) => {
  const { username, nickname, password } = req.body;

  if (!username || !nickname || !password) {
    return res.status(400).json({ success: false, message: '请填写完整信息' });
  }

  if (username.length < 3 || username.length > 20) {
    return res.status(400).json({ success: false, message: '用户名长度 3-20 字符' });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, message: '密码至少 6 位' });
  }

  try {
    // 检查用户名是否已存在
    const [existing] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: '用户名已被注册' });
    }

    // 加密密码
    //const hashedPassword = await bcrypt.hash(password, 10);

    // 插入用户
    const [result] = await db.query(
      'INSERT INTO users (username, nickname, password) VALUES (?, ?, ?)',
      [username, nickname, password]
    );

    // 生成 token
    const token = generateToken(result.insertId, username, nickname);

    res.json({
      success: true,
      message: '注册成功',
      data: { id: result.insertId, username, nickname, token }
    });
  } catch (error) {
    console.error('注册失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// ========== 用户登录 ==========
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: '请填写用户名和密码' });
  }

  try {
    const [users] = await db.query(
      'SELECT id, username, nickname, password FROM users WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({ success: false, message: '用户名或密码错误' });
    }

    const user = users[0];
    
    // 改为明文密码比对（不使用 bcrypt）
    if (password !== user.password) {
      return res.status(401).json({ success: false, message: '用户名或密码错误' });
    }

    const token = generateToken(user.id, user.username, user.nickname);

    res.json({
      success: true,
      message: '登录成功',
      data: { id: user.id, username: user.username, nickname: user.nickname, token }
    });
  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// ========== 获取当前用户信息（验证 token） ==========
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  res.json({
    success: true,
    data: {
      id: req.user.id,
      username: req.user.username,
      nickname: req.user.nickname
    }
  });
});

app.listen(PORT, () => {
    console.log(`后端服务运行在 http://localhost:${PORT}`);
});

//======访问统计API=========
app.post('/api/stats/record', async(req, res) => {
  try{
    const today = new Date().toISOString().split('T')[0];// 获取当前日期

    await db.query(
      `INSERT INTO visit_stats (date, count) 
      VALUES (?, 1) 
      ON DUPLICATE KEY UPDATE count = count + 1`,
      [today]
    );

    //res中返回成功响应
    res.json({ success: true, message: '访问统计记录成功' });
  } catch (error) {
    console.error('记录访问统计失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }

});

//获取统计数据
app.get('/api/stats/get', async (req, res) => {
  try{
    //获取总访问人数
    const [totalResult] = await db.query(`SELECT SUM(count) AS total FROM visit_stats`);

    //获取今日访问人数
    const today = new Date().toISOString().split('T')[0];
    const [todayResult] = await db.query(
      `SELECT count FROM visit_stats WHERE date = ?`,
      [today]
    );

    const todayCount = todayResult.length > 0 ? todayResult[0].count : 0;

    res.json({
      success: true,
      data:{
        total: totalResult[0].total || 0,
        today: todayCount
      }
    });


  }  catch (error) {
    console.error('获取访问统计失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});


//=====帖子相关API=====

// 获取帖子列表（分页）
app.get('/api/posts', async(req, res) => {
  const page = parseInt(req.query.page) || 1;// 当前页码，默认为1
  const pageSize = parseInt(req.query.pageSize) || 20;// 每页条数，默认为20
  const offset = (page - 1) * pageSize; // 计算偏移量,用于 SQL 查询

  try{
    // 查询帖子列表，按照最后回复时间排序
    const [posts] = await db.query(
      /*


      */
      `SELECT p.*,
        (SELECT COUNT(*) FROM replies r WHERE r.post_id = p.id) AS reply_count
        FROM posts p
       ORDER BY p.last_reply_time DESC, p.created_at DESC
       LIMIT ? OFFSET ? `,
      [pageSize, offset]
    );

  const [total] = await db.query(`SELECT COUNT(*) AS total FROM posts`);

  res.json({
    success: true,
    data: posts,
    total: total[0].total,
    page,
    pageSize
  });
  } catch (error) {
    console.error('获取帖子列表失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

//获取单个帖子详情（包括回复列表）
app.get('/api/posts/:id', async(req, res) => {
  const postId = req.params.id;

  try {
    // 获取帖子信息
    const [posts] = await db.query(
      `SELECT * FROM posts WHERE id = ?`,
      [postId]
    );

    if (posts.length === 0) {
      return res.status(404).json({ success: false, message: '帖子不存在' });
    }

    //增加浏览次数
    await db.query(
      `UPDATE posts SET view_count = view_count + 1 WHERE id = ?`,
      [postId]
    );

    // 获取回复列表 - 直接使用 replies 表，不需要关联 users
    const [replies] = await db.query(
      `SELECT * FROM replies WHERE post_id = ? ORDER BY created_at ASC`,
      [postId]
    );

    res.json({
      success: true,
      data: {
        post: posts[0],
        replies
      }
    });

  } catch (error) {
    console.error('获取帖子详情失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 发布新帖子（需要登录）
app.post('/api/posts', authenticateToken, async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;
  const username = req.user.username;
  const nickname = req.user.nickname;
  
  if (!title || !content) {
    return res.status(400).json({ success: false, message: '请填写标题和内容' });
  }
  
  if (title.length > 100) {
    return res.status(400).json({ success: false, message: '标题不能超过100个字符' });
  }
  
  try {
    const [result] = await db.query(
      `INSERT INTO posts (title, content, user_id, username, nickname, last_reply_time) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [title, content, userId, username, nickname]
    );
    
    res.json({
      success: true,
      message: '发布成功',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('发布帖子失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 回复帖子（需要登录）
app.post('/api/posts/:id/replies', authenticateToken, async (req, res) => {
  const postId = req.params.id;
  const { content } = req.body;
  const userId = req.user.id;
  const username = req.user.username;
  const nickname = req.user.nickname;
  
  if (!content) {
    return res.status(400).json({ success: false, message: '请填写回复内容' });
  }
  
  try {
    // 检查帖子是否存在
    const [posts] = await db.query('SELECT id FROM posts WHERE id = ?', [postId]);
    if (posts.length === 0) {
      return res.status(404).json({ success: false, message: '帖子不存在' });
    }
    
    // 插入回复
    const [result] = await db.query(
      `INSERT INTO replies (post_id, content, user_id, username, nickname) 
       VALUES (?, ?, ?, ?, ?)`,
      [postId, content, userId, username, nickname]
    );
    
    // 更新帖子的回复数和最后回复时间
    await db.query(
      `UPDATE posts SET 
        reply_count = (SELECT COUNT(*) FROM replies WHERE post_id = ?),
        last_reply_time = NOW()
       WHERE id = ?`,
      [postId, postId]
    );
    
    res.json({
      success: true,
      message: '回复成功',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('回复失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});
