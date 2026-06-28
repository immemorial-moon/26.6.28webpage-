const mysql = require('mysql2');

// 创建数据库连接池
const pool = mysql.createPool({
    host: 'localhost',      // 数据库地址（本地就用 localhost）
    user: 'suroot',           // 数据库用户名
    password: 'password',     // 您的数据库密码（改成您自己的）
    database: 'forum_db',   // 数据库名称
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 导出支持 Promise 的连接
module.exports = pool.promise();