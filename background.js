(function () {  // namespace protection

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    console.log("got request: " + JSON.stringify(request));

    if (request === true)
      chrome.pageAction.show(sender.tab.id);

  });

  // Called when the user clicks on the page action.
  chrome.pageAction.onClicked.addListener(function(tab) {
    // debug icon change to see that the click is actually done
    chrome.pageAction.setIcon({path:"icon19_click.png", tabId: tab.id});
    chrome.tabs.sendMessage(tab.id, true);
  });

})(); // namespace protection end
