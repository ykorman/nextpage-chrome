var nextCommandQuery = "";

// Listen for the content script (element_searcher.js) to send a message to the
// background page.
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request === "none") {
    nextCommandQuery = "";
    if (sender.tab != undefined)
          chrome.pageAction.hide(sender.tab.id);
  } else {
    console.log("got identification of " + request);
    if (sender.tab != undefined)
      chrome.pageAction.show(sender.tab.id);
    nextCommandQuery = request;
  }
});

function injectedCallback(results) {
  // TODO handle results
  // console.log("got result back: " + results);
}

function clickOnElementByQuery(query) { 
  // TODO move injected code to separate file, use file: instead of code:
  chrome.tabs.executeScript(null,
    {code: 'document.querySelector("' + query + '").click();'},
    injectedCallback);
}

// shortcut commands
chrome.commands.onCommand.addListener(function(command) {
  if (nextCommandQuery !== "")
    clickOnElementByQuery(nextCommandQuery);
});

// Called when the user clicks on the page action.
chrome.pageAction.onClicked.addListener(function(tab) {
  if (nextCommandQuery !== "")
    clickOnElementByQuery(nextCommandQuery);
});