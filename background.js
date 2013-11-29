// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  // No tabs or host permissions needed!
  console.log('Opening next results page of ' + tab.url);
  chrome.tabs.executeScript({
    code: 'document.getElementById("pnnext").click();'
  });
});