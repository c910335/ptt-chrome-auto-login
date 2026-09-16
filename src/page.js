function getText() {
  let buf = window.app?.buf;
  if (!buf) return '';
  let lines = [];
  for (let r = 0; r < buf.rows; r++)
    lines.push(buf.getRowText(r, 0, buf.cols));
  return lines.join('\n');
}

function isLoginPage() {
  return getText().includes('請輸入代號');
}

function isDuplicate() {
  return getText().includes('您想刪除其他重複登入的連線嗎');
}

function isLogged() {
  let t = getText();
  return t.includes('請按任意鍵繼續') || t.includes('【主功能表】');
}

function send(str) {
  window.app?.pluginManager?.getPlugin('login_assist')?.hide();
  window.app?.send(str);
}

function login(id, password) {
  send(id + '\r');
  setTimeout(() => send(password + '\r'), 80);
}

function goFavorite() {
  send('ffff\r');
}

function handleDuplicate(remove) {
  if (!remove)
    send('n');
  send('\r');
}

function waitFor(condition, timeout, callback) {
  let interval = setInterval(() => {
    if (condition()) {
      clearInterval(interval);
      callback();
    }
  }, 50);

  setTimeout(() => clearInterval(interval), timeout);
}

let hooked = false;
function hookReconnect() {
  if (hooked || !window.app) return;
  hooked = true;
  window.app.on('term:connect', start);
}

function start() {
  waitFor(isLoginPage, 5000, () => {
    hookReconnect();

    navigator.credentials.get({password: true}).then(cred => {
      if (cred && cred.id && cred.password) {
        login(cred.id, cred.password);
        waitFor(isDuplicate, 5000, () => {
          let remove = document.documentElement.dataset.duplicate !== 'false';
          handleDuplicate(remove);
        });
        waitFor(isLogged, 10000, () => {
          if (document.documentElement.dataset.favorite === 'true')
            goFavorite();
        });
      }
    }).catch(console.error);
  });
}

document.addEventListener('login', () => {
  if (isLoginPage())
    start();
});

start();
