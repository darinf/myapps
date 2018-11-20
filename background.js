var apps = [];  // list of { url: "...", count: N }
var appsInitialized = false;

var syncing = false;
function SyncState() {
  if (syncing)
    return;
  syncing = true;
  setTimeout(function() {
    chrome.storage.sync.set({apps: apps}, function() {
      syncing = false;
    });
  }, 1000);
}

chrome.storage.sync.clear();
chrome.storage.sync.get(['apps'], function(result) {
  console.log("Got apps");
  if (result.apps)
    apps = result.apps;
  appsInitialized = true;
});

chrome.runtime.onInstalled.addListener(function() {
  console.log("My extension was installed!");
});

chrome.tabs.onActivated.addListener(function(info) {
  console.log("onActivated: " + info.windowId + "/" + info.tabId);
  chrome.tabs.get(info.tabId, function(tab) {
    console.log(info.windowId + "/" + info.tabId + " has URL: " + tab.url);

    var i = 0;
    for (; i < apps.length; ++i) {
      if (apps[i].url == tab.url) {
        apps[i].count++;
        break;
      }
    }

    if (i == apps.length)
      apps.push({url: tab.url, count: 1});

    SyncState();
  });
});
