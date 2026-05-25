# @iva360/shared

Типы Payload CMS и Zod-схемы для web, cms и CI.

## payload-types.ts

Автогенерация — не редактировать вручную.

```bash
pnpm --filter @iva360/cms generate:types
```

Закоммить изменения вместе с правками коллекций. CI job `types:check` падает при рассинхроне.

```typescript
import type { User, Media } from '@iva360/shared'
```

## Zod

```typescript
import { userSchema, mediaCreateSchema, parseCmsEnv } from '@iva360/shared'
```

| Схема | Назначение |
|---|---|
| `userSchema`, `userLoginSchema`, `userCreateSchema` | User |
| `mediaSchema`, `mediaCreateSchema`, `mediaUploadResponseSchema` | Media |
| `parseCmsEnv`, `parseWebEnv`, `dockerEnvSchema` | Env |

## Команды

```bash
pnpm --filter @iva360/shared typecheck
pnpm --filter @iva360/shared lint
```
