import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const KEY_FILE = path.resolve(__dirname, '../../json jay/rosy-clover-509216-i1-dfbae6f3d3ef.json');
const ROOT_FOLDER_ID = '19tyh792qPRUqiJWDcR_rzJLl0o9QahnE';
const DB_PATH = path.resolve(__dirname, '../../data/golden_machine_db.json');
const SEED_PATH = path.resolve(__dirname, '../../src/database/seed-lots.js');
const DESKTOP_DIR = 'C:/Users/paranoia/Desktop/Товары_Для_Google_Диска';

export const lotsMeta = [
  {
    lotId: 'lot_cs2_grenades',
    folderName: '01. CS2 - Раскидки и Смоки (Все карты)',
    fileName: 'CS2_Раскидки_Смоки_Гайд.txt',
    fileContent: `=== 🎯 COUNTER-STRIKE 2: ПОЛНЫЙ СБОРНИК РАСКИДОК И БИНДОВ 2026 ===

1. ОФИЦИАЛЬНЫЙ ИНТЕРАКТИВНЫЙ 3D-НАВИГАТОР:
Ссылка: https://csnades.gg/
- Все карты: Mirage, Inferno, Nuke, Anubis, Dust2, Ancient, Vertigo.
- Выберите точку A / B / Mid -> тип гранаты (Смок, Молик, Флешка) -> точный прицел с видео-траекторией.

2. СКРИПТ ДЛЯ АВТО-ТРЕНИРОВКИ В ЛОББИ:
Скопируйте следующие команды в консоль CS2 (~):
sv_cheats 1; bot_kick; mp_warmup_end; mp_freezetime 0; mp_roundtime_defuse 60; sv_grenade_trajectory_prac_pipreview 1; sv_infinite_ammo 1; bind "alt" "noclip"; bind "c" "+jump; -attack; -jump"

3. ТОПОВЫЕ СМОКИ MIRAGE:
- Смок в Окно (Window): встать у мусорки на спавне Т -> прицел в верхний левый угол ковра -> W + Jumpthrow.
- Смок в Старт (Top Mid): встать у стены спавна Т -> прицел по антенне -> Jumpthrow.
- Смок в Коннектор (Connector): упор в угол ящиков -> прицел по козырьку ковра -> Jumpthrow.`
  },
  {
    lotId: 'lot_cs2_config_pro',
    folderName: '02. CS2 - PRO Конфиг autoexec и FPS Boost',
    fileName: 'autoexec.cfg',
    fileContent: `// === PRO AUTOEXEC CFG CS2 (2026 TIER-1 EDITION) ===
// Сохраните этот файл в папку:
// Steam/steamapps/common/Counter-Strike Global Offensive/game/csgo/cfg/autoexec.cfg

// 1. СЕТЕВЫЕ НАСТРОЙКИ И SUB-TICK
rate 1000000
cl_updaterate 128
cl_interp 0.015625
cl_interp_ratio 1

// 2. ОПТИМИЗАЦИЯ И FPS
fps_max 0
cl_autohelp 0
gameinstructor_enable 0
r_drawtracers_firstperson 0

// 3. УДОБНЫЕ КИБЕРСПОРТИВНЫЕ БИНДЫ
bind "c" "+jump; -attack; -jump" // Безупречный Jumpthrow
bind "v" "use weapon_c4; drop"   // Мгновенный сброс бомбы
bind "alt" "noclip"              // Ноклип для тренировок
bind "mouse3" "player_ping"      // Пинг колесиком мыши

// 4. ПАРАМЕТРЫ ЗАПУСКА STEAM:
// -novid -tickrate 128 +fps_max 0 -nojoy +exec autoexec.cfg -allow_third_party_software

echo ">>> PRO AUTOEXEC 2026 LOADED SUCCESSFULLY <<<"`
  },
  {
    lotId: 'lot_cs2_coaching',
    folderName: '03. CS2 - Материалы для Обучения и Коучинга',
    fileName: 'План_Обучения_и_Коучинга_CS2.txt',
    fileContent: `=== 🏆 ИНДИВИДУАЛЬНЫЙ КОУЧИНГ И ТРЕНИРОВКА CS2 (3000+ ELO) ===

ПЛАН ЗАНЯТИЯ:
1. Анализ вашей демки Faceit / Premier (11:13 близкие раунды).
2. Разбор таймингов выхода и позиционирования.
3. Исправление прицела (Crosshair Placement) и углов пика.
4. Программа тренировки аима на 30 дней.

ИНСТРУКЦИЯ ДЛЯ СТАРТА:
1. Напишите ваш Discord тег в чат заказа на FunPay.
2. Пришлите ссылку на матч Faceit или демку.
3. Согласуем удобное время голосового созвона (Discord).`
  },
  {
    lotId: 'lot_dota2_mmr_guide',
    folderName: '04. Dota 2 - Гайд по соло поднятию MMR (1000 - 6000+)',
    fileName: 'Dota2_MMR_Solo_Guide.txt',
    fileContent: `=== 🏆 ПОШАГОВЫЙ ГАЙД ПОДНЯТИЯ MMR В DOTA 2 (СЕКРЕТЫ МЕТЫ 2026) ===

1. АКТУАЛЬНЫЕ МЕТОВЫЕ СБОРКИ ПРО-ИГРОКОВ:
Сайт: https://dota2protracker.com/
(Обновление каждый час: винрейты, скиллбилды и порядок закупки топ-100 игроков мира).

2. ТАЙМИНГИ И МАКРО-ИГРА:
- 3:00 — Руны богатства + появление первых цветков лотуса в пруду.
- 6:00 — Руна усиления (контроль мидером/саппортом).
- 7:00 — Первые Руны Мудрости (дают огромный буст опыта саппортам).
- 14:00 — Вторые Руны Мудрости (не отдавать врагу ни при каких условиях!).
- 20:00 — Терзатель (Tormentor) — дает бесплатный Shard случайному герою.

3. ПРАВИЛО УЗКОГО ПУЛА:
- Играйте строго на 2-3 героях на одной роли.
- Не распыляйтесь на 20 разных персонажей, держите стабильный винрейт 60%+!`
  },
  {
    lotId: 'lot_dota2_micro_scripts',
    folderName: '05. Dota 2 - Бинды смарт-кастов и Микроконтроль',
    fileName: 'Dota2_Binds_and_Settings.txt',
    fileContent: `=== ⚡ НАСТРОЙКИ СМАРТ-КАСТОВ И МИКРОКОНТРОЛЯ DOTA 2 ===

1. ВАЖНЫЕ НАСТРОЙКИ В КЛИЕНТЕ DOTA 2:
- Включить: "Быстрое применение (Quickcast)" при нажатии клавиши.
- Включить: "Автовыбор призванных существ" (для иллюзионистов и суммонеров).
- Включить: "Умная атака" (герой атакует ближайшую к курсору цель).

2. ПОЛЕЗНЫЕ КОМАНДЫ ДЛЯ КОНСОЛИ (~):
dota_camera_distance 1200
dota_force_right_click_attack 1
dota_health_hurt_threshold 0
dota_pain_factor 0

3. МИКРОКОНТРОЛЬ СУММОНОВ (Meepo, Arc Warden, Chen):
- Группа 1 (1): Основной герой.
- Группа 2 (2): Все остальные существа/иллюзии.
- Группа 3 (3): Все юниты вместе.`
  },
  {
    lotId: 'lot_val_aim_routine',
    folderName: '06. Valorant - Рутина тренировки аима (AimLab & Range)',
    fileName: 'Valorant_Aim_Routine_2026.txt',
    fileContent: `=== 🎯 20-МИНУТНАЯ ПРОГРАММА ТРЕНИРОВКИ АИМА В VALORANT ===

1. КАЛЬКУЛЯТОР ИДЕАЛЬНОГО EDPI:
eDPI = DPI мыши * Внутриигровая чувствительность.
- Киберспортивный стандарт VCT: от 200 до 320 eDPI.
- Пример: 800 DPI мыши * 0.3 sens = 240 eDPI (золотая середина).

2. ЕЖЕДНЕВНАЯ РУТИНА В ПОЛИГОНЕ (THE RANGE):
- 5 минут: 100 ботов с броней (Sheriff, строго ван-тапы в голову с доводкой).
- 5 минут: Боты на средней скорости со стрейфом (шаг влево -> стоп -> выстрел -> шаг вправо).
- 5 минут: Vandal спрей-трансфер по мишеням на 20 и 30 метрах.
- 5 минут: Режим Deathmatch без звука (только реакция и позиционирование прицела).`
  },
  {
    lotId: 'lot_val_lineups',
    folderName: '07. Valorant - Все Лайнапы способностей (Sova, Viper, KJ)',
    fileName: 'Valorant_Interactive_Lineups.txt',
    fileContent: `=== 🏹 ИНТЕРАКТИВНЫЕ ЛАЙНАПЫ VALORANT 2026 ===

1. ГЛАВНЫЕ ОФИЦИАЛЬНЫЕ БАЗЫ ЛАЙНАПОВ:
- Портал 1: https://tracker.gg/valorant/guides/lineups
- Портал 2: https://lineupsvalorant.com/

2. КАК ПОЛЬЗОВАТЬСЯ:
- Карты: Ascent, Bind, Haven, Split, Sunset, Lotus, Abyss.
- Агенты: Sova (развед-стрелы и дабл-шок на плент), Viper (молли на дефьюз), Killjoy (нано-рои), Brimstone (ультимейт и молли).
- Все ориентиры привязаны к HUD-интерфейсу (полоска здоровья, иконки способностей, уголки зданий).`
  },
  {
    lotId: 'lot_gta5_money_guide',
    folderName: '08. GTA 5 Online - Мануал по соло фарму $5M в час',
    fileName: 'GTA_Online_Cayo_Perico_Solo_Guide.txt',
    fileContent: `=== 💰 МАНУАЛ ПО СОЛО-ФАРМУ В GTA ONLINE ($5,000,000 / ЧАС) ===

1. ОГРАБЛЕНИЕ CAYO PERICO СОЛО ЗА 7 МИНУТ:
- Подготовка: Подлодка Kosatka + вертолет Sparrow.
- Вход: Дренажный туннель (Drainage Tunnel) с резаком (Cutting Torch).
- Оружие: Набор "Конспиратор" с глушителями.
- Прохождение: Проплыть туннель -> подняться по правой лестнице -> ликвидировать 3 охранников -> забрать сейф в кабинете Эль Рубио -> забрать главную цель в подвале -> выйти через главные ворота -> повернуть налево и прыгнуть со скалы в океан -> уплыть под водой в акваланге.

2. ПАССИВНЫЙ БИЗНЕС:
- Ночной клуб (5 техников: Спецгруз, Оружие, Кокаин, Метамфетамин, Фальшивые банкноты).
- Пассивный доход $1,000,000+ каждые 24 часа без рутины!`
  },
  {
    lotId: 'lot_gta5_rp_starter',
    folderName: '09. GTA 5 RP - Шпаргалка правил серверов и собеседований',
    fileName: 'GTA_RP_Rules_and_Commands_Cheatsheet.txt',
    fileContent: `=== 🚗 ШПАРГАЛКА ТЕРМИНОВ И ПРАВИЛ GTA 5 RP (MAJESTIC / GTA5RP) ===

1. ОСНОВНЫЕ ТЕРМИНЫ ДЛЯ СОБЕСЕДОВАНИЯ:
- DM (DeathMatch) — убийство или нанесение урона игроку без веской IC-причины.
- DB (DriveBy) — убийство или таран персонажа с помощью транспортного средства.
- PG (PowerGaming) — преувеличение физических возможностей (например, драка кулаками против человека с автоматом).
- MG (MetaGaming) — использование информации из реального мира (Discord, стрим) в игровом процессе.
- RK (Repeat Kill) — намеренное повторное убийство одного и того же персонажа.

2. ПРАВИЛА ОТЫГРОВКИ КОМАНД:
- /me — действие от первого лица в прошедшем или настоящем времени:
  Пример: /me достал паспорт из правого кармана куртки и передал офицеру напротив
- /do — описание состояния мира от третьего лица:
  Пример: /do Паспорт находится в руках у офицера полиции.`
  },
  {
    lotId: 'lot_rust_wipe_guide',
    folderName: '10. Rust - Руководство по старту вайпа и Анти-рейд бункер',
    fileName: 'Rust_Wipe_Day_and_Bunker_Guide.txt',
    fileContent: `=== 🏕️ РУКОВОДСТВО ПО ИДЕАЛЬНОМУ СТАРТУ ВАЙПА В RUST ===

1. ПЕРВЫЕ 15 МИНУТ ОТ ПЛЯЖА:
- Собирайте не менее 30 кустов конопли (ткань для спальников и первого лука).
- Двигайтесь в сторону зеленого супермаркета или заправки (Oxum's Gas Station).
- Бросайте спальники каждые 2 квадрата карты, чтобы в случае смерти не бежать с пляжа.

2. ПОСТРОЙКА БУНКЕРА 2х1:
- Схема анти-рейд бункера: https://rustlabs.com/building
- Треугольный фундамент с перепадом высот создает пиксель-гэп, блокирующий прямой прострел и заставляющий рейдеров взрывать стены максимальной прочности.`
  },
  {
    lotId: 'lot_genshin_abyss_guide',
    folderName: '11. Genshin Impact - Гайд по Витой Бездне на 36 звезд',
    fileName: 'Genshin_Abyss_36_Stars_Guide.txt',
    fileContent: `=== ⭐ ЗАКРЫТИЕ 12 ЭТАЖА ВИТОЙ БЕЗДНЫ НА 36 ЗВЕЗД (F2P КОМАНДЫ) ===

1. КОМАНДА 1 (Националка): Сян Лин + Син Цю + Беннет + Сахароза/Кадзуха.
- Сян Лин: сет "Эмблема рассеченной судьбы", ВЭ 220%+, Крит 60/120.
- Беннет: сет "Церемония древней знати", оружие с максимальной базовой атакой.

2. КОМАНДА 2 (Гиперблум): Куки Синобу + Син Цю/Е Лань + Нахида/Дендро ГГ + Коллеи.
- Куки Синобу: полный сет в Мастерство Стихий (850-1000 МС), наносит по 30 000+ урона за взрыв каждого бутона!

3. ОФИЦИАЛЬНАЯ ИНТЕРАКТИВНАЯ КАРТА:
Ссылка: https://act.hoyolab.com/ys/app/interactive-map/index.html`
  },
  {
    lotId: 'lot_tarkov_loot_maps',
    folderName: '12. Escape from Tarkov - Карты лута, выходов и Таблица патронов',
    fileName: 'Tarkov_Loot_Maps_and_Ballistics.txt',
    fileContent: `=== 🎒 ESCAPE FROM TARKOV: КАРТЫ ЛУТА И БАЛЛИСТИКА ПАТРОНОВ ===

1. ЛУЧШИЕ ИНТЕРАКТИВНЫЕ КАРТЫ (Схроны, ключи, выходы):
Ссылка: https://mapgenie.io/escape-from-tarkov
- Доступны все карты: Улицы Таркова, Таможня, Маяк, Берег, Лес, Развязка.

2. ОФИЦИАЛЬНАЯ ТАБЛИЦА ПРОБИТИЯ ПАТРОНОВ:
Ссылка: https://eft-ammo.com/
- Всегда используйте патроны с пробитием 4-5 класса брони (минимум 5.45x39 ПП/БП, 7.62x39 ПС/БП, .300 Blackout AP).`
  },
  {
    lotId: 'lot_mc_auto_farms',
    folderName: '13. Minecraft - Чертежи автоматических ферм (1.20+)',
    fileName: 'Minecraft_Schematics_and_Farms.txt',
    fileContent: `=== ⛏️ СБОРНИК ЛУЧШИХ АВТОМАТИЧЕСКИХ ФЕРМ MINECRAFT ===

1. БАЗЫ ГОТОВЫХ СХЕМ ДЛЯ LITEMATICA:
- Портал 1: https://www.minecraft-schematics.com/
- Портал 2: https://abfielder.com/

2. КОМПАКТНАЯ ФЕРМА ЖЕЛЕЗА (350+ слитков/час):
- Платформа 5х5 на высоте 10 блоков над землей.
- 3 кровати и 3 компостницы для жителей.
- Зомби в лодке с биркой (Name Tag) по центру платформы.
- Поток воды смывает железных големов на костры над воронками в сундук!`
  },
  {
    lotId: 'lot_roblox_trading',
    folderName: '14. Roblox - Трейдинг и Таблицы ценностей предметов',
    fileName: 'Roblox_Trading_Value_Lists.txt',
    fileContent: `=== 💎 ОФИЦИАЛЬНЫЕ ТАБЛИЦЫ ЦЕННОСТЕЙ ТРЕЙДИНГА В ROBLOX ===

1. BLOX FRUITS VALUE LIST:
Ссылка: https://bloxfruitsvalues.com/

2. PET SIMULATOR 99 VALUE LIST:
Ссылка: https://petsimulatorvalues.com/

3. MURDER MYSTERY 2 VALUE LIST:
Ссылка: https://mm2values.com/

Всегда сверяйте справедливую стоимость трейда (W/F/L — Win/Fair/Loss) перед подтверждением сделки!`
  },
  {
    lotId: 'lot_steam_region_guide',
    folderName: '15. Steam - Безопасная смена региона 2026',
    fileName: 'Steam_Region_Change_Guide.txt',
    fileContent: `=== 🌐 ПОШАГОВАЯ ИНСТРУКЦИЯ ПО СМЕНЕ РЕГИОНА STEAM БЕЗ БАНА ===

1. Выйдите из аккаунта Steam на всех устройствах (Настройки -> Безопасность -> Завершить все сеансы).
2. Подключитесь через чистый IP целевой страны (Казахстан KZT или Украина UAH).
3. Добавьте в корзину самую дешевую игру за 10-20 рублей.
4. Оплатите покупку виртуальной или банковской картой целевой страны.
5. Валюта кошелька навсегда изменится на KZT/UAH, открывая доступ ко всем заблокированным играм!`
  },
  {
    lotId: 'lot_tg_premium_guide',
    folderName: '16. Telegram - Гайд по покупке Premium и Stars с выгодой 50%',
    fileName: 'Telegram_Premium_and_Stars_Guide.txt',
    fileContent: `=== ⭐ ПОКУПКА TELEGRAM PREMIUM И STARS С ЭКОНОМИЕЙ ДО 50% ===

1. ОФИЦИАЛЬНЫЙ АУКЦИОН И ПЛАТФОРМА:
Ссылка: https://fragment.com/

2. ИНСТРУКЦИЯ ПО ПОДКЛЮЧЕНИЮ:
- Установите официальный кошелек Tonkeeper (криптовалюта TON).
- Войдите на сайте fragment.com через Telegram.
- Перейдите в раздел "Premium" или "Stars", укажите ваш юзернейм и оплатите напрямую по официальному курсу TON без 30% комиссии Google Play и Apple App Store!`
  }
];

export async function setupGoogleDrive() {
  console.log('🚀 Подключение к Google Drive API...');
  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_FILE,
    scopes: ['https://www.googleapis.com/auth/drive']
  });
  const drive = google.drive({ version: 'v3', auth });

  // 1. Получаем существующие папки
  const existing = await drive.files.list({
    q: `'${ROOT_FOLDER_ID}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: 'files(id, name, webViewLink)'
  });
  const existingMap = new Map();
  for (const f of existing.data.files) {
    existingMap.set(f.name, f);
  }

  // 2. Создаем локальную директорию на Рабочем столе
  if (!fs.existsSync(DESKTOP_DIR)) {
    fs.mkdirSync(DESKTOP_DIR, { recursive: true });
  }

  const results = [];

  for (const item of lotsMeta) {
    let folder = existingMap.get(item.folderName);
    if (!folder) {
      console.log(`[Drive] Создание папки: "${item.folderName}"...`);
      const created = await drive.files.create({
        requestBody: {
          name: item.folderName,
          parents: [ROOT_FOLDER_ID],
          mimeType: 'application/vnd.google-apps.folder'
        },
        fields: 'id, name, webViewLink'
      });
      folder = created.data;

      // Делаем папку публичной для чтения по ссылке
      await drive.permissions.create({
        fileId: folder.id,
        requestBody: {
          role: 'reader',
          type: 'anyone'
        }
      });
    } else {
      console.log(`[Drive] Найдена существующая папка: "${item.folderName}"`);
    }

    const folderUrl = folder.webViewLink || `https://drive.google.com/drive/folders/${folder.id}`;

    // 3. Создаем локальный файл на Рабочем столе
    const localSubdir = path.join(DESKTOP_DIR, item.folderName);
    if (!fs.existsSync(localSubdir)) {
      fs.mkdirSync(localSubdir, { recursive: true });
    }
    const localFilePath = path.join(localSubdir, item.fileName);
    fs.writeFileSync(localFilePath, item.fileContent, 'utf-8');

    results.push({
      lotId: item.lotId,
      folderName: item.folderName,
      folderUrl,
      fileName: item.fileName,
      localFilePath,
      fileContent: item.fileContent
    });
  }

  // 4. Синхронизируем базу данных
  if (fs.existsSync(DB_PATH)) {
    const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    for (const res of results) {
      const lot = db.lots.find(l => l.id === res.lotId);
      if (lot) {
        lot.content = `📁 ВАШ МАТЕРИАЛ НА GOOGLE ДИСКЕ:\n${res.folderUrl}\n\nИнструкция и быстрый доступ:\n${res.fileContent}`;
      }
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
    console.log('✅ База данных golden_machine_db.json обновлена ссылками на Google Диск!');
  }

  console.log(`🎉 Все 16 папок на Google Диске созданы и привязаны к товарам!`);
  console.log(`📁 Готовые файлы для заливки сформированы в: ${DESKTOP_DIR}`);
  return results;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  setupGoogleDrive().catch(console.error);
}
