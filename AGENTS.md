# Agent Rules

## Frontend Architecture (Nuxt 4)

Khi xây dựng hoặc mở rộng chc năng mới trên frontend, tuân thủ cấu trúc modular theo feature sau:

### 1. Pages ch là orchestrator

- `pages/**/*.vue` chỉ được phép:
  - Khởi tạo composables/stores.
  - Ghép các component từ `components/<feature>/`.
  - Xử lý routing, head meta, polling lifecycle.
- Không chứa markup phức tạp, UI logic hay call API trực tiếp.

### 2. Components theo feature

- Mỗi feature có thư mục riêng trong `app/components/<feature>/`.
  - Ví dụ: `app/components/mail/MailGenerator.vue`.
- Mỗi component chỉ làm một nhiệm vụ duy nhất, dễ debug, dễ test.
- Component càng nhỏ càng tốt, tránh component > 200 dòng.
- Props/emits phải rõ ràng, sử dụng TypeScript types.

### 3. Composables theo feature

- Mỗi feature có thư mục riêng trong `app/composables/<feature>/`.
  - Ví dụ: `app/composables/mail/useMailApi.ts`.
- Tất cả call API backend phải nằm trong composables, không gọi `fetch` trực tiếp từ store hay page.
- Tách riêng:
  - API calls (`useXxxApi.ts`)
  - Business logic reusable (`useXxxClipboard.ts`, `useXxxPolling.ts`, ...)

### 4. Stores chỉ lưu state

- `app/stores/<feature>.ts` chỉ lưu state và getters.
- Actions trong store dispatch đến composables để lấy dữ liệu, sau đó cập nhật state.
- Không chứa logic gọi API trực tiếp.

### 5. Shared utilities

- Helpers dùng chung đặt trong `app/utils/`.
- Ví dụ: `app/utils/date.ts` cho format ngày giờ.

### 6. Quy tắc khi thêm chc năng mới

- Nếu feature chưa có thư mục, tạo `components/<feature>/`, `composables/<feature>/`, và store nếu cần.
- Luôn tách:
  - Page → component → composable → store.
- Không viết lại logic đã có trong composable.
- **Bắt buộc tạo file test cho mỗi tính năng mới**:
  - Backend (NestJS + Jest): file `test/unit/<feature>/<name>.spec.ts`.
    - Ưu tiên test: service, controller, pure utilities.
    - Mock các dependency bên ngoài (database, redis, IMAP, external API).
  - Frontend (Nuxt 4 + Vitest): file `tests/<layer>/<feature>/<name>.spec.ts`.
    - u tiên test: composables API, stores (Pinia), utilities.
    - Sử dụng `vi.fn()` để mock `fetch` và các dependency.
  - Mỗi file logic nghiệp vụ (service, composable, store, utility) nên có test đi kèm.
