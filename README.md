# 📨 VúTanh — Temp Mail

**Một dịch vụ email tạm thời (temporary mail) do [Thúy Hạnh Vũ](https://github.com/yourusername) xây dựng.**  
Giao diện brutalist / neo-brutalism hiện đại, backend kết nối IMAP để nhận mail real-time.

---

## ✨ Tính năng

- **🎲 Tạo email ngẫu nhiên** — một click là có địa chỉ mail mới
- **📬 Nhận mail real-time qua IMAP** — không phải refresh tay
- **📂 Quản lý nhiều domain** — linh hoạt thay đổi tên miền đích
- **🧹 Inbox sạch sẽ** — danh sách thư + chi tiết đầy đủ HTML/text
- **📋 Copy nhanh** — copy địa chỉ mail vào clipboard

---

## 🏗️ Kiến trúc

```
┌─────────────────┐          ┌──────────────┐         ┌─────────┐
│   Frontend       │ ◄────►   │    Backend     │ ◄────►  │  IMAP   │
│   Nuxt 4 + Vue 3 │  REST    │ Express TS     │  IMAP   │ Server  │
│   Tailwind v4    │          │              │         └─────────┘
└─────────────────┘          └──────────────┘
```

| Thành phần | Mô tả |
|---|---|
| `frontend/` | Nuxt 4 (SSR: false), Vue 3, Tailwind CSS v4, DaisyUI, Lucide Icons |
| `backend/` | Express + TypeScript, imapflow cho IMAP, mailparser để parse nội dung |
| `.env.example` | Template biến môi trường |

---

## 🚀 Cài đặt & chạy

### Yêu cầu

- [Node.js](https://nodejs.org/) ≥ 18
- [npm](https://www.npmjs.com/) hoặc pnpm/yarn
- Tài khoản IMAP (hoặc SMTP + IMAP enabled từ mail provider)

### 1. Clone repo

```bash
git clone https://github.com/vuthanh-vu/vuthanh.git
cd vuthanh
```

### 2. Cấu hình environment

```bash
cp .env.example .env
```

Chỉnh sửa `.env`:

```env
IMAP_HOST=mail.thanh.net
IMAP_PORT=993
IMAP_USER=your-email@thanh.net
IMAP_PASS=your-password

MAIL_DOMAINS=mail.thanh.net,domain2.com,domain3.com

PORT=3001
```

### 3. Cài đặt dependencies

```bash
# Backend
cd backend && npm install && cd ..

# Frontend
cd frontend && npm install && cd ..
```

### 4. Chạy dev server

Terminal 1 (backend):

```bash
cd backend && npm run dev
# or: npx tsx watch src/index.ts
```

Terminal 2 (frontend):

```bash
cd frontend && npm run dev
```

Truy cập: http://localhost:3000 → trang mail.temp

### 5. Build production

```bash
# Backend
cd backend && npm run build

# Frontend
cd frontend && npm run build
```

---

## 🔌 API Reference

| Method | Route | Mô tả |
|--------|-------|-------|
| `GET`  | `/api/health` | Healthcheck |
| `GET`  | `/api/emails/generate?domain=x.com` | Tạo email mới |
| `GET`  | `/api/emails/domains` | Danh sách domain khả dụng |
| `GET`  | `/api/emails/inbox/:address` | Lấy inbox của 1 email |
| `GET`  | `/api/emails/:uid` | Chi tiết 1 email theo UID |
| `POST` | `/api/emails/refresh` | Manual pull lại mail |
| `GET`  | `/api/emails` | Tất cả email (debug) |

---

## 🛠️ Stack

| Category | Công nghệ |
|----------|-----------|
| Frontend framework | Nuxt 4 (Vue 3) |
| Styling | Tailwind CSS v4 + DaisyUI |
| Icons | Lucide Icons (`nuxt-lucide-icons`) |
| Backend framework | Express + TypeScript |
| IMAP client | `imapflow` |
| Email parser | `mailparser` |

---

## 👤 Tác giả

[Thúy Hạnh Vũ](https://github.com/vuthanh-vu)  
*Xây dựng với ☕ và một chút chaos.*

## 📝 License

MIT
