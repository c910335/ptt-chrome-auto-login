chrome.runtime.onMessage.addListener((cred, _, sendResponse) => {
  navigator.credentials.store(new PasswordCredential(cred));
  sendResponse('已更新');
});

setTimeout(() => {
  navigator.credentials.get({password: true}).then(cred => {
    if (cred.id && cred.password) {
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
