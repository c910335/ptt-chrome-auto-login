chrome.tabs.query({active: true, currentWindow: true}, tabs => {
  window.currentTab = tabs[0];
  if (!currentTab.url.startsWith("https://term.ptt.cc"))
    window.open("https://term.ptt.cc/");
})

document.addEventListener("DOMContentLoaded", () => {
  let form = document.getElementById("form");
  let message = document.getElementById("message")

  chrome.storage.local.get({id: ''}, res => form.id.value = res.id);

  form.addEventListener("submit", event => {
    event.preventDefault();
    chrome.storage.local.set({id: form.id.value});
    chrome.tabs.sendMessage(currentTab.id, {
      id: form.id.value,
      password: form.password.value
    }, res => {
      message.textContent = res;
      setTimeout(() => message.textContent = '', 2000);
    });
  })
});
