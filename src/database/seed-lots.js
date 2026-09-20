export const defaultTemplates = {
  template1_guides: {
    id: 'template1_guides',
    name: 'Шаблон 1: Гайды на разные игры',
    description: 'Готовые пошаговые мануалы, секреты, билды, конфиги и обучающие материалы',
    category: 'guides',
    enabled: true,
    priceMultiplier: 1.0,
    prefixList: ['🔥 [ТОП-ГАЙД]', '⚡ [НОВИНКА 2026]', '💎 [ЛУЧШИЙ МАНУАЛ]', '🚀 [АВТОВЫДАЧА]', '⭐ [PRO СЕКРЕТЫ]'],
    buyerMessageTemplate: 'Спасибо за покупку! 🎮\n\nВаш гайд доступен по инструкции ниже:\n{guide_content}\n\nЕсли у вас возникнут вопросы — напишите мне в этот чат, с радостью подскажу! Буду благодарен за положительный отзыв ⭐'
  },
  template2_boost: {
    id: 'template2_boost',
    name: 'Шаблон 2: Бустеры / Обучение под разные игры',
    description: 'Услуги коучинга, калибровки, совместной игры, разбора ошибок и поднятия ранга',
    category: 'boost',
    enabled: true,
    priceMultiplier: 1.0,
    prefixList: ['🏆 [PRO ТРЕНЕР]', '🎯 [ОБУЧЕНИЕ 1 НА 1]', '⚡ [БЫСТРЫЙ БУСТ]', '🛡️ [БЕЗ ЧИТОВ / 100%]', '🔥 [РАЗБОР ОШИБОК]'],
    buyerMessageTemplate: 'Приветствую! Спасибо за заказ услуги обучения/бустинга! 🎯\n\nДля согласования времени напишите ваш никнейм и доступное время для связи. Приступаем в течение 10-15 минут!\n\nДетали услуги: {lot_name}'
  },
  template3_free: {
    id: 'template3_free',
    name: 'Шаблон 3: Свободный шаблон',
    description: 'Любые произвольные цифровые товары, ключи, конфиги, утилиты и аккаунты из базы',
    category: 'custom',
    enabled: true,
    priceMultiplier: 1.0,
    prefixList: ['💎 [ПРЕМИУМ ТОВАР]', '⚡ [МОМЕНТАЛЬНО]', '🛡️ [ГАРАНТИЯ]', '🚀 [АВТО-ВЫДАЧА 24/7]'],
    buyerMessageTemplate: 'Спасибо за оплату! 💎\n\nДанные по вашему заказу #{order_id}:\n{product_data}\n\nСпасибо за покупку, пожалуйста, подтвердите заказ и оставьте отзыв! ⭐'
  }
};

export const defaultLots = [
  // ==================== CS2 ====================
  {
    id: 'lot_cs2_grenades',
    gameId: 'cs2',
    gameName: 'Counter-Strike 2',
    templateType: 'template1_guides',
    subCategory: 'Гайды и Конфиги',
    title: 'Полный гайд по раскидкам на всех картах CS2 (Mirage, Inferno, Nuke, Anubis, Dust2)',
    shortDesc: 'Интерактивные смоки, флешки, молотовы с привязками и видео-подсказками',
    description: '🔥 Самый актуальный сборник раскидок для CS2!\n\nВключает:\n- Все ключевые смоки для Mirage, Inferno, Anubis, Nuke, Ancient, Dust 2\n- Моментальные ванвей-флешки и молотовы\n- Jumpthrow и Runthrow бинды\n- Секретные раскидки от Pro-игроков (S1mple, m0NESY, Donk)\n\n✅ Моментальная автовыдача 24/7!',
    price: 49,
    content: 'Ссылка на закрытый сборник интерактивных раскидок CS2 (100+ позиций) + скрипт с биндами для авто-тренировки: https://telegra.ph/CS2-Ultimate-Nade-Guide-2026',
    tags: ['cs2', 'раскидки', 'смоки', 'гайд', 'guide', 'кс2', 'smokes']
  },
  {
    id: 'lot_cs2_config_pro',
    gameId: 'cs2',
    gameName: 'Counter-Strike 2',
    templateType: 'template1_guides',
    subCategory: 'Конфиги и Настройки',
    title: 'PRO Конфиг CS2 + Оптимизация FPS и Задержки (Input Lag 0ms) 2026',
    shortDesc: 'autoexec.cfg от тир-1 игроков + настройки Nvidia/Windows для максимальной плавности',
    description: '⚡ Преврати CS2 в идеальную киберспортивную машину!\n\nЧто внутри:\n- Профессиональный autoexec.cfg с лучшими рейтами и саб-тиком\n- Оптимизация реестра и задержки мыши (Input Lag)\n- Настройки графики для максимального FPS и видимости сквозь молотовы\n- Бинды для очистки карты и быстрого дропа\n\n✅ Подходит для любого ПК!',
    price: 59,
    content: 'Инструкция по установке PRO конфига CS2 и архив с файлами autoexec.cfg: https://telegra.ph/CS2-Pro-Config-FPS-Boost-2026',
    tags: ['cs2', 'fps boost', 'config', 'конфиг', 'оптимизация', 'autoexec']
  },
  {
    id: 'lot_cs2_coaching',
    gameId: 'cs2',
    gameName: 'Counter-Strike 2',
    templateType: 'template2_boost',
    subCategory: 'Обучение / Коучинг',
    title: 'Индивидуальное обучение CS2 от игрока 3000+ ELO Faceit (Разбор демки + Аим)',
    shortDesc: '1 час персонального разбора позиционирования, таймингов, принятия решений и стрельбы',
    description: '🎯 Хочешь поднять 10 Level Faceit или 20,000+ Premier?\n\nВ урок входит:\n- Подробный разбор 1-2 ваших демок (найдем скрытые ошибки)\n- Анализ прицеливания и микро-корректировок\n- Постановка грамотной коммуникации и клатч-раундов\n- Индивидуальная карта тренировок на 30 дней вперед\n\n🛡️ Опыт коучинга более 4 лет, 100+ довольных учеников!',
    price: 349,
    content: 'Для начала коучинга напишите ваш ник на Faceit / Steam ID и удобное время в чат заказа!',
    tags: ['cs2', 'faceit', 'coaching', 'коучинг', 'обучение', 'разбор демки', 'буст']
  },

  // ==================== DOTA 2 ====================
  {
    id: 'lot_dota2_mmr_guide',
    gameId: 'dota2',
    gameName: 'Dota 2',
    templateType: 'template1_guides',
    subCategory: 'Гайды по поднятию MMR',
    title: 'Гайд: Как соло поднять с 1000 до 6000+ MMR в Dota 2 (Секреты меты и пула)',
    shortDesc: 'Пошаговый план выхода со дна: выбор метовых героев, тайминги фарма и макро-игра',
    description: '🔥 Застряли на Стражах, Героях или Легендах? Этот гайд изменит ваш винрейт!\n\nЧто разобрано в мануале:\n- 5 метовых героев для соло-победы на каждой позиции\n- Паттерны фарма лесных кемпов и контроль линии\n- Когда пушить, когда драться, а когда сплитпушить\n- Психология и как не тильтовать от руинеров\n\n✅ Проверено на текущем патче!',
    price: 69,
    content: 'Полный мануал по поднятию MMR Dota 2: https://telegra.ph/Dota2-Solo-MMR-Guide-2026',
    tags: ['dota2', 'mmr', 'дота2', 'гайд', 'поднятие рейтинга', 'guide']
  },
  {
    id: 'lot_dota2_micro_scripts',
    gameId: 'dota2',
    gameName: 'Dota 2',
    templateType: 'template1_guides',
    subCategory: 'Настройки и Бинды',
    title: 'PRO Настройки Dota 2: Умные смарт-касты, бинды микроконтроля (Meepo, Arc, Chen)',
    shortDesc: 'Полная конфигурация autoexec для идеального контроля иллюзий, суммонов и прокастов',
    description: '⚡ Освойте сложнейших героев без ошибок!\n\n- Бинды для мгновенного пуфа Meepo и контроля клона Arc Warden\n- Настройки автоатаки и быстрых кастов (Quickcast)\n- Отдаление камеры на разрешенное значение без бана\n\n✅ 100% безопасно для аккаунта!',
    price: 49,
    content: 'Гайд по настройке и биндам микроконтроля Dota 2: https://telegra.ph/Dota2-Pro-Binds-Camera-Guide-2026',
    tags: ['dota2', 'binds', 'бинды', 'микроконтроль', 'dota settings']
  },
  {
    id: 'lot_dota2_coaching',
    gameId: 'dota2',
    gameName: 'Dota 2',
    templateType: 'template2_boost',
    subCategory: 'Коучинг и Обучение',
    title: 'Тренировка и Разбор Реплея Dota 2 от Игрока с 8500+ MMR (Любая позиция)',
    shortDesc: 'Детальный анализ ошибок на лайнинге, макро-решений и итембилдов в Discord',
    description: '🎯 Перестаньте играть наугад — поймите логику побед в Dota 2!\n\n- Живой разбор вашей игры через демонстрацию экрана\n- Поиск ключевых ошибок в первые 10 минут матча\n- Правильный выбор нейтральных предметов и таймингов БКБ\n- Ответы на любые вопросы по вашей любимой роли',
    price: 299,
    content: 'Свяжитесь в чате заказа, укажите номер матча (Match ID) и ваш ник в Discord!',
    tags: ['dota2', 'coaching', 'коучинг', 'дота', 'разбор реплея', 'обучение']
  },

  // ==================== VALORANT ====================
  {
    id: 'lot_val_aim_routine',
    gameId: 'valorant',
    gameName: 'Valorant',
    templateType: 'template1_guides',
    subCategory: 'Гайды по стрельбе',
    title: 'Секретная программа тренировки аима Valorant + Рутина в AimLab / The Range',
    shortDesc: 'Ежедневный 20-минутный комплекс для постановки резкого хедшота и микро-доводки',
    description: '💎 Поднимите свой Headshot % до 35%+ за 14 дней!\n\nКомплекс включает:\n- Специфические плейлисты AimLab для механики Valorant\n- Разминка в полигоне с ботами (техники дрифта и контр-стрейфа)\n- Настройки чувствительности (eDPI) и прицела\n\n✅ Разработано на основе тренировок игроков VCT!',
    price: 55,
    content: 'Инструкция по тренировке аима Valorant + коды плейлистов AimLab: https://telegra.ph/Valorant-Pro-Aim-Routine-2026',
    tags: ['valorant', 'aim', 'аим', 'тренировка', 'aimlab', 'гайд']
  },
  {
    id: 'lot_val_lineups',
    gameId: 'valorant',
    gameName: 'Valorant',
    templateType: 'template1_guides',
    subCategory: 'Лайнапы и Способности',
    title: 'Все Лайнапы и Раскидки Valorant (Sova, Viper, Killjoy, Brimstone, Fade) на всех картах',
    shortDesc: 'Идеальные шок-стрелы, ульты, молли и ловушки под дефьюз и плент спайка',
    description: '🔥 Выигрывайте раунды в соло без перестрелок!\n\n- Лайнапы для пост-плента на всех 10 картах соревновательного пула\n- Стрелы Sova на обнаружение через всю карту\n- Сетапы ловушек Cypher и Killjoy, которые невозможно обойти',
    price: 65,
    content: 'База интерактивных лайнапов Valorant: https://telegra.ph/Valorant-All-Lineups-Guide-2026',
    tags: ['valorant', 'lineups', 'лайнапы', 'sova', 'viper', 'гайды']
  },

  // ==================== GTA V / GTA ONLINE / RP ====================
  {
    id: 'lot_gta5_money_guide',
    gameId: 'gta5',
    gameName: 'GTA V / Online',
    templateType: 'template1_guides',
    subCategory: 'Заработок денег',
    title: 'Гайд по фарму $5,000,000 в час в GTA Online (Соло Кайо Перико + Предприятия)',
    shortDesc: 'Самые быстрые и легальные способы стать миллионером в GTA Online без читов и бана',
    description: '💰 Забудьте о нехватке денег на суперкары и недвижимость!\n\nМануал раскрывает:\n- Ограбление Cayo Perico соло за 7 минут с элитным испытанием\n- Пассивный доход с ночного клуба и бункера\n- Ротация заданий в соло-сессиях без гриферов\n\n✅ 100% легально, никакого бана от Rockstar!',
    price: 59,
    content: 'Мануал по заработку в GTA Online: https://telegra.ph/GTA-Online-Money-Guide-Solo-2026',
    tags: ['gta', 'gta online', 'гта 5', 'кайо перико', 'деньги', 'фарм']
  },
  {
    id: 'lot_gta5_rp_starter',
    gameId: 'gta5',
    gameName: 'GTA 5 RP',
    templateType: 'template1_guides',
    subCategory: 'GTA 5 RP Гайды',
    title: 'Гайд по быстрому старту на серверах GTA 5 RP (Majestic, GTA5RP, Radmir)',
    shortDesc: 'Как быстро прокачать уровень, сдать на права, устроиться на топ работы и избежать банов',
    description: '🚗 Начните играть на RP-серверах как опытный игрок!\n\n- Лучшие начальные работы по соотношению время/деньги\n- Сдача экзаменов в автошколе и правила сервера\n- Как пройти собеседование в гос. структуры (LSPD, EMS, FIB) или криминал\n- Правила отыгровки /me /do /try',
    price: 49,
    content: 'Гайд новичка для Majestic и GTA5RP: https://telegra.ph/GTA5RP-Starter-Guide-2026',
    tags: ['gta rp', 'majestic', 'gta5rp', 'гта рп', 'маджестик', 'гайд']
  },

  // ==================== RUST ====================
  {
    id: 'lot_rust_wipe_guide',
    gameId: 'rust',
    gameName: 'Rust',
    templateType: 'template1_guides',
    subCategory: 'Гайды по выживанию',
    title: 'Гайд по идеальному старту в Rust после вайпа: Оружие за 20 минут + Защита базы',
    shortDesc: 'Пошаговый маршрут от пляжа до верстака Т2, переработка компонентов и анти-рейд бункер',
    description: '🏕️ Доминируйте на сервере с первых минут вайпа!\n\n- Оптимальный спавн и сбор ресурсов\n- Безопасный фарм дорог, подземки и заправок\n- Постройка стартового анти-рейд бункера 2х1 с пиксель-гэпом\n- Создание фермы для бесконечного скрапа',
    price: 69,
    content: 'Полный гайд по выживанию и старту вайпа Rust: https://telegra.ph/Rust-Wipe-Day-Starter-Guide-2026',
    tags: ['rust', 'раст', 'гайд', 'бункер', 'вайп', 'скрап']
  },

  // ==================== GENSHIN IMPACT ====================
  {
    id: 'lot_genshin_abyss_guide',
    gameId: 'genshin',
    gameName: 'Genshin Impact',
    templateType: 'template1_guides',
    subCategory: 'Прокачка и Бездна',
    title: 'Гайд по прохождению 12 этажа Витой Бездны на 36★ (F2P отряды, ротации, артефакты)',
    shortDesc: 'Сборки бюджетных персонажей (Сян Лин, Беннет, Син Цю), ротации ультов и позиционка',
    description: '⭐ Забирайте все 600 Камней Истока каждую ротацию Бездны!\n\n- Сборки F2P команд под текущих боссов\n- Правильный подбор оружия и статов артефактов\n- Тайминги элементальных реакций (Пар, Таяние, Дендро)',
    price: 59,
    content: 'Гайд по закрытию Бездны Genshin Impact на 36 звезд: https://telegra.ph/Genshin-Abyss-36-Stars-Guide-2026',
    tags: ['genshin', 'геншин', 'бездна', 'примогемы', 'артефакты', 'гайд']
  },

  // ==================== ESCAPE FROM TARKOV ====================
  {
    id: 'lot_tarkov_loot_maps',
    gameId: 'tarkov',
    gameName: 'Escape from Tarkov',
    templateType: 'template1_guides',
    subCategory: 'Карты и Лут',
    title: 'Карты лута и безопасных выходов Escape from Tarkov (Улицы Таркова, Таможня, Маяк)',
    shortDesc: 'Схемы расположения ценного лута, спавна биткоинов, ключей, тайников и выходов за Дикого',
    description: '🎒 Выносите по 1.5-2 миллиона рублей за один рейд!\n\n- Свежие интерактивные карты всех локаций\n- Самые прибыльные маршруты за Дикого без риска\n- Таблица эффективных патронов и бюджетных сборок оружия под вайп',
    price: 79,
    content: 'Интерактивные карты и лут-гайды Tarkov: https://telegra.ph/Tarkov-Loot-Routes-Maps-2026',
    tags: ['tarkov', 'тарков', 'лут', 'карты', 'таможня', 'дикий', 'eft']
  },

  // ==================== MINECRAFT ====================
  {
    id: 'lot_mc_auto_farms',
    gameId: 'minecraft',
    gameName: 'Minecraft',
    templateType: 'template1_guides',
    subCategory: 'Механизмы и Фермы',
    title: 'Сборник схем лучших автоматических ферм Minecraft (Железо, Золото, Опыт, Эндермены)',
    shortDesc: 'Пошаговые чертежи и схемы для выживания 1.20+ без редстоун-багов',
    description: '⛏️ Автоматизируйте все ресурсы в своем мире Minecraft!\n\n- Компактная ферма железа (500+ слитков/час)\n- Ферма золота и опыта в Аду (до 30 уровня за 40 секунд)\n- Ферма тростника, кактусов и пороха\n\n✅ Работает на Java и Bedrock версиях!',
    price: 49,
    content: 'Схемы и инструкции ферм Minecraft: https://telegra.ph/Minecraft-Auto-Farms-Guide-2026',
    tags: ['minecraft', 'майнкрафт', 'фермы', 'редстоун', 'железо', 'опыт']
  },

  // ==================== ROBLOX ====================
  {
    id: 'lot_roblox_trading',
    gameId: 'roblox',
    gameName: 'Roblox',
    templateType: 'template1_guides',
    subCategory: 'Трейдинг и Заработок',
    title: 'Гайд по Трейдингу и Заработку Робуксов в Roblox (Blox Fruits, Pet Sim 99, Murder Mystery 2)',
    shortDesc: 'Таблицы ценностей предметов (Value List), методы перепродажи и защита от скама',
    description: '💎 Умножьте свой инвентарь в Roblox за считанные дни!\n\n- Актуальные таблицы ценностей (Values) для популярных режимов\n- Секреты успешных обменов и поиска выгодных сделок\n- Как безопасно трейдить лимитки (Limiteds)',
    price: 59,
    content: 'Гайд по трейду в Roblox и актуальные таблицы ценностей: https://telegra.ph/Roblox-Trading-Value-Guide-2026',
    tags: ['roblox', 'роблокс', 'трейд', 'робуксы', 'blox fruits', 'pet simulator']
  },

  // ==================== STEAM / DIGITAL SERVICES ====================
  {
    id: 'lot_steam_region_guide',
    gameId: 'steam',
    gameName: 'Steam & Цифровые Сервисы',
    templateType: 'template3_free',
    subCategory: 'Смена региона и Аккаунты',
    title: 'Инструкция по безопасной смене региона Steam на Казахстан / Турцию / Украину 2026',
    shortDesc: 'Покупка недоступных игр, пополнение баланса без комиссий и предотвращение КТ',
    description: '🌐 Играйте во все новинки Steam без ограничений!\n\n- Пошаговая инструкция по переводу аккаунта без бана (КТ)\n- Способы выгодного пополнения кошелька\n- Сравнение цен в разных валютах',
    price: 69,
    productData: 'Пошаговая инструкция по смене региона Steam: https://telegra.ph/Steam-Region-Change-Safe-2026',
    tags: ['steam', 'стим', 'смена региона', 'турция', 'казахстан', 'игры']
  },
  {
    id: 'lot_tg_premium_guide',
    gameId: 'telegram',
    gameName: 'Telegram & Сервисы',
    templateType: 'template3_free',
    subCategory: 'Telegram Услуги',
    title: 'Гайд: Как выгодно подключить Telegram Premium и Звезды (Stars) с экономией до 50%',
    shortDesc: 'Официальные способы покупки через Fragment и региональные цены',
    description: '⭐ Получите все преимущества Telegram Premium вдвое дешевле!\n\n- Инструкция по оплате через TON / Fragment\n- Покупка Stars для ботов и подарков\n- Безопасно и официально для личного аккаунта',
    price: 49,
    productData: 'Мануал по экономии на Telegram Premium & Stars: https://telegra.ph/Telegram-Premium-Discount-Guide-2026',
    tags: ['telegram', 'телеграм', 'премиум', 'stars', 'fragment']
  }
];
