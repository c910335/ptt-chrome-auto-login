function isShow(selector, content) {
  let elements = Array.from(document.querySelectorAll(selector));
  return elements && elements.some(e => e.textContent.includes(content));
}

function isLoginPage() {
  return isShow('.q7.b0', '請輸入代號，或以 guest 參觀，或以 new 註冊:');
}

function isDuplicate() {
  return isShow('.q7.b0', '您想刪除其他重複登入的連線嗎？[Y/n]');
}

function isLogged() {
  return isShow('.q15.b4', '請按任意鍵繼續');
}

function input(content) {
  let t = document.getElementById('t');
  t.value = content;
  t.dispatchEvent(new Event('input'));
}

function enter() {
  let t = document.getElementById('t');
  t.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter', keyCode: 13, which: 13, bubbles: true}));
}

function login(id, password) {
  input(id);
  enter();
  input(password);
  enter();
}

function goFavorite() {
  input('ff');
  enter();
}

function handleDuplicate(remove) {
  if (!remove)
    input('n');
  enter();
}

function waitFor(condition, timeout, callback) {
  let interval = setInterval(() => {
    if (condition()) {
      clearInterval(interval);
      callback();
    }
  });

  setTimeout(() => {
    clearInterval(interval);
  }, timeout);
}

function start() {
  waitFor(isLoginPage, 5000, () => {
    navigator.credentials.get({password: true}).then(cred => {
      if (cred && cred.id && cred.password) {
        login(cred.id, cred.password);
        chrome.storage.local.get({duplicate: true}, res => {
          waitFor(isDuplicate, 5000, () => {
            handleDuplicate(res.duplicate);
          });
          chrome.storage.local.get({favorite: true}, res => {
            if (res.favorite)
              waitFor(isLogged, 10000, () => {
                goFavorite();
              });
          });
        });
      }
    })
  });
}

chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
  if (msg) {
    if (msg.id && msg.password) {
      navigator.credentials.store(new PasswordCredential(msg));
      sendResponse('已更新');
      if (isLoginPage())
        login(msg.id, msg.password);
    } else if (msg == 'ping')
      sendResponse('pong');
  }
});

start();
