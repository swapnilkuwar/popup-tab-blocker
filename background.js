function recordBlock(hostname, blockedUrl) {
  const countKey = `${hostname}_count`;

  chrome.storage.local.get([countKey], (data) => {
    const count = (data[countKey] || 0) + 1;

    chrome.storage.local.set({
      [countKey]: count,
    });
  });
}

function updateIconForTab(tabId, url) {
  if (!url) return;

  const hostname = new URL(url).hostname;

  chrome.storage.local.get(hostname, (data) => {
    const enabled = Boolean(data[hostname]);

    chrome.action.setIcon({
      tabId,
      path: enabled ? "icons/on.png" : "icons/off.png",
    });
  });
}

chrome.tabs.onActivated.addListener(({ tabId }) => {
  chrome.tabs.get(tabId, (tab) => {
    if (tab?.url) {
      updateIconForTab(tabId, tab.url);
    }
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    updateIconForTab(tabId, tab.url);
  }
});

// Check if blocking is enabled for a hostname
function isBlockingEnabled(hostname, callback) {
  chrome.storage.local.get(hostname, (data) => {
    callback(Boolean(data[hostname]));
  });
}

// Kill new tabs/windows opened by enabled sites
chrome.tabs.onCreated.addListener((tab) => {
  if (tab.openerTabId === undefined) return;

  chrome.tabs.get(tab.openerTabId, (opener) => {
    if (chrome.runtime.lastError || !opener?.url) return;

    const hostname = new URL(opener.url).hostname;

    chrome.storage.local.get(hostname, (data) => {
      if (data[hostname]) {
        recordBlock(hostname, tab.pendingUrl || tab.url);
        chrome.tabs.remove(tab.id);
      }
    });
  });
});
