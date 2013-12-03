var nextCommandQuery = "";

// Listen for the content script (element_searcher.js) to send a message to the
// background page.
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request === "none") {
    nextCommandQuery = "";
    if (sender.tab != undefined)
          chrome.pageAction.hide(sender.tab.id);
  } else {
    if (sender.tab != undefined)
      chrome.pageAction.show(sender.tab.id);
    nextCommandQuery = request;
  }
});

function clickOnElementByQuery(query) {
  chrome.tabs.executeScript(
    {code: 'document.querySelector("' + query + '").click();'}
  );
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