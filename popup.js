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
    div.innerHTML = "<img src='" + app.icon + "'><a>" + app.url + "</a> (" + app.count + ")";
    div.onclick = OnClick;
    container.appendChild(div);
  }
}

function OnClick() {
  console.log("OnClick");
}

window.onload = function() {
  FetchAppList().then(RenderAppList);
}
