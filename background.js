const SOURCE_DOMAIN = "letsstream2.pages.dev";

// Catch new tabs/windows
chrome.tabs.onCreated.addListener((tab) => {
  if (tab.openerTabId !== undefined) {
    chrome.tabs.get(tab.openerTabId, (opener) => {
      if (chrome.runtime.lastError || !opener || !opener.url) {
        return;
      }

      if (opener.url.includes(SOURCE_DOMAIN)) {
        console.log("[BLOCKED] Tab opened by letsstream → closing", tab.id);
        chrome.tabs.remove(tab.id);
      }
    });
  }
});

// Catch delayed navigations (popunders)
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.openerTabId !== undefined) {
    chrome.tabs.get(details.openerTabId, (opener) => {
      if (chrome.runtime.lastError || !opener || !opener.url) {
        return;
      }

      if (opener.url.includes(SOURCE_DOMAIN)) {
        console.log(
          "[BLOCKED] Navigation from letsstream → closing",
          details.tabId,
        );
        chrome.tabs.remove(details.tabId);
      }
    });
  }
});
