function isShow(selector, content) {
  let t = document.querySelector(selector);
  return t && t.textContent.includes(content);
}

function isLoginPage() {
  return isShow('[data-row="20"] .q7.b0', '請輸入代號，或以 guest 參觀，或以 new 註冊:');
}

function isLogged() {
  return isShow('[data-row="23"] .q15.b4', '請按任意鍵繼續');
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
        chrome.storage.local.get({favorite: true}, res => {
          if (res.favorite)
            waitFor(isLogged, 3000, () => {
              goFavorite();
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
