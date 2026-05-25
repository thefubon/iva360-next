# IVA360

Монорепозиторий: `apps/web` (Next.js, :3000), `apps/cms` (Payload CMS, :3333), `packages/shared` (типы + Zod).

Self-hosted деплой в РФ через GitLab CI/CD и Docker.

## Структура

```
iva360-next/
├── apps/web/
├── apps/cms/
├── packages/shared/
├── docker-compose.yml
├── docker-compose.prod.yml
├── .gitlab-ci.yml
└── scripts/dev.sh
```

## Локально

```bash
cp .env.example .env   # PAYLOAD_SECRET, POSTGRES_PASSWORD (= DATABASE_URL)
pnpm install && pnpm dev
```

- Web: http://localhost:3000
- Admin: http://localhost:3000/admin (rewrite → CMS :3333)
- MinIO console: http://localhost:9001

| Команда | Описание |
|---------|----------|
| `pnpm dev` | Docker + migrate + CMS + Web |
| `pnpm dev:web` / `pnpm dev:cms` | Один сервис |
| `pnpm build` | Сборка web и cms |
| `pnpm test:gate` | lint, typecheck, test, build, audit |
| `pnpm types:check` | payload-types diff с git |

Переменные окружения — `.env.example`.

## Продакшен

```bash
export CI_REGISTRY_IMAGE=registry.gitlab.example.com/group/iva360
export IMAGE_TAG=latest
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

GitLab CI: **quality** → **build** (образы web/cms) → **deploy** (runner с тегом `deploy`).

Сервисы: `web:3000`, `cms:3333`, `postgres`, `minio`, опционально `nginx`.

- Один домен: nginx → web; Next.js rewrites `/admin`, `/api` на CMS
- Поддомены: `iva360.ru` → web, `cms.iva360.ru` → cms (`CMS_PUBLIC_URL`)

Миграции:

```bash
docker compose -f docker-compose.prod.yml run --rm cms \
  node node_modules/payload/bin.js migrate
```

CI variables: `POSTGRES_PASSWORD`, `PAYLOAD_SECRET`, `S3_*`.

## UI Kit (shadcn)

`apps/web/components.json` → `@iva360`: сейчас `uikit-iva360-react.vercel.app` (CDN для `shadcn add`), цель — `uikit.iwa360.ru`. Запуск из `apps/web`: `pnpm dlx shadcn@latest add …`.

## @iva360/shared

Типы Payload и Zod-схемы. См. [packages/shared/README.md](packages/shared/README.md).
