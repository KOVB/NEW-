# Річні комплекти Raifil для осмосу (−30%)

Ціни — роздріб із KeyCRM на 24.11.2026 (сайти Raifil, Aquanova і «Перша вода» були недоступні з мережі сесії).

| Позиція (SKU KeyCRM) | Роздріб | −30% | Собівартість |
|---|---|---|---|
| Набір 1-2-3 Raifil (1097) | 790 | 553 | 386.59 |
| Постфільтр вугільний RAIFIL (7294) | 430 | 301 | 177.73 |
| Мінералізатор RAIFIL (7295) | 550 | 385 | 249.81 |
| Raifil мембрана 50 GAL (701456) | 1290 | 903 | 547.33 |

## Комплекти

| Комплект | Склад | Роздріб | Ціна −30% | Собівартість | Маржа |
|---|---|---|---|---|---|
| Стандарт | 1-2-3 × 4, постфільтр × 2, мембрана 50 × 1 | 5 310 | **3 717** | 2 449 | 1 268 (34%) |
| MAX | Стандарт + мінералізатор × 2 | 6 410 | **4 487** | 2 949 | 1 538 (34%) |

Залишок наборів 1-2-3 на складі — 17 шт., тобто вистачить лише на 4 комплекти.

## Файли

- `raifil_annual_kits.jpg`: загальна картинка. Опублікована в KeyCRM storage:
  https://keycrm.s3.de.io.cloud.ovh.net/storage/whservice/uploads/2026-11-24/8e0mbvdvwqOfOzfr3AM8Omux0E0ZfcZH.jpg
- `make_card.py`: генератор картинки (`python3 make_card.py out.jpg`).
- `kits.js`: код для Make Code-модуля бота: каталог → вибір комплекту → телефон → замовлення в KeyCRM
  (джерело «👤 Сервіс», товари за SKU зі знижкою, тому залишки списуються по компонентах).

## Сценарій бота в Make

Код-модуль отримує поля оновлення Telegram (`text`, `chatId`, `firstName`, `lastName`, `username`,
`contactPhone`, `replyText` = `message.reply_to_message.text`, `cbId`, `cbData`, `cbChatId`) і повертає `route`:

- `catalog` → `sendPhoto` (`photo`, `caption` HTML, `markup`);
- `ask` → `answerCallbackQuery` (`cbQueryId`) + `sendMessage` (`text`, `markup` = force_reply);
- `order` → `POST https://openapi.keycrm.app/v1/order` з `orderJson`, далі повідомлення клієнту та менеджеру.

Каталог показується за командами `/start`, `/komplekt`, а в особистих чатах також за словами «комплект» або «картридж».
