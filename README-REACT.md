# Green Karabakh - React Version

Это React-версия приложения Green Karabakh. Оригинальные файлы сохранены и не изменены.

## Установка

1. Установите зависимости:
```bash
npm install
```

## Запуск

Запустите dev-сервер:
```bash
npm run dev
```

Приложение откроется автоматически на `http://localhost:3000`

## Структура проекта

```
green-karabakh/
├── src/                    # React приложение
│   ├── components/         # React компоненты
│   │   ├── MapContainer.jsx
│   │   ├── LayerControls.jsx
│   │   ├── InfoPanel.jsx
│   │   └── CheckpointModal.jsx
│   ├── data/               # Данные
│   │   └── embeddedData.js
│   ├── App.jsx             # Главный компонент
│   ├── App.css
│   ├── main.jsx            # Точка входа
│   └── index.css
├── index.html              # Оригинальная версия (vanilla JS)
├── index-react.html        # HTML для React (не используется, Vite использует index.html)
├── main.js                 # Оригинальный JavaScript
├── package.json            # Зависимости React
└── vite.config.js          # Конфигурация Vite
```

## Особенности React-версии

- ✅ Все данные встроены (не требует сервера)
- ✅ Компонентная архитектура
- ✅ Использует react-leaflet для карты
- ✅ Сохранение чекпоинтов в localStorage
- ✅ Все функции из оригинальной версии

## Оригинальная версия

Оригинальные файлы (vanilla JS версия) сохранены:
- `index-vanilla.html` - оригинальный HTML (откройте этот файл для vanilla версии)
- `main.js` - оригинальный JavaScript
- `style.css` - оригинальные стили
- `data/` - JSON файлы (не используются в React версии, данные встроены)

**Примечание:** `index.html` используется Vite для React версии. Для запуска оригинальной версии откройте `index-vanilla.html` в браузере.

