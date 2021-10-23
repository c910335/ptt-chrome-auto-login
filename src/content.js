function isLoginPage() {
  let t = document.querySelector('[data-row="20"] .q7.b0');
  return t && t.textContent == '請輸入代號，或以 guest 參觀，或以 new 註冊: ';
}

function login(id, password) {
  let t = document.getElementById('t');
  t.value = id;
  t.dispatchEvent(new Event('input'));
  t.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter', keyCode: 13, which: 13, bubbles: true}));
  t.value = password;
  t.dispatchEvent(new Event('input'));
  t.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter', keyCode: 13, which: 13, bubbles: true}));
}

function start() {
  let loginInterval = setInterval(() => {
    if (isLoginPage()) {
      clearInterval(loginInterval);
      navigator.credentials.get({password: true}).then(cred => {
        if (cred && cred.id && cred.password)
          login(cred.id, cred.password);
      })
    }
  }, 60);

  setTimeout(() => {
    clearInterval(loginInterval);
  }, 5000);
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
