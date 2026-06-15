# Публикация FlameTrack в VS Code Marketplace

## Шаг 1 — Подготовка окружения

```bash
# Установить vsce (официальный инструмент публикации)
npm install -g @vscode/vsce

# Проверить версию
vsce --version
```

---

## Шаг 2 — Создать аккаунт издателя

1. Открыть https://marketplace.visualstudio.com/manage
2. Войти через Microsoft-аккаунт (или создать)
3. Нажать **Create publisher**
4. Придумать **Publisher ID** — это строка без пробелов, например `yourname` или `yourcompany`
5. Прописать его в `package.json`:
   ```json
   "publisher": "yourname"
   ```

---

## Шаг 3 — Personal Access Token (PAT)

1. Открыть https://dev.azure.com
2. Войти с тем же Microsoft-аккаунтом
3. В правом верхнем углу: User Settings → **Personal Access Tokens**
4. **New Token** → настроить:
   - Name: `vsce-flametrack`
   - Organization: **All accessible organizations**
   - Expiration: 1 year
   - Scopes → **Custom defined** → поставить галочку **Marketplace → Manage**
5. Скопировать токен (показывается один раз!)

---

## Шаг 4 — Войти через vsce

```bash
vsce login yourname
# Вставить токен при запросе
```

---

## Шаг 5 — Подготовить иконку

Нужна иконка `assets/icon.png` размером **128×128** или **256×256**.

```bash
mkdir -p assets
# Положить туда icon.png
```

Если иконки нет, временно убрать строку `"icon"` из `package.json`.

---

## Шаг 6 — Финальная сборка

```bash
# Убедиться что билд чистый
rm -rf dist/
npm run build   # node esbuild.mjs --production
```

Проверить что `dist/extension.js` создался и весит < 100 KB.

---

## Шаг 7 — Проверить .vscodeignore

Файл `.vscodeignore` уже настроен правильно. Убедиться что в пакет НЕ попадут:
- `src/` (исходники)
- `node_modules/`
- `*.ts`, `*.map`

---

## Шаг 8 — Упаковать и протестировать локально

```bash
# Создать .vsix файл
vsce package

# Установить локально для финального теста
code --install-extension flametrack-0.1.0.vsix
```

Открыть VS Code, убедиться что:
- В статус-баре появился значок 🔥
- Ctrl+Alt+F открывает панель статистики
- Команда в палитре `FlameTrack: Open Stats Panel` работает

---

## Шаг 9 — Публикация

```bash
# Опубликовать напрямую (без промежуточного .vsix)
vsce publish

# Или опубликовать конкретный .vsix
vsce publish --packagePath flametrack-0.1.0.vsix
```

Через ~5 минут расширение появится на:
https://marketplace.visualstudio.com/items?itemName=yourname.flametrack

---

## Шаг 10 — Обновление

При каждом обновлении нужно поднять версию в `package.json`:

```bash
# Патч-версия (0.1.0 → 0.1.1)
vsce publish patch

# Минорная (0.1.0 → 0.2.0)
vsce publish minor
```

---

## Полезные команды

```bash
vsce ls              # Что попадёт в пакет
vsce show yourname.flametrack  # Инфо с маркетплейса
vsce unpublish yourname.flametrack  # Снять с публикации
```

---

## Marketplace listing — что заполнить

На странице расширения хорошо работают:
- **Description** — уже есть в package.json
- **README.md** — показывается как главная страница. Добавить скриншоты!
- **CHANGELOG.md** — обязателен для доверия
- **Categories**: Other, Visualization
- **Tags**: streak, productivity, gamification, heatmap, motivation

### Скриншоты
VS Code Marketplace показывает первые изображения из README. Добавить в README:
```markdown
![FlameTrack Stats](assets/screenshot-stats.png)
![FlameTrack Status Bar](assets/screenshot-statusbar.png)
```
