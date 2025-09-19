<!-- ---------structure--------- -->

recipes-app/
│
├─ backend/                 # Express сървър + Catbox
│   ├─ server.js
│   └─ package.json
│
├─ frontend/                # Next.js фронтенд
│   ├─ pages/
│   ├─ public/
│   └─ package.json
│
├─ .env                     # всички тайни
└─ render.yaml              # конфигурация за Render (monorepo)

<!-- ---------structure--------- -->

backend/server.js – Express сървър с Catbox upload.
backend/package.json – само за бекенд зависимостите.
frontend/ – стандартен Next.js проект (pages/, public/, package.json).

.env – всички тайни (Catbox userhash, порт, ALLOWED_ORIGIN и т.н.).

render.yaml – конфигурация за monorepo деплой на Render.