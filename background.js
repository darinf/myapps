var apps = [];  // list of { url: "...", icon: "...", count: N }
var appsInitialized = false;

var syncing = false;
function SyncState() {
  if (syncing)
    return;
  syncing = true;
  setTimeout(function() {
    chrome.storage.local.set({apps: apps}, function() {
      console.log("Sync'd");
      syncing = false;
    });
  }, 1000);
}

function UpdateApps(tabId, tab) {
  console.log(tab.windowId + "/" + tabId + " has URL: " + tab.url);

  var url = new URL(tab.url).origin;

  var i = 0;
  for (; i < apps.length; ++i) {
    if (apps[i].url == url) {
      if (!apps[i].icon)
        apps[i].icon = tab.favIconUrl;
      apps[i].count++;
      break;
    }
  }

  if (i == apps.length)
    apps.push({url: url, icon: tab.favIconUrl, count: 1});

  SyncState();
}

chrome.storage.local.get(['apps'], function(result) {
  console.log("Got apps");
  if (result.apps)
    apps = result.apps;
  appsInitialized = true;
});

chrome.runtime.onInstalled.addListener(function() {
  console.log("My extension was installed!");
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.command == "FetchAppList") {
    // TODO: if appsInitialized is false....
    sendResponse({appList: apps});
  }
});

chrome.tabs.onActivated.addListener(function(info) {
  console.log("onActivated: " + info.windowId + "/" + info.tabId);
  chrome.tabs.get(info.tabId, function(tab) {
    UpdateApps(info.tabId, tab);
  });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (!changeInfo.url)
    return;
  console.log("onUpdated: " + tab.windowId + "/" + tabId);
  UpdateApps(tabId, tab);
});
