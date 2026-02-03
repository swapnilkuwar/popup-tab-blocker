chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tab = tabs[0];
  if (!tab?.url) return;

  const hostname = new URL(tab.url).hostname;

  const toggleBtn = document.getElementById("toggle");
  const siteDiv = document.getElementById("site");
  siteDiv.textContent = `Site: ${hostname}`;

  const countEl = document.getElementById("count");

  const countKey = `${hostname}_count`;

  chrome.storage.local.get([countKey], (data) => {
    const count = data[countKey] || 0;

    countEl.textContent = `Blocked today: ${count}`;
  });

  chrome.storage.local.get(hostname, (data) => {
    let enabled = Boolean(data[hostname]);
    updateButton(enabled, toggleBtn);

    toggleBtn.onclick = () => {
      enabled = !enabled;

      chrome.storage.local.set({ [hostname]: enabled }, () => {
        updateButton(enabled, toggleBtn);
        toggleBtn.classList.toggle("enabled", enabled);
        toggleBtn.classList.toggle("disabled", !enabled);

        chrome.action.setIcon({
          tabId: tab.id,
          path: enabled ? "icons/on.png" : "icons/off.png",
        });
      });
    };
  });
});

function updateButton(enabled, toggleBtn) {
  toggleBtn.textContent = enabled
    ? "Disable popup blocking"
    : "Enable popup blocking";
}
