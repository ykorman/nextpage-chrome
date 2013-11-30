// Called when the user clicks on the page action.
chrome.pageAction.onClicked.addListener(function(tab) {
  // No tabs or host permissions needed!
  console.log('Opening next results page of ' + tab.url);
  chrome.tabs.executeScript({
    code: 'document.getElementById("pnnext").click();'
  });
});

// Listen for the content script (element_searcher.js) to send a message to the
// background page.
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("got message " + request);
  chrome.pageAction.show(sender.tab.id);
});