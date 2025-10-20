# RBXPass (MVP)

Простой сервис активации Robux через GamePass на Next.js (App Router) + Prisma (SQLite).

## Запуск

```bash
npm install
# задать DATABASE_URL при первом запуске (если .env отсутствует)
DATABASE_URL="file:./dev.db" npx prisma migrate dev --name init
DATABASE_URL="file:./dev.db" npm run db:seed
npm run dev
```

## Переменные окружения
- `DATABASE_URL` — путь к SQLite, по умолчанию `file:./dev.db`
- `JWT_SECRET` — секрет для админского API (позже)

## Основные эндпоинты (публичные)
- POST `/api/validate-code`
- GET `/api/roblox-user?username=`
- GET `/api/roblox-games/:userId`
- GET `/api/roblox-gamepasses/:gameId`
- POST `/api/activate`
- GET `/api/status?code=`

## UI
- Главная: пошаговая форма активации
- `/status`: проверка статуса по короткому коду

## Заметки
- Лимитирование запросов через middleware (dev упрощение)
- Логи и админское API — в следующих задачах
