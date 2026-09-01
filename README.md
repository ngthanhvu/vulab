# Temp Mail

Temporary Mail System: Nhận và xem mail real-time thông qua kết nối IMAP.

- **Stack**: Nuxt 4, Vue 3, Tailwind CSS v4, DaisyUI
- **Server**: Nitro (built-in Nuxt server routes)
- **Database**: SQLite (better-sqlite3)
- **Email**: imapflow, mailparser

## Cấu trúc thư mục

- `app/`: Frontend Vue components, pages, stores
- `server/`: Nitro API routes, IMAP service, SQLite
- `.env.example`: Mẫu cấu hình môi trường

## Chạy

```bash
cp .env.example .env
# Sửa .env với thông tin IMAP của bạn
npm install
npm run dev
```

## Tác giả

Nguyễn Thanh Vũ ([github.com/ngthanhvu](https://github.com/ngthanhvu))
