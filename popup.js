function FetchAppList() {
  return new Promise(function(resolve, reject) {
    chrome.runtime.sendMessage(
        {command: "FetchAppList"},
        function(response) {
          resolve(response.appList);
        });
  });
}

function RenderAppList(appList) {
  // Sort
  appList.sort(function(a, b) {
    return b.count - a.count;
  });
  
  // Draw
  var container = document.body;

  while (container.firstChild)
    container.removeChild(container.firstChild);

  for (var app of appList) {
    var div = document.createElement("DIV");
    div.innerText = app.url + " (" + app.count + ")";
    container.appendChild(div);
  }
}

window.onload = function() {
  FetchAppList().then(RenderAppList);
}
