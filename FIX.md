# Что делать прямо сейчас

## Шаг 1 — Скачай обновлённый архив и замени файлы

Заменить два файла в проекте:
- `.vscodeignore`  (убрано исключение esbuild.mjs)
- `package.json`   (убрана строка с icon, которой не существует)

Либо просто замени их содержимое вручную (они маленькие).

---

## Шаг 2 — Установи зависимости (если не сделал)

```
npm install
```

---

## Шаг 3 — Собери проект

```
npm run build
```

После этого должен появиться файл `dist/extension.js`.
Проверь: `dir dist` (Windows) или `ls dist/`.

---

## Шаг 4 — Для локального теста (F5)

Просто нажми F5 — выбери "Run Extension".
Откроется новое окно VS Code с расширением.

---

## Шаг 5 — Для публикации на маркетплейс

### 5a. Замени publisher в package.json
Открой package.json, найди строку:
  "publisher": "your-publisher-id"
Замени "your-publisher-id" на свой реальный publisher ID
(тот, что создал на marketplace.visualstudio.com/manage)

### 5b. Упакуй
```
npx @vscode/vsce package
```

(Используй npx чтобы не устанавливать vsce глобально)

### 5c. Установи локально для проверки
```
code --install-extension flametrack-0.1.0.vsix
```

### 5d. Опубликуй
```
npx @vscode/vsce publish
```

---

## Частые ошибки

**"Found no documents"** — нет dist/extension.js. Запусти `npm run build`.

**"Publisher не существует"** — зарегистрируй на marketplace.visualstudio.com/manage

**"Missing icon"** — убедись что строка "icon" удалена из package.json (она уже удалена в новом архиве)

**DeprecationWarning о punycode/Buffer** — это предупреждения внутри самого vsce, не твоего кода. Игнорируй, на работу не влияют.
