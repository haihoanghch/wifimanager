-- ============================================================
-- WiFi Manager — Cloudflare D1 Schema
-- Run: wrangler d1 execute wifi-manager-db --file=./schema.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS devices (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  mac_address   TEXT UNIQUE NOT NULL,
  ip_address    TEXT,
  device_type   TEXT DEFAULT 'router',   -- router | access_point | mesh_node | repeater
  model         TEXT,
  firmware      TEXT,
  location      TEXT,
  status        TEXT DEFAULT 'offline',  -- online | offline | warning
  wifi_ssid     TEXT,
  wifi_password TEXT,
  wifi_band     TEXT DEFAULT '2.4GHz',   -- 2.4GHz | 5GHz | 6GHz
  channel       INTEGER DEFAULT 6,
  security      TEXT DEFAULT 'WPA2',
  hidden_ssid   INTEGER DEFAULT 0,
  signal_strength   INTEGER DEFAULT -80,
  connected_clients INTEGER DEFAULT 0,
  uptime_seconds    INTEGER DEFAULT 0,
  gateway       TEXT,
  subnet_mask   TEXT DEFAULT '255.255.255.0',
  dns_primary   TEXT DEFAULT '8.8.8.8',
  dns_secondary TEXT DEFAULT '8.8.4.4',
  last_seen     TEXT,
  created_at    TEXT DEFAULT (datetime('now')),
  updated_at    TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS wifi_history (
  id          TEXT PRIMARY KEY,
  device_id   TEXT NOT NULL,
  old_ssid    TEXT,
  new_ssid    TEXT,
  changed_by  TEXT DEFAULT 'admin',
  changed_at  TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reboot_logs (
  id          TEXT PRIMARY KEY,
  device_id   TEXT NOT NULL,
  reason      TEXT,
  success     INTEGER DEFAULT 1,
  rebooted_by TEXT DEFAULT 'admin',
  rebooted_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ip_changes (
  id          TEXT PRIMARY KEY,
  device_id   TEXT NOT NULL,
  old_ip      TEXT,
  new_ip      TEXT,
  changed_by  TEXT DEFAULT 'admin',
  changed_at  TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS alerts (
  id          TEXT PRIMARY KEY,
  device_id   TEXT,
  type        TEXT NOT NULL,     -- offline | signal | security | firmware | clients
  message     TEXT NOT NULL,
  severity    TEXT DEFAULT 'info', -- info | warning | critical
  is_read     INTEGER DEFAULT 0,
  created_at  TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS traffic_stats (
  id          TEXT PRIMARY KEY,
  device_id   TEXT NOT NULL,
  download_mbps REAL DEFAULT 0,
  upload_mbps   REAL DEFAULT 0,
  recorded_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE
);

-- ============================================================
-- Sample Data
-- ============================================================
INSERT OR IGNORE INTO devices VALUES
('dev-001','Router Phòng Khách','AA:BB:CC:DD:EE:01','192.168.1.1','router','TP-Link AX3000','v2.1.0','Phòng Khách','online','HomeNet_5G','p@ssw0rd123','5GHz',36,'WPA3',0,-43,8,950400,'192.168.1.1','255.255.255.0','8.8.8.8','8.8.4.4',datetime('now'),datetime('now'),datetime('now')),
('dev-002','Access Point Phòng Ngủ','AA:BB:CC:DD:EE:02','192.168.1.2','access_point','Ubiquiti UAP-AC','v6.2.0','Phòng Ngủ','online','HomeNet_2G','p@ssw0rd123','2.4GHz',6,'WPA2',0,-61,3,432000,'192.168.1.1','255.255.255.0','1.1.1.1','1.0.0.1',datetime('now'),datetime('now'),datetime('now')),
('dev-003','Router Văn Phòng','AA:BB:CC:DD:EE:03','192.168.2.1','router','ASUS RT-AX88U','v3.0.0.4','Văn Phòng','offline','OfficeNet','Offi<3_2024','5GHz',149,'WPA2',0,-99,0,0,'192.168.2.1','255.255.255.0','8.8.8.8','8.8.4.4',datetime('now','-2 hours'),datetime('now'),datetime('now')),
('dev-004','Mesh Node Nhà Bếp','AA:BB:CC:DD:EE:04','192.168.1.3','mesh_node','Google Nest WiFi','v14393','Nhà Bếp','online','HomeNet_5G','p@ssw0rd123','5GHz',36,'WPA3',0,-54,2,259200,'192.168.1.1','255.255.255.0','8.8.8.8','8.8.4.4',datetime('now'),datetime('now'),datetime('now')),
('dev-005','Repeater Sân Thượng','AA:BB:CC:DD:EE:05','192.168.1.4','repeater','TP-Link RE605X','v1.0.3','Sân Thượng','warning','HomeNet_EXT','p@ssw0rd123','5GHz',36,'WPA2',0,-74,1,86400,'192.168.1.1','255.255.255.0','8.8.8.8','8.8.4.4',datetime('now','-5 minutes'),datetime('now'),datetime('now'));

INSERT OR IGNORE INTO alerts VALUES
('alr-001','dev-003','offline','Router Văn Phòng đã offline hơn 2 giờ. Kiểm tra nguồn điện và kết nối mạng.','critical',0,datetime('now','-10 minutes')),
('alr-002','dev-005','signal','Tín hiệu tại Sân Thượng rất yếu (-74 dBm). Cân nhắc thêm thiết bị khuếch đại.','warning',0,datetime('now','-1 hour')),
('alr-003','dev-002','signal','Tín hiệu Phòng Ngủ giảm xuống -61 dBm. Kiểm tra vật cản.','warning',0,datetime('now','-2 hours')),
('alr-004','dev-001','firmware','Có bản firmware mới v2.2.0 cho TP-Link AX3000. Nên cập nhật.','info',1,datetime('now','-6 hours')),
('alr-005','dev-001','security','Phát hiện 5 lần đăng nhập sai mật khẩu từ IP 192.168.1.99','critical',0,datetime('now','-30 minutes'));

INSERT OR IGNORE INTO reboot_logs VALUES
('rb-001','dev-001','Khởi động định kỳ hàng tuần',1,'admin',datetime('now','-7 days')),
('rb-002','dev-002','Cập nhật firmware v6.2.0',1,'admin',datetime('now','-14 days')),
('rb-003','dev-003','Sự cố mất kết nối',0,'admin',datetime('now','-3 days'));

INSERT OR IGNORE INTO wifi_history VALUES
('wh-001','dev-001','OldNet_Home','HomeNet_5G','admin',datetime('now','-30 days')),
('wh-002','dev-003','Office_WiFi','OfficeNet','admin',datetime('now','-60 days'));
