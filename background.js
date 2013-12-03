// Called when the user clicks on the page action.
chrome.pageAction.onClicked.addListener(function(tab) {
  // No tabs or host permissions needed!
  console.log('Opening next results page of ' + tab.url);
  chrome.tabs.executeScript({
    code: 'document.getElementById("pnnext").click();'
  });
});

var emptyFunction = function() {}

var execCommand = emptyFunction;

// Listen for the content script (element_searcher.js) to send a message to the
// background page.
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  switch (request) {
    case "google-search":
      execCommand = execGoogleSearchCommand;
      chrome.pageAction.show(sender.tab.id);
      break;
    case "arstechnica":
      execCommand = execArsTechnicaCommand;
      chrome.pageAction.show(sender.tab.id);
      break;
    case "none":
      execCommand = emptyFunction;
      if (sender.tab != undefined)
        chrome.pageAction.hide(sender.tab.id);
      break;
    default:
      break;
  }
  
});

function clickOnElementById(id) {
  chrome.tabs.executeScript(
    {code: 'document.getElementById("' + id + '").click();'}
  );
}

function clickOnElementByClass(className) {
  chrome.tabs.executeScript(
    {code: 'document.getElementsByClassName("' + className + '")[0].click();'}
  );
}

function execGoogleSearchCommand(command) {
  clickOnElementById("pnnext");
}

function execArsTechnicaCommand(command) {
  clickOnElementByClass("next");
}

// shortcut commands
chrome.commands.onCommand.addListener(function(command) {
  execCommand(command);
});
