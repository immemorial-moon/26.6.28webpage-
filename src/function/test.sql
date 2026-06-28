
-- 访问统计
-- 删除旧表（如果存在）
DROP TABLE IF EXISTS visit_stats;

-- 创建新表
CREATE TABLE visit_stats (
    id INT PRIMARY KEY AUTO_INCREMENT,
    date DATE NOT NULL UNIQUE,
    count INT DEFAULT 1
);

-- 插入一条初始数据（从今天开始）
INSERT INTO visit_stats (date, count) 
VALUES (CURDATE(), 1)
ON DUPLICATE KEY UPDATE count = count + 1;




-- 帖子相关数据表
-- 1. 帖子表 (posts)
CREATE TABLE IF NOT EXISTS posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL COMMENT '帖子标题',
    content TEXT NOT NULL COMMENT '帖子内容',
    user_id INT NOT NULL COMMENT '发布者ID',
    username VARCHAR(50) NOT NULL COMMENT '发布者用户名',
    nickname VARCHAR(50) NOT NULL COMMENT '发布者昵称',
    view_count INT DEFAULT 0 COMMENT '浏览次数',
    reply_count INT DEFAULT 0 COMMENT '回复数量',
    last_reply_time TIMESTAMP NULL COMMENT '最后回复时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 2. 回复表 (replies)
CREATE TABLE IF NOT EXISTS replies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL COMMENT '所属帖子ID',
    content TEXT NOT NULL COMMENT '回复内容',
    user_id INT NOT NULL COMMENT '回复者ID',
    username VARCHAR(50) NOT NULL COMMENT '回复者用户名',
    nickname VARCHAR(50) NOT NULL COMMENT '回复者昵称',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. 为帖子表创建索引（提高查询速度）
CREATE INDEX idx_posts_created_at ON posts(created_at);
CREATE INDEX idx_posts_last_reply ON posts(last_reply_time DESC);
CREATE INDEX idx_replies_post_id ON replies(post_id);