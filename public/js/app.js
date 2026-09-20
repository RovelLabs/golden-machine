// Golden Machine Frontend Application Logic
let state = {
  status: { isRunning: false, currentIndex: 0 },
  settings: {},
  stats: {},
  templates: {},
  lots: [],
  listedLots: [],
  user: null,
  ws: null,
  activeTab: 'overview'
};

// DOM Elements cache
const elements = {
  // Navigation
  navItems: document.querySelectorAll('.nav-item'),
  tabPanes: document.querySelectorAll('.tab-pane'),
  navLotsCount: document.getElementById('navLotsCount'),
  accountStatusDot: document.getElementById('accountStatusDot'),
  wsStatusText: document.getElementById('wsStatusText'),
  
  // Header
  botStatusBadge: document.getElementById('botStatusBadge'),
  botStatusText: document.getElementById('botStatusText'),
  btnToggleBot: document.getElementById('btnToggleBot'),
  btnToggleBotText: document.getElementById('btnToggleBotText'),
  nextActionTimer: document.getElementById('nextActionTimer'),
  timerText: document.getElementById('timerText'),
  userAvatar: document.getElementById('userAvatar'),
  userName: document.getElementById('userName'),
  userBalance: document.getElementById('userBalance'),
  btnRefreshAuth: document.getElementById('btnRefreshAuth'),

  // Overview Tab
  statTotalDbLots: document.getElementById('statTotalDbLots'),
  statTotalListed: document.getElementById('statTotalListed'),
  statLastListed: document.getElementById('statLastListed'),
  statTotalBumps: document.getElementById('statTotalBumps'),
  statLastBump: document.getElementById('statLastBump'),
  statTotalMessages: document.getElementById('statTotalMessages'),
  btnQuickBump: document.getElementById('btnQuickBump'),
  btnTestOrder: document.getElementById('btnTestOrder'),
  checkOverviewTpl1: document.getElementById('checkOverviewTpl1'),
  checkOverviewTpl2: document.getElementById('checkOverviewTpl2'),
  checkOverviewTpl3: document.getElementById('checkOverviewTpl3'),
  listedLotsBody: document.getElementById('listedLotsBody'),
  btnRefreshListedLots: document.getElementById('btnRefreshListedLots'),

  // Account Tab
  formFunPayAuth: document.getElementById('formFunPayAuth'),
  inputGoldenKey: document.getElementById('inputGoldenKey'),
  btnToggleKeyVisibility: document.getElementById('btnToggleKeyVisibility'),
  btnTestMock: document.getElementById('btnTestMock'),
  authResultBox: document.getElementById('authResultBox'),
  authResultMessage: document.getElementById('authResultMessage'),

  // Database Tab
  dbSearchInput: document.getElementById('dbSearchInput'),
  dbTemplateFilter: document.getElementById('dbTemplateFilter'),
  dbGameFilter: document.getElementById('dbGameFilter'),
  databaseLotsGrid: document.getElementById('databaseLotsGrid'),
  btnOpenAddLotModal: document.getElementById('btnOpenAddLotModal'),

  // Templates Tab
  tplEnabled1: document.getElementById('tplEnabled1'),
  tplPrefixes1: document.getElementById('tplPrefixes1'),
  tplPriceMul1: document.getElementById('tplPriceMul1'),
  tplMessage1: document.getElementById('tplMessage1'),

  tplEnabled2: document.getElementById('tplEnabled2'),
  tplPrefixes2: document.getElementById('tplPrefixes2'),
  tplPriceMul2: document.getElementById('tplPriceMul2'),
  tplMessage2: document.getElementById('tplMessage2'),

  tplEnabled3: document.getElementById('tplEnabled3'),
  tplPrefixes3: document.getElementById('tplPrefixes3'),
  tplPriceMul3: document.getElementById('tplPriceMul3'),
  tplMessage3: document.getElementById('tplMessage3'),
  btnSaveTemplates: document.getElementById('btnSaveTemplates'),

  // Generator Tab
  genLotSelect: document.getElementById('genLotSelect'),
  genTranslateEn: document.getElementById('genTranslateEn'),
  genIncludeBoth: document.getElementById('genIncludeBoth'),
  btnTestGenerate: document.getElementById('btnTestGenerate'),
  genTitlesList: document.getElementById('genTitlesList'),
  genDescPreview: document.getElementById('genDescPreview'),
  genCombCount: document.getElementById('genCombCount'),

  // Messages Tab
  msgLotSelect: document.getElementById('msgLotSelect'),
  msgBuyerName: document.getElementById('msgBuyerName'),
  btnPreviewMessage: document.getElementById('btnPreviewMessage'),
  btnSimulateOrderSend: document.getElementById('btnSimulateOrderSend'),
  chatMessageText: document.getElementById('chatMessageText'),

  // Settings Tab
  setDelayMin: document.getElementById('setDelayMin'),
  setDelayMax: document.getElementById('setDelayMax'),
  setAntiBanMode: document.getElementById('setAntiBanMode'),
  setBumpInterval: document.getElementById('setBumpInterval'),
  setAutoBumpActive: document.getElementById('setAutoBumpActive'),
  btnSaveAllSettings: document.getElementById('btnSaveAllSettings'),

  // Terminal Tab
  terminalLogsContainer: document.getElementById('terminalLogsContainer'),
  btnClearLogs: document.getElementById('btnClearLogs'),
  logCountBadge: document.getElementById('logCountBadge'),

  // Modal Lot
  modalLot: document.getElementById('modalLot'),
  btnCloseLotModal: document.getElementById('btnCloseLotModal'),
  btnCancelLotModal: document.getElementById('btnCancelLotModal'),
  formCustomLot: document.getElementById('formCustomLot'),
  toastContainer: document.getElementById('toastContainer'),

  // Modal Goods
  modalGoods: document.getElementById('modalGoods'),
  modalGoodsTitle: document.getElementById('modalGoodsTitle'),
  modalGoodsContent: document.getElementById('modalGoodsContent'),
  btnCloseGoodsModal: document.getElementById('btnCloseGoodsModal'),
  btnCloseGoodsModalBtn: document.getElementById('btnCloseGoodsModalBtn'),
  btnCopyGoodsContent: document.getElementById('btnCopyGoodsContent')
};

// Toast notification helper
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icon = type === 'success' ? 'fa-circle-check text-success' : (type === 'error' ? 'fa-triangle-exclamation text-danger' : 'fa-circle-info blue-text');
  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
  elements.toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// WebSocket Setup
function initWebSocket() {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsUrl = `${protocol}//${window.location.host}`;
  state.ws = new WebSocket(wsUrl);

  state.ws.onopen = () => {
    elements.wsStatusText.textContent = 'Сервер подключен';
  };

  state.ws.onmessage = (event) => {
    try {
      const { type, payload } = JSON.parse(event.data);
      handleWsMessage(type, payload);
    } catch (e) {
      console.error('WS Parse Error:', e);
    }
  };

  state.ws.onclose = () => {
    elements.wsStatusText.textContent = 'Сервер отключен (реконнект...)';
    setTimeout(initWebSocket, 3000);
  };
}

function handleWsMessage(type, payload) {
  switch (type) {
    case 'init':
      state.status = payload.status;
      state.settings = payload.settings;
      state.stats = payload.stats;
      state.user = payload.user;
      renderAll();
      break;
    case 'status_change':
      state.status = payload;
      updateBotStatusUI();
      break;
    case 'log':
      appendLogLine(payload);
      break;
    case 'lot_listed':
      state.listedLots.unshift(payload);
      renderListedLotsTable();
      fetchStatus();
      break;
    case 'stats_updated':
      state.stats = payload;
      updateStatsUI();
      break;
    case 'auth_status':
      if (payload.valid) {
        state.user = payload.user;
        updateUserUI();
      }
      break;
  }
}

// API Helpers
async function apiGet(endpoint) {
  const res = await fetch(endpoint);
  return await res.json();
}

async function apiPost(endpoint, body = {}) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return await res.json();
}

// Data Fetching
async function fetchStatus() {
  const data = await apiGet('/api/status');
  if (data.success) {
    state.status = data.botStatus;
    state.stats = data.stats;
    state.settings = data.settings;
    state.user = data.user;
    updateStatsUI();
    updateUserUI();
    updateBotStatusUI();
  }
}

async function fetchLots() {
  const params = new URLSearchParams();
  if (elements.dbSearchInput.value) params.append('search', elements.dbSearchInput.value);
  if (elements.dbTemplateFilter.value) params.append('category', elements.dbTemplateFilter.value);
  if (elements.dbGameFilter.value) params.append('game', elements.dbGameFilter.value);

  const data = await apiGet(`/api/database/lots?${params.toString()}`);
  if (data.success) {
    state.lots = data.lots;
    elements.navLotsCount.textContent = state.lots.length;
    renderLotsGrid();
    populateSelectOptions();
  }
}

async function fetchTemplates() {
  const data = await apiGet('/api/templates');
  if (data.success) {
    state.templates = data.templates;
    populateTemplateForms();
  }
}

async function fetchListedLots() {
  const data = await apiGet('/api/listed-lots');
  if (data.success) {
    state.listedLots = data.listedLots;
    renderListedLotsTable();
  }
}

async function fetchLogs() {
  const data = await apiGet('/api/logs?limit=100');
  if (data.success && data.logs) {
    elements.terminalLogsContainer.innerHTML = '';
    data.logs.reverse().forEach(log => appendLogLine(log));
  }
}

// Rendering Functions
function renderAll() {
  updateUserUI();
  updateStatsUI();
  updateBotStatusUI();
  populateSettingsForm();
  fetchLots();
  fetchTemplates();
  fetchListedLots();
  fetchLogs();
}

function updateUserUI() {
  const profileBtn = document.getElementById('btnOpenFunPayProfile');
  if (state.user && state.user.username) {
    elements.userName.textContent = state.user.username;
    elements.userBalance.textContent = state.user.balance || '0 ₽';
    elements.userAvatar.src = state.user.avatar || 'https://funpay.com/img/layout/avatar.png';
    elements.accountStatusDot.classList.add('connected');
    if (profileBtn && state.user.profileUrl) {
      profileBtn.href = state.user.profileUrl;
    }
  } else {
    elements.userName.textContent = 'Не подключен';
    elements.userBalance.textContent = '0.00 ₽';
    elements.userAvatar.src = 'https://funpay.com/img/layout/avatar.png';
    elements.accountStatusDot.classList.remove('connected');
    if (profileBtn) {
      profileBtn.href = 'https://funpay.com';
    }
  }
}

function updateStatsUI() {
  if (!state.stats) return;
  elements.statTotalDbLots.textContent = state.stats.totalDatabaseLots || state.lots.length || 0;
  elements.statTotalListed.textContent = state.stats.totalListed || 0;
  elements.statTotalBumps.textContent = state.stats.totalBumps || 0;
  elements.statTotalMessages.textContent = state.stats.totalMessagesSent || 0;

  if (state.stats.lastListedTime) {
    const d = new Date(state.stats.lastListedTime);
    elements.statLastListed.textContent = `Посл: ${d.toLocaleTimeString()}`;
  }
  if (state.stats.lastBumpTime) {
    const d = new Date(state.stats.lastBumpTime);
    elements.statLastBump.textContent = `Посл: ${d.toLocaleTimeString()}`;
  }
}

function updateBotStatusUI() {
  if (state.status.isRunning) {
    elements.botStatusBadge.className = 'status-badge active';
    elements.botStatusBadge.innerHTML = '<i class="fa-solid fa-circle-play text-success"></i> <span>Авто-выставление активно</span>';
    elements.btnToggleBot.className = 'btn-master-action btn-danger';
    elements.btnToggleBot.innerHTML = '<i class="fa-solid fa-stop"></i> <span>ОСТАНОВИТЬ</span>';
  } else {
    elements.botStatusBadge.className = 'status-badge';
    elements.botStatusBadge.innerHTML = '<i class="fa-solid fa-circle-pause"></i> <span>Авто-выставление неактивно</span>';
    elements.btnToggleBot.className = 'btn-master-action btn-gold glow-effect';
    elements.btnToggleBot.innerHTML = '<i class="fa-solid fa-play"></i> <span>ЗАПУСТИТЬ БОТА</span>';
  }
}

function renderLotsGrid() {
  const container = elements.databaseLotsGrid;
  container.innerHTML = '';

  if (state.lots.length === 0) {
    container.innerHTML = '<div class="text-center text-muted py-4 w-100">Лотов не найдено по заданным фильтрам.</div>';
    return;
  }

  state.lots.forEach(lot => {
    const card = document.createElement('div');
    card.className = 'lot-card';
    const templateLabel = lot.templateType === 'template1_guides' ? 'Шаблон 1 (Гайд)' : (lot.templateType === 'template2_boost' ? 'Шаблон 2 (Буст)' : 'Шаблон 3 (Свободный)');
    
    card.innerHTML = `
      <div class="lot-header">
        <span class="lot-game-tag">${lot.gameName || 'Игра'} • ${templateLabel}</span>
        <span class="lot-price-tag">${lot.price} ₽</span>
      </div>
      <h4 class="lot-title">${lot.title}</h4>
      <p class="lot-desc">${lot.shortDesc || lot.description.substring(0, 100) + '...'}</p>
      <div class="lot-goods-box" style="margin-top:10px; margin-bottom:12px; padding:8px 10px; background:rgba(255,255,255,0.03); border:1px solid rgba(251,191,36,0.18); border-radius:8px; font-size:11px;">
        <span style="color:#fbbf24; font-weight:600;"><i class="fa-solid fa-box-open"></i> Товар для покупателя:</span>
        <div style="color:#9ca3af; margin-top:4px; max-height:42px; overflow:hidden; text-overflow:ellipsis; white-space:pre-line;">${(lot.content || '').substring(0, 110)}...</div>
      </div>
      <div class="lot-footer">
        <button class="btn btn-sm btn-outline btn-view-goods" data-id="${lot.id}" title="Посмотреть и скопировать для отправки покупателю">
          <i class="fa-solid fa-clipboard-list"></i> Товар
        </button>
        <button class="btn btn-sm btn-outline btn-test-var" data-id="${lot.id}" title="Вариации">
          <i class="fa-solid fa-dice"></i> Вариации
        </button>
        <button class="btn btn-sm btn-gold btn-publish-one" data-id="${lot.id}">
          <i class="fa-solid fa-bolt"></i> Выставить
        </button>
      </div>
    `;
    container.appendChild(card);
  });

  // Attach buttons
  document.querySelectorAll('.btn-view-goods').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const lotId = e.currentTarget.getAttribute('data-id');
      const lot = state.lots.find(l => l.id === lotId);
      if (lot) {
        if (elements.modalGoodsTitle) elements.modalGoodsTitle.innerHTML = `<i class="fa-solid fa-gift text-gold"></i> [${lot.gameName}] ${lot.title}`;
        if (elements.modalGoodsContent) elements.modalGoodsContent.textContent = lot.content || 'Содержимое еще не заполнено.';
        if (elements.modalGoods) elements.modalGoods.style.display = 'flex';
      }
    });
  });

  document.querySelectorAll('.btn-publish-one').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const lotId = e.currentTarget.getAttribute('data-id');
      showToast('Отправка лота на FunPay...', 'info');
      const res = await apiPost('/api/autolister/publish-single', { lotId });
      if (res.success) {
        const link = res.listed.lotUrl || (state.user ? state.user.profileUrl : 'https://funpay.com');
        showToast(`✅ Лот выставлен! <a href="${link}" target="_blank" style="color:#fbbf24; text-decoration:underline; font-weight:bold; margin-left:6px;">[🔗 Открыть на FunPay]</a>`, 'success');
        fetchListedLots();
      } else {
        showToast(`Ошибка: ${res.error}`, 'error');
      }
    });
  });

  document.querySelectorAll('.btn-test-var').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const lotId = e.currentTarget.getAttribute('data-id');
      elements.genLotSelect.value = lotId;
      switchTab('generator');
      elements.btnTestGenerate.click();
    });
  });
}

function renderListedLotsTable() {
  const tbody = elements.listedLotsBody;
  tbody.innerHTML = '';

  if (state.listedLots.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-4">Лоты еще не выставлялись. Нажмите «Запустить бота» или выставите одиночный лот из базы.</td></tr>';
    return;
  }

  state.listedLots.slice(0, 15).forEach(item => {
    const tr = document.createElement('tr');
    const time = new Date(item.listedAt).toLocaleTimeString();
    const lotLink = item.lotUrl || item.categoryUrl || 'https://funpay.com';
    const profileLink = item.profileUrl || (state.user ? state.user.profileUrl : 'https://funpay.com');

    tr.innerHTML = `
      <td><span class="text-dim">${time}</span></td>
      <td><strong>${item.gameName}</strong></td>
      <td>${item.title}</td>
      <td><span class="gold-text font-weight-bold">${item.price} ₽</span></td>
      <td><span class="badge-version text-success">Активен</span></td>
      <td>
        <div class="d-flex gap-2">
          <a href="${lotLink}" target="_blank" class="btn btn-sm btn-gold" title="Открыть лот или категорию на FunPay">
            <i class="fa-solid fa-arrow-up-right-from-square"></i> Открыть
          </a>
          <a href="${profileLink}" target="_blank" class="btn btn-sm btn-outline" title="Проверить в моем профиле FunPay">
            <i class="fa-solid fa-user"></i> Профиль
          </a>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function populateSelectOptions() {
  const selects = [elements.genLotSelect, elements.msgLotSelect];
  selects.forEach(select => {
    select.innerHTML = '';
    state.lots.forEach(lot => {
      const opt = document.createElement('option');
      opt.value = lot.id;
      opt.textContent = `[${lot.gameName}] ${lot.title}`;
      select.appendChild(opt);
    });
  });
}

function populateTemplateForms() {
  if (!state.templates) return;
  const t1 = state.templates.template1_guides;
  if (t1) {
    elements.tplEnabled1.checked = t1.enabled;
    elements.checkOverviewTpl1.checked = t1.enabled;
    elements.tplPrefixes1.value = t1.prefixList?.join(', ') || '';
    elements.tplPriceMul1.value = t1.priceMultiplier || 1.0;
    elements.tplMessage1.value = t1.buyerMessageTemplate || '';
  }

  const t2 = state.templates.template2_boost;
  if (t2) {
    elements.tplEnabled2.checked = t2.enabled;
    elements.checkOverviewTpl2.checked = t2.enabled;
    elements.tplPrefixes2.value = t2.prefixList?.join(', ') || '';
    elements.tplPriceMul2.value = t2.priceMultiplier || 1.0;
    elements.tplMessage2.value = t2.buyerMessageTemplate || '';
  }

  const t3 = state.templates.template3_free;
  if (t3) {
    elements.tplEnabled3.checked = t3.enabled;
    elements.checkOverviewTpl3.checked = t3.enabled;
    elements.tplPrefixes3.value = t3.prefixList?.join(', ') || '';
    elements.tplPriceMul3.value = t3.priceMultiplier || 1.0;
    elements.tplMessage3.value = t3.buyerMessageTemplate || '';
  }
}

function populateSettingsForm() {
  if (!state.settings) return;
  if (state.settings.goldenKey) elements.inputGoldenKey.value = state.settings.goldenKey;
  elements.setDelayMin.value = state.settings.listingDelayMinSeconds || 15;
  elements.setDelayMax.value = state.settings.listingDelayMaxSeconds || 45;
  elements.setAntiBanMode.checked = state.settings.antiBanSafeMode !== false;
  elements.setBumpInterval.value = state.settings.autoBumpIntervalMinutes || 120;
  elements.setAutoBumpActive.checked = state.settings.autoBumpEnabled !== false;
  elements.genTranslateEn.checked = state.settings.translateToEnglish !== false;
  elements.genIncludeBoth.checked = state.settings.includeBothLanguages !== false;
}

function appendLogLine(log) {
  const container = elements.terminalLogsContainer;
  const line = document.createElement('div');
  line.className = `log-line ${log.level || 'info'}`;
  const time = log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : new Date().toLocaleTimeString();
  line.innerHTML = `<span class="log-time">[${time}]</span> <span class="log-msg">${log.message}</span>`;
  container.appendChild(line);
  container.scrollTop = container.scrollHeight;

  const currentCount = parseInt(elements.logCountBadge.textContent) || 0;
  elements.logCountBadge.textContent = `${currentCount + 1} записей`;
}

// Tab Switching
function switchTab(tabId) {
  state.activeTab = tabId;
  elements.navItems.forEach(item => {
    item.classList.toggle('active', item.getAttribute('data-tab') === tabId);
  });
  elements.tabPanes.forEach(pane => {
    pane.classList.toggle('active', pane.id === `tab-${tabId}`);
  });
}

// Event Listeners
elements.navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const tab = item.getAttribute('data-tab');
    switchTab(tab);
  });
});

// Master Bot Toggle Button
elements.btnToggleBot.addEventListener('click', async () => {
  if (state.status.isRunning) {
    const res = await apiPost('/api/autolister/stop');
    if (res.success) {
      showToast('Авто-выставление остановлено', 'info');
      state.status.isRunning = false;
      updateBotStatusUI();
    }
  } else {
    if (!state.settings.goldenKey) {
      showToast('Пожалуйста, введите golden_key во вкладке FunPay Аккаунт!', 'error');
      switchTab('account');
      return;
    }
    const res = await apiPost('/api/autolister/start');
    if (res.success) {
      showToast('Бот запущен! Лоты выставляются автоматически.', 'success');
      state.status.isRunning = true;
      updateBotStatusUI();
    } else {
      showToast(res.error || 'Ошибка запуска бота', 'error');
    }
  }
});

// Refresh Auth & Balance
elements.btnRefreshAuth.addEventListener('click', async () => {
  showToast('Проверка статуса FunPay...', 'info');
  const res = await apiPost('/api/funpay/auth', { goldenKey: elements.inputGoldenKey.value });
  if (res.valid) {
    state.user = res.user;
    updateUserUI();
    showToast(`Подключено: ${res.user.username} | Баланс: ${res.user.balance}`, 'success');
  } else {
    showToast(res.message || 'Ошибка авторизации FunPay', 'error');
  }
});

// Save Golden Key Form
elements.formFunPayAuth.addEventListener('submit', async (e) => {
  e.preventDefault();
  const key = elements.inputGoldenKey.value.trim();
  showToast('Сохранение токена и проверка...', 'info');
  
  await apiPost('/api/settings', { goldenKey: key });
  const authRes = await apiPost('/api/funpay/auth', { goldenKey: key });

  elements.authResultBox.style.display = 'block';
  if (authRes.valid) {
    elements.authResultMessage.innerHTML = `<strong>Авторизация успешна!</strong><br>Пользователь: <b>${authRes.user.username}</b> (Баланс: ${authRes.user.balance})`;
    showToast('Аккаунт FunPay успешно подключен!', 'success');
  } else {
    elements.authResultMessage.innerHTML = `<strong>Ошибка подключения:</strong> ${authRes.message}`;
    showToast('Не удалось подключиться к FunPay', 'error');
  }
});

elements.btnToggleKeyVisibility.addEventListener('click', () => {
  const type = elements.inputGoldenKey.type === 'password' ? 'text' : 'password';
  elements.inputGoldenKey.type = type;
  elements.btnToggleKeyVisibility.innerHTML = type === 'password' ? '<i class="fa-solid fa-eye"></i>' : '<i class="fa-solid fa-eye-slash"></i>';
});

// Demo mock mode
elements.btnTestMock.addEventListener('click', async () => {
  state.user = {
    id: '1234567',
    username: 'Demo_Seller_2026',
    balance: '14,250.00 ₽',
    avatar: 'https://funpay.com/img/layout/avatar.png'
  };
  state.settings.goldenKey = 'demo_golden_key_active_token_2026';
  elements.inputGoldenKey.value = state.settings.goldenKey;
  updateUserUI();
  showToast('Демо-режим активирован! Можно тестировать выставление и генератор.', 'success');
});

// Filter Handlers
elements.dbSearchInput.addEventListener('input', fetchLots);
elements.dbTemplateFilter.addEventListener('change', fetchLots);
elements.dbGameFilter.addEventListener('change', fetchLots);

// Quick Bump Button
elements.btnQuickBump.addEventListener('click', async () => {
  showToast('Запрос на поднятие всех лотов на FunPay...', 'info');
  const res = await apiPost('/api/funpay/bump', {});
  if (res.success) {
    showToast('Запрос на поднятие выполнен!', 'success');
  } else {
    showToast(res.error || 'Ошибка при поднятии', 'error');
  }
});

// Test Order Button
elements.btnTestOrder.addEventListener('click', async () => {
  showToast('Симуляция нового оплаченного заказа...', 'info');
  const res = await apiPost('/api/test-order', {});
  if (res.success) {
    showToast(`Заказ обработан! Авто-сообщение выдано: #${res.order.orderId}`, 'success');
  }
});

// Generator Sandbox Testing
elements.btnTestGenerate.addEventListener('click', async () => {
  const lotId = elements.genLotSelect.value;
  const options = {
    language: elements.genTranslateEn.checked ? (elements.genIncludeBoth.checked ? 'both' : 'en') : 'ru',
    includeBothLanguages: elements.genIncludeBoth.checked
  };

  showToast('Генерация вариаций и автоперевод...', 'info');
  const res = await apiPost('/api/generator/preview', { lotId, options });

  if (res.success) {
    elements.genTitlesList.innerHTML = '';
    res.titles.forEach(title => {
      const item = document.createElement('div');
      item.className = 'title-pill';
      item.innerHTML = `<i class="fa-solid fa-sparkles gold-text"></i> ${title}`;
      elements.genTitlesList.appendChild(item);
    });

    elements.genDescPreview.value = res.description;
    elements.genCombCount.textContent = res.combinationsCount.toLocaleString();
    showToast('Сгенерировано 5 вариаций названия и описание!', 'success');
  }
});

// Post-Purchase Message Preview
elements.btnPreviewMessage.addEventListener('click', async () => {
  const lotId = elements.msgLotSelect.value;
  const buyerName = elements.msgBuyerName.value;
  const options = {
    language: elements.genTranslateEn.checked ? (elements.genIncludeBoth.checked ? 'both' : 'en') : 'ru'
  };

  const res = await apiPost('/api/generator/preview', { lotId, options });
  if (res.success) {
    elements.chatMessageText.textContent = res.buyerMessage;
    showToast('Предпросмотр сообщения обновлен', 'info');
  }
});

elements.btnSimulateOrderSend.addEventListener('click', async () => {
  const lotId = elements.msgLotSelect.value;
  const res = await apiPost('/api/test-order', { lotId });
  if (res.success) {
    elements.chatMessageText.textContent = res.order.message;
    showToast('Тестовый заказ успешно симулирован!', 'success');
  }
});

// Save Templates
elements.btnSaveTemplates.addEventListener('click', async () => {
  const newTemplates = {
    template1_guides: {
      ...state.templates.template1_guides,
      enabled: elements.tplEnabled1.checked,
      prefixList: elements.tplPrefixes1.value.split(',').map(s => s.trim()),
      priceMultiplier: parseFloat(elements.tplPriceMul1.value) || 1.0,
      buyerMessageTemplate: elements.tplMessage1.value
    },
    template2_boost: {
      ...state.templates.template2_boost,
      enabled: elements.tplEnabled2.checked,
      prefixList: elements.tplPrefixes2.value.split(',').map(s => s.trim()),
      priceMultiplier: parseFloat(elements.tplPriceMul2.value) || 1.0,
      buyerMessageTemplate: elements.tplMessage2.value
    },
    template3_free: {
      ...state.templates.template3_free,
      enabled: elements.tplEnabled3.checked,
      prefixList: elements.tplPrefixes3.value.split(',').map(s => s.trim()),
      priceMultiplier: parseFloat(elements.tplPriceMul3.value) || 1.0,
      buyerMessageTemplate: elements.tplMessage3.value
    }
  };

  const res = await apiPost('/api/templates', newTemplates);
  if (res.success) {
    state.templates = res.templates;
    showToast('Настройки 3 шаблонов успешно сохранены!', 'success');
  }
});

// Overview template checkboxes sync
elements.checkOverviewTpl1.addEventListener('change', (e) => {
  elements.tplEnabled1.checked = e.target.checked;
  elements.btnSaveTemplates.click();
});
elements.checkOverviewTpl2.addEventListener('change', (e) => {
  elements.tplEnabled2.checked = e.target.checked;
  elements.btnSaveTemplates.click();
});
elements.checkOverviewTpl3.addEventListener('change', (e) => {
  elements.tplEnabled3.checked = e.target.checked;
  elements.btnSaveTemplates.click();
});

// Save All Bot Settings
elements.btnSaveAllSettings.addEventListener('click', async () => {
  const payload = {
    listingDelayMinSeconds: parseInt(elements.setDelayMin.value) || 15,
    listingDelayMaxSeconds: parseInt(elements.setDelayMax.value) || 45,
    antiBanSafeMode: elements.setAntiBanMode.checked,
    autoBumpIntervalMinutes: parseInt(elements.setBumpInterval.value) || 120,
    autoBumpEnabled: elements.setAutoBumpActive.checked
  };

  const res = await apiPost('/api/settings', payload);
  if (res.success) {
    state.settings = res.settings;
    showToast('Настройки бота успешно сохранены!', 'success');
  }
});

// Modal Lot Add
elements.btnOpenAddLotModal.addEventListener('click', () => {
  elements.modalLot.style.display = 'flex';
});
elements.btnCloseLotModal.addEventListener('click', () => elements.modalLot.style.display = 'none');
elements.btnCancelLotModal.addEventListener('click', () => elements.modalLot.style.display = 'none');

elements.formCustomLot.addEventListener('submit', async (e) => {
  e.preventDefault();
  const newLot = {
    gameName: document.getElementById('lotInputGame').value,
    templateType: document.getElementById('lotInputTemplate').value,
    title: document.getElementById('lotInputTitle').value,
    price: parseInt(document.getElementById('lotInputPrice').value) || 99,
    subCategory: document.getElementById('lotInputSubCategory').value || 'Товары',
    description: document.getElementById('lotInputDesc').value,
    content: document.getElementById('lotInputContent').value
  };

  const res = await apiPost('/api/database/lots', newLot);
  if (res.success) {
    elements.modalLot.style.display = 'none';
    elements.formCustomLot.reset();
    showToast(`Лот "${newLot.title}" добавлен в базу!`, 'success');
    fetchLots();
  }
});

// Modal Goods Events
if (elements.btnCloseGoodsModal) elements.btnCloseGoodsModal.addEventListener('click', () => elements.modalGoods.style.display = 'none');
if (elements.btnCloseGoodsModalBtn) elements.btnCloseGoodsModalBtn.addEventListener('click', () => elements.modalGoods.style.display = 'none');
if (elements.btnCopyGoodsContent) {
  elements.btnCopyGoodsContent.addEventListener('click', () => {
    const text = elements.modalGoodsContent.textContent;
    navigator.clipboard.writeText(text).then(() => {
      showToast('Текст товара скопирован в буфер обмена!', 'success');
    }).catch(() => {
      showToast('Не удалось скопировать', 'error');
    });
  });
}

// Clear Logs
elements.btnClearLogs.addEventListener('click', () => {
  elements.terminalLogsContainer.innerHTML = '';
  elements.logCountBadge.textContent = '0 записей';
  showToast('Логи консоли очищены', 'info');
});

// Refresh Listed Lots
elements.btnRefreshListedLots.addEventListener('click', fetchListedLots);

// Initial start
initWebSocket();
fetchStatus();
fetchLots();
fetchTemplates();
fetchListedLots();
fetchLogs();
