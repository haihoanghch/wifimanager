# 📡 WiFi Manager v2.0

**Hệ thống quản lý thiết bị WiFi tập trung** — Next.js 14 · Cloudflare D1 · Vercel

![Tech Stack](https://img.shields.io/badge/Next.js-14-black) ![Cloudflare](https://img.shields.io/badge/Cloudflare-D1-orange) ![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)

---

## ✨ Tính Năng

| Trang | Mô Tả |
|-------|--------|
| 📊 **Dashboard** | Tổng quan hệ thống, biểu đồ traffic, danh sách thiết bị real-time |
| 🔌 **Thiết Bị** | Thêm/xóa/quản lý thiết bị, filter theo loại và trạng thái |
| 📶 **Cấu Hình WiFi** | Đổi SSID, mật khẩu, băng tần, kênh, bảo mật WPA2/3 |
| 🔄 **Khởi Động Lại** | Reboot từ xa, bulk reboot, log lịch sử |
| 🌐 **Quản Lý IP** | Cấu hình IP tĩnh/DHCP, Gateway, DNS nhanh |
| 🔔 **Cảnh Báo** | Theo dõi sự cố, đánh dấu đã đọc, lọc theo độ nghiêm trọng |
| ⚙️ **Cài Đặt** | Cấu hình hệ thống, thông báo, bảo mật |

---

## 🚀 Hướng Dẫn Deploy

### Bước 1: Tạo Cloudflare D1 Database

```bash
# Cài Wrangler
npm install -g wrangler

# Đăng nhập Cloudflare
wrangler login

# Tạo D1 database
wrangler d1 create wifi-manager-db
# → Ghi lại database_id

# Khởi tạo schema (local)
wrangler d1 execute wifi-manager-db --file=./schema.sql

# Khởi tạo schema (remote/production)
wrangler d1 execute wifi-manager-db --remote --file=./schema.sql
```

### Bước 2: Điền Database ID vào wrangler.toml

```toml
[[d1_databases]]
binding = "DB"
database_name = "wifi-manager-db"
database_id = "PASTE_YOUR_DATABASE_ID_HERE"
```

### Bước 3: Lấy Cloudflare API Token

1. Vào https://dash.cloudflare.com/profile/api-tokens
2. **Create Token** → Custom Token
3. Permissions: `D1 · Edit`, `Account · Read`
4. Ghi lại: **API Token** và **Account ID** (từ dashboard chính)

### Bước 4: Push lên GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USER/wifi-manager.git
git push -u origin main
```

### Bước 5: Deploy Vercel

```bash
# Hoặc dùng Vercel CLI
npm install -g vercel
vercel

# Chọn GitHub repo và deploy
```

**Hoặc:** Vào https://vercel.com → **Add New Project** → Import GitHub repo

### Bước 6: Thêm Environment Variables trên Vercel

Vào **Project → Settings → Environment Variables**:

| Tên Biến | Giá Trị |
|----------|---------|
| `CLOUDFLARE_ACCOUNT_ID` | Account ID của bạn |
| `CLOUDFLARE_API_TOKEN` | API Token vừa tạo |
| `D1_DATABASE_ID` | Database ID từ bước 1 |

### Bước 7: Redeploy

```bash
vercel --prod
```

---

## 🛠 Phát Triển Local

```bash
# Clone
git clone https://github.com/YOUR_USER/wifi-manager
cd wifi-manager

# Cài dependencies
npm install

# Tạo .env.local
cp .env.example .env.local
# Điền các giá trị Cloudflare

# Chạy dev server
npm run dev
# → http://localhost:3000

# Nếu chưa có D1, app tự dùng mock data
```

---

## 📁 Cấu Trúc Project

```
wifi-manager/
├── src/
│   ├── app/
│   │   ├── (app)/           # Pages (có Sidebar)
│   │   │   ├── dashboard/   # NOC Dashboard
│   │   │   ├── devices/     # Quản lý thiết bị
│   │   │   ├── wifi/        # Cấu hình WiFi
│   │   │   ├── reboot/      # Khởi động từ xa
│   │   │   ├── ip/          # Quản lý IP
│   │   │   ├── alerts/      # Trung tâm cảnh báo
│   │   │   └── settings/    # Cài đặt
│   │   └── api/
│   │       ├── devices/     # CRUD thiết bị → D1
│   │       ├── wifi/        # Cấu hình WiFi → D1
│   │       ├── reboot/      # Reboot + log → D1
│   │       ├── ip/          # Đổi IP + log → D1
│   │       └── alerts/      # Cảnh báo → D1
│   ├── components/
│   │   └── Sidebar.tsx
│   └── lib/
│       └── db.ts            # D1 REST client + mock data
├── schema.sql               # D1 schema + dữ liệu mẫu
├── wrangler.toml            # Cloudflare config
├── vercel.json              # Vercel config
└── .env.example             # Template biến môi trường
```

---

## 🔌 Tích Hợp Thiết Bị Thực

API `/api/reboot` hiện đang simulate. Để kết nối thiết bị thực, sửa file `src/app/api/reboot/route.ts`:

**OpenWrt (LuCI RPC):**
```javascript
const res = await fetch(`http://${ip}/cgi-bin/luci/rpc/sys`, {
  method: 'POST',
  headers: { 'X-Auth-Token': token },
  body: JSON.stringify({ method: 'reboot' })
})
```

**UniFi Controller:**
```javascript
const res = await fetch(`${controllerUrl}/api/s/default/cmd/devmgr`, {
  method: 'POST',
  body: JSON.stringify({ cmd: 'restart', mac: device.mac })
})
```

**TP-Link Tapo/Kasa (tplink-smarthome-api):**
```javascript
const device = await tplink.getDevice({ host: ip })
await device.reboot()
```

---

## ⚙️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + Custom CSS Variables
- **Database**: Cloudflare D1 (SQLite Edge)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Deploy**: Vercel (Singapore region)
- **Font**: Syne + IBM Plex Mono

---

## 📝 License

MIT License © 2024
