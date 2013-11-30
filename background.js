// Called when the user clicks on the page action.
chrome.pageAction.onClicked.addListener(function(tab) {
  // No tabs or host permissions needed!
  console.log('Opening next results page of ' + tab.url);
  chrome.tabs.executeScript({
    code: 'document.getElementById("pnnext").click();'
  });
});

// register the page action on all pages
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  gs = /https?:\/\/www\.google\.com\/.*/
  if (gs.test(tab.url)) {
    chrome.pageAction.show(tabId);
  }  
});
