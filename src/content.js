function syncPrefs() {
  chrome.storage.local.get({duplicate: true, favorite: true}, res => {
    document.documentElement.dataset.duplicate = res.duplicate;
    document.documentElement.dataset.favorite = res.favorite;
  });
}

syncPrefs();
chrome.storage.onChanged.addListener(syncPrefs);

chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
  if (msg === 'ping') {
    sendResponse('pong');
  } else if (msg && msg.id && msg.password) {
    (async () => {
      try {
        await navigator.credentials.store(new PasswordCredential(msg));
        sendResponse('已更新');
        document.dispatchEvent(new CustomEvent('login'));
      } catch (err) {
        sendResponse('儲存失敗：' + (err.message || err));
      }
    })();
    return true;
  }
});
