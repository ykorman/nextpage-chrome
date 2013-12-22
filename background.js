var nextCommandQueryMap = {};

// Listen for the content script (element_searcher.js) to send a message to the
// background page.
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request === "none") {
    nextCommandQueryMap[sender.tab.id] = "";
    if (sender.tab != undefined)
          chrome.pageAction.hide(sender.tab.id);
  } else {
    console.log("got identification of " + request);
    if (sender.tab != undefined)
      chrome.pageAction.show(sender.tab.id);
    nextCommandQueryMap[sender.tab.id] = request;
  }
});

function injectedCallback(results) {
  // TODO handle results
  console.log("got result back: " + results);
}

function clickOnElementByQuery(query) { 
  // TODO move injected code to separate file, use file: instead of code:
  chrome.tabs.executeScript(null,
    {code: 'document.querySelector("' + query + '").click();'},
    injectedCallback);
}

// shortcut commands
chrome.commands.onCommand.addListener(function(command) {
  console.log("got command " + command);
  if (command == "open-next-page") {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var current = tabs[0];
      clickOnElementByQuery(nextCommandQueryMap[current.id]);
    });
  } else if (command == "open-prev-page") {
    chrome.tabs.executeScript(null, {code: 'history.back();'});
  }
});

// Called when the user clicks on the page action.
chrome.pageAction.onClicked.addListener(function(tab) {
  if (nextCommandQueryMap[tab.id] !== "")
    clickOnElementByQuery(nextCommandQueryMap[tab.id]);
});