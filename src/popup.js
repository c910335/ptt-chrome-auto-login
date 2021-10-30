chrome.tabs.query({active: true, currentWindow: true}, tabs => {
  window.currentTab = tabs[0];
  chrome.tabs.sendMessage(currentTab.id, 'ping', res => {
    if (!res) {
      chrome.runtime.lastError;
      window.open("https://term.ptt.cc/");
    }
  });
})

document.addEventListener("DOMContentLoaded", () => {
  let form = document.getElementById("form");
  let message = document.getElementById("message");

  chrome.storage.local.get({id: ''}, res => form.id.value = res.id);

  form.addEventListener("submit", event => {
    event.preventDefault();
    chrome.storage.local.set({id: form.id.value});
    chrome.tabs.sendMessage(currentTab.id, {
      id: form.id.value,
      password: form.password.value
    }, res => {
      form.password.value = '';
      message.textContent = res;
      setTimeout(() => message.textContent = '', 5000);
    });
  })

  let favorite = document.getElementById("favorite");

  chrome.storage.local.get({favorite: true}, res => favorite.checked = res.favorite);

  favorite.addEventListener("change", event => {
    console.log('123');
    chrome.storage.local.set({favorite: favorite.checked});
  });
});
