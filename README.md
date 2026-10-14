# README

Проект создан в GigaStudio

## Стек

- Next.js 16.2.1
- TypeScript
- Tailwind CSS 3.4.18
- shadcn/ui
- React 19.2.0

## Локальный запуск
```bash
bun install
bun run dev
```

Откройте http://localhost:3000

## Деплой

[Документация Cloud.ru](https://cloud.ru/docs/container-apps-evolution/ug/topics/quickstart)

### GitHub Pages

Workflow `Deploy to GitHub Pages` собирает статический сайт при push в `main` или
`master` и публикует содержимое `out/` в отдельную ветку `gh-pages`.

После первого успешного запуска откройте **Settings → Pages** и выберите источник
**Deploy from a branch**, ветку `gh-pages` и папку `/(root)`. Workflow должен иметь
разрешение записи содержимого репозитория (**Settings → Actions → General → Workflow
permissions → Read and write permissions**).
