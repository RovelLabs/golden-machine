import { spawn } from 'child_process';
import open from 'open';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../../');
const PORT = process.env.PORT || 3000;
const URL = `http://localhost:${PORT}`;

console.clear();
console.log(`
\x1b[33m
  ██████╗  ██████╗ ██╗     ██████╗ ███████╗███╗   ██╗    ███╗   ███╗ █████╗  ██████╗██╗  ██╗██╗███╗   ██╗███████╗
 ██╔════╝ ██╔═══██╗██║     ██╔══██╗██╔════╝████╗  ██║    ████╗ ████║██╔══██╗██╔════╝██║  ██║██║████╗  ██║██╔════╝
 ██║  ███╗██║   ██║██║     ██║  ██║█████╗  ██╔██╗ ██║    ██╔████╔██║███████║██║     ███████║██║██╔██╗ ██║█████╗  
 ██║   ██║██║   ██║██║     ██║  ██║██╔══╝  ██║╚██╗██║    ██║╚██╔╝██║██╔══██║██║     ██╔══██║██║██║╚██╗██║██╔══╝  
 ╚██████╔╝╚██████╔╝███████╗██████╔╝███████╗██║ ╚████║    ██║ ╚═╝ ██║██║  ██║╚██████╗██║  ██║██║██║ ╚████║███████╗
  ╚═════╝  ╚═════╝ ╚══════╝╚═════╝ ╚══════╝╚═╝  ╚═══╝    ╚═╝     ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝╚══════╝
\x1b[0m
 \x1b[36m✨ Golden Machine FunPay Automation Suite MVP\x1b[0m
 \x1b[90m----------------------------------------------------------------------------------\x1b[0m
`);

// Check if server is already running
function checkServer(callback) {
  const req = http.get(URL, (res) => {
    callback(true);
  });
  req.on('error', () => {
    callback(false);
  });
  req.setTimeout(1000, () => {
    req.destroy();
    callback(false);
  });
}

function startServer() {
  console.log('\x1b[32m[+] Запуск локального сервера Golden Machine...\x1b[0m');
  const serverProcess = spawn('node', [path.join(ROOT_DIR, 'src/server.js')], {
    cwd: ROOT_DIR,
    stdio: 'inherit',
    shell: true
  });

  serverProcess.on('error', (err) => {
    console.error('\x1b[31m[-] Ошибка запуска сервера:\x1b[0m', err.message);
  });
}

console.log('\x1b[33m[*] Проверка локального хоста...\x1b[0m');
checkServer((isRunning) => {
  if (isRunning) {
    console.log(`\x1b[32m[+] Сервер уже активен на ${URL}\x1b[0m`);
    console.log(`\x1b[36m[+] Открытие панели управления в браузере...\x1b[0m`);
    open(URL);
  } else {
    startServer();
    setTimeout(() => {
      console.log(`\x1b[36m[+] Открытие панели управления в браузере: ${URL}...\x1b[0m`);
      open(URL);
    }, 1500);
  }
});
