chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
  if (msg) {
    if (msg.id && msg.password) {
      navigator.credentials.store(new PasswordCredential(msg));
      sendResponse('已更新');
    } else if (msg == 'ping')
      sendResponse('pong');
  }
});

setTimeout(() => {
  navigator.credentials.get({password: true}).then(cred => {
    if (cred && cred.id && cred.password) {
      let t = document.getElementById('t');
      t.value = cred.id;
      t.dispatchEvent(new Event('input'));
      t.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter', keyCode: 13, which: 13, bubbles: true}));
      t.value = cred.password;
      t.dispatchEvent(new Event('input'));
      t.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter', keyCode: 13, which: 13, bubbles: true}));
    }
  })
}, 500);
