
CREATE TABLE t_p2604452_internet_gospel_radi.news (
  id SERIAL PRIMARY KEY,
  category VARCHAR(50) NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  date VARCHAR(50) NOT NULL,
  read_time VARCHAR(30) NOT NULL DEFAULT '3 min read',
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE t_p2604452_internet_gospel_radi.programs (
  id SERIAL PRIMARY KEY,
  time VARCHAR(20) NOT NULL,
  title VARCHAR(200) NOT NULL,
  host VARCHAR(200) NOT NULL,
  type VARCHAR(50) NOT NULL,
  day VARCHAR(20) NOT NULL DEFAULT 'Sunday',
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE t_p2604452_internet_gospel_radi.on_demand (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  artist VARCHAR(200) NOT NULL,
  duration VARCHAR(20) NOT NULL,
  type VARCHAR(50) NOT NULL,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE t_p2604452_internet_gospel_radi.admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed default admin (password: praise247)
INSERT INTO t_p2604452_internet_gospel_radi.admin_users (username, password_hash)
VALUES ('admin', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMlJbekRSj.l5HF5GFyW9j5Gve');

-- Seed news
INSERT INTO t_p2604452_internet_gospel_radi.news (category, title, excerpt, date, read_time) VALUES
('Community', 'Faith & Fellowship Conference Returns This Summer', 'Join thousands of believers for three days of worship, teaching, and community building at our annual gathering.', 'May 20, 2026', '3 min read'),
('Ministry', '24.7PraiseRadio Launches Youth Gospel Mentorship Program', 'A new initiative connecting seasoned gospel artists with young aspiring musicians across the nation.', 'May 18, 2026', '4 min read'),
('World', 'Gospel Music Reaches New Heights in Global Charts', 'Contemporary gospel artists break streaming records, bringing the message of hope to millions worldwide.', 'May 15, 2026', '5 min read'),
('Local', 'Community Prayer Walk Unites Neighborhoods in Hope', 'Over 500 residents joined hands last Sunday in a peaceful march for unity, healing, and restoration.', 'May 12, 2026', '2 min read');

-- Seed programs
INSERT INTO t_p2604452_internet_gospel_radi.programs (time, title, host, type, day, sort_order) VALUES
('6:00 AM', 'Morning Devotional', 'Pastor James', 'Devotional', 'Sunday', 1),
('8:00 AM', 'Gospel Sunrise', 'Sister Miriam', 'Music', 'Sunday', 2),
('10:00 AM', 'The Word Today', 'Rev. David Cole', 'Teaching', 'Sunday', 3),
('12:00 PM', 'Midday Praise', 'DJ Emmanuel', 'Music', 'Sunday', 4),
('2:00 PM', 'Faith & Family', 'Minister Grace', 'Talk Show', 'Sunday', 5),
('4:00 PM', 'Evening Hymns', 'Choir of Light', 'Music', 'Sunday', 6),
('7:00 PM', 'Sunday Night Live', 'Bishop T. Williams', 'Live', 'Sunday', 7),
('9:00 PM', 'Nightly Blessings', 'Minister Joy', 'Devotional', 'Sunday', 8);

-- Seed on_demand
INSERT INTO t_p2604452_internet_gospel_radi.on_demand (title, artist, duration, type) VALUES
('Total Surrender', 'Bishop T. Williams', '48:22', 'Sermon'),
('Hallelujah Rising', 'Choir of Light', '35:10', 'Music'),
('Walking in Purpose', 'Rev. David Cole', '52:44', 'Teaching'),
('Healing Rain', 'Sister Miriam', '28:05', 'Music'),
('Unshakeable Faith', 'Pastor James', '41:18', 'Sermon'),
('Songs of Zion', 'Grace Ensemble', '44:30', 'Music');
