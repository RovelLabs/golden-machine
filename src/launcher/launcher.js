import open from 'open';
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

console.log('\x1b[32m[+] Запуск локального сервера Golden Machine...\x1b[0m');

import('../server.js')
  .then(async (serverModule) => {
    const { port } = await serverModule.startServer(PORT);
    const activeUrl = `http://localhost:${port}`;
    console.log(`\x1b[36m[+] Открытие панели управления в браузере: ${activeUrl}...\x1b[0m`);
    setTimeout(() => {
      open(activeUrl).catch(() => {
        console.log(`\x1b[33m[*] Откройте в браузере вручную: ${activeUrl}\x1b[0m`);
      });
    }, 600);
  })
  .catch((err) => {
    console.error('\x1b[31m[-] Ошибка запуска сервера:\x1b[0m', err);
  });


