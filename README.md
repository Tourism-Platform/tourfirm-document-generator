# Document Generation Service

Изолированный Next.js-сервис генерации PDF-документов. У приложения нет пользовательского UI: единственный публичный контракт — HTTP API.

Проект не связан с DMC, CRM, Payload CMS и любыми другими репозиториями. Реальные backend endpoints на этом этапе не подключены.

## Назначение

Сервис принимает идентификатор invoice, проверяет авторизацию через абстрактный adapter, получает данные invoice, нормализует их в DTO, рендерит React-шаблон в HTML, печатает PDF через Playwright/Chromium и загружает файл через абстрактный uploader.

Сейчас весь backend заменён mock/stub adapter'ами, чтобы можно было локально прогнать полный pipeline генерации PDF.

## Архитектура

```
Frontend
    ↓
POST /api/documents/invoice
    ↓
Next.js Document Service
    ↓
Auth verification          → IAuthProvider (mock / stub)
    ↓
Fetch invoice data         → IBackendClient.getInvoiceData (mock / stub)
    ↓
Normalize DTO              → convertBackendInvoiceToDocument()
    ↓
React Invoice Template
    ↓
Playwright / Chromium
    ↓
PDF Buffer
    ↓
Upload document            → IBackendClient.uploadDocument (mock / stub)
    ↓
documentId
    ↓
Response frontend
```

Граница данных:

```
Backend response
    ↓
Zod backend schema
    ↓
IBackendInvoiceSource
    ↓
convertBackendInvoiceToDocument(...)
    ↓
IInvoiceDocumentData
    ↓
React template
```

## Request flow

1. Клиент отправляет `POST /api/documents/invoice` с JSON `{ "invoiceId": "example-id" }` и Cookie.
2. Route парсит body через Zod. Невалидный body → `400`.
3. `generateInvoice()` извлекает Cookie в `IAuthContext.cookieHeader` и вызывает auth adapter. Cookie не логируются.
4. При успешной авторизации backend client запрашивает данные invoice. Cookie доступен client'у для последующего forwarding.
5. Mapper приводит ответ к `IInvoiceDocumentData`.
6. React-шаблон рендерится в HTML через `react-dom/server` (`renderToStaticMarkup`).
7. Playwright печатает A4 PDF в память.
8. Uploader возвращает `documentId`.
9. Route отвечает `{ "documentId": "..." }`.

Ошибки маппятся на HTTP-статусы без stack traces и без внутренних деталей backend:

| Категория | HTTP |
| --- | --- |
| AuthenticationError | 401 / 403 |
| InvoiceDataError | 404 / 422 |
| BackendRequestError | 502 |
| DocumentUploadError | 502 |
| PdfGenerationError | 500 |

## Directory structure

```
src/
  app/api/health/route.ts
  app/api/documents/invoice/route.ts
  components/invoice/          React A4 template
  lib/auth/                    authorization adapters
  lib/backend/                 backend client + mocks
  lib/documents/               orchestration + upload
  lib/errors/                  typed errors
  lib/invoice/                 mapper + HTML render
  lib/pdf/                     Playwright renderer
  lib/config.ts
  lib/logger.ts
  schemas/
  types/invoice.ts
```

## Local development

```bash
npm install
npx playwright install chromium
cp .env.example .env.local
npm run dev
```

Проверка:

```bash
npm run typecheck
npm run lint
npm test
```

Health:

```bash
curl http://localhost:3000/api/health
```

Ожидаемый ответ: `{ "status": "ok" }`.

## Environment variables

Читаются только через `src/lib/config.ts`.

| Variable | Default | Purpose |
| --- | --- | --- |
| `USE_MOCK_BACKEND` | `true` | Использовать mock auth/data/upload |
| `BACKEND_URL` | empty | Placeholder. Не используется в HTTP-запросах |
| `DOCUMENT_SERVICE_SECRET` | empty | Placeholder. Не используется |

Реальные значения и имена cookie не задаются в этом репозитории.

## Mock mode

Пока `USE_MOCK_BACKEND` не равен `false`, сервис использует:

- `MockAuthProvider`
- `MockBackendClient` (invoice data + upload)

Правила mock-авторизации:

- нет Cookie → `401`
- Cookie равен `forbidden` → `403` (только mock-конвенция)
- любой другой Cookie → authorized

`GET /api/health` авторизацию не требует.

Mock invoice `invoiceId=not-found` даёт `404`.

## PDF generation

Шаблон — обычный HTML/CSS, рассчитанный на Chromium print. React-PDF не используется. HTML получается из React через `react-dom/server.renderToStaticMarkup` (runtime require: App Router запрещает статический импорт `react-dom/server`).

Локально запускается Playwright Chromium. PDF не пишется на диск как часть бизнес-логики: сервис возвращает Buffer и передаёт его uploader'у.

Нумерация страниц задаётся через Playwright `displayHeaderFooter`, потому что Chromium слабо поддерживает CSS `@page` margin boxes.

## Backend integration points

Реальные endpoints ещё не подключены. Когда они будут переданы, менять нужно только adapter-слой, не шаблон и не route.

### BACKEND AUTH ENDPOINT → TODO

Файл: `src/lib/backend/backend-client.ts` → `authorize()`

Также: `src/lib/auth/backend-auth-provider.ts`

Сейчас метод не вызывает `fetch` и не содержит URL. Сюда позже подключается реальный authorization endpoint. Incoming Cookie уже доступен как `cookieHeader`.

### INVOICE DATA ENDPOINT → TODO

Файл: `src/lib/backend/backend-client.ts` → `getInvoiceData()`

Converter: `src/lib/backend/converters/invoice.converters.ts` → `convertBackendInvoiceToDocument()`

Шаблон принимает только `IInvoiceDocumentData`. Backend JSON не протекает в React/PDF.

### DOCUMENT UPLOAD ENDPOINT → TODO

Файл: `src/lib/backend/backend-client.ts` → `uploadDocument()`

Также: `src/lib/documents/upload-document.ts`

Mock возвращает `{ documentId: "mock-document-id" }`.

`BACKEND_URL` и `DOCUMENT_SERVICE_SECRET` уже заложены в config как placeholder'ы и начнут использоваться только после подключения реального backend.

## Vercel deployment considerations

Проект рассчитан на Vercel Node.js server runtime, не Edge:

- API routes: `runtime = "nodejs"`
- `maxDuration = 60` для генерации PDF
- `serverExternalPackages`: `playwright`, `playwright-core`, `@sparticuz/chromium`

Стандартный Playwright Chromium binary слишком большой для Vercel serverless. Для production используется связка `playwright-core` + `@sparticuz/chromium`. Переключение делается в `src/lib/pdf/launch-browser.ts` по `VERCEL=1`.

Ограничения, которые нужно учитывать при деплое:

- размер serverless function
- холодный старт Chromium
- таймаут функции (PDF generation может быть дольше типичного API)
- `LD_LIBRARY_PATH` / runtime Node 22 могут понадобиться, если Chromium не стартует

Конкретный Vercel project, production secrets и существующая инфраструктура в этот bootstrap не входят.

## Mock generation

```bash
curl -X POST http://localhost:3000/api/documents/invoice \
  -H "Content-Type: application/json" \
  -H "Cookie: session=test" \
  -d "{\"invoiceId\":\"example-id\"}"
```

Ожидаемый ответ:

```json
{ "documentId": "mock-document-id" }
```
