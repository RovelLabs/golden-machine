import open from 'open';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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

function checkAlreadyRunning(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}/api/status`, (res) => {
      resolve(true);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(800, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function launch() {
  const isRunning = await checkAlreadyRunning(PORT);
  if (isRunning) {
    console.log(`\x1b[32m[+] Сервер Golden Machine уже активен на порту ${PORT}!\x1b[0m`);
    console.log(`\x1b[36m[+] Открытие панели управления в браузере: ${URL}...\x1b[0m`);
    setTimeout(() => {
      open(URL).catch(() => {
        console.log(`\x1b[33m[*] Откройте в браузере вручную: ${URL}\x1b[0m`);
      });
    }, 400);
    return;
  }

  console.log('\x1b[32m[+] Запуск локального сервера Golden Machine...\x1b[0m');
  try {
    const serverModule = await import('../server.js');
    const { port } = await serverModule.startServer(PORT);
    const activeUrl = `http://localhost:${port}`;
    console.log(`\x1b[36m[+] Открытие панели управления в браузере: ${activeUrl}...\x1b[0m`);
    setTimeout(() => {
      open(activeUrl).catch(() => {
        console.log(`\x1b[33m[*] Откройте в браузере вручную: ${activeUrl}\x1b[0m`);
      });
    }, 600);
  } catch (err) {
    console.error('\x1b[31m[-] Ошибка запуска сервера:\x1b[0m', err);
  }
}

launch();
