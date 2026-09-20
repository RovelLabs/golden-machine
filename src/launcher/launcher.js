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

// Directly import server module to ensure single-process stability and zero path escape issues
import('../server.js')
  .then(() => {
    console.log(`\x1b[36m[+] Открытие панели управления в браузере: ${URL}...\x1b[0m`);
    setTimeout(() => {
      open(URL).catch((err) => {
        console.log(`\x1b[33m[*] Откройте в браузере вручную: ${URL}\x1b[0m`);
      });
    }, 800);
  })
  .catch((err) => {
    console.error('\x1b[31m[-] Ошибка запуска сервера:\x1b[0m', err);
  });

