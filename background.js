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
    chrome.tabs.sendMessage(tab.id, 'next_button_click');
  });
  
  // handle clicking of context menu
  function handleContextOnClick(info, tab) {
    console.log("Got Info: " + JSON.stringify(info));
    console.log("Got Tab: " + JSON.stringify(tab));
    // only one menu item, so just send message to page action
    chrome.tabs.sendMessage(tab.id, 'xpath_record');
  }
  
  function basicOnCreate() {
      if (chrome.runtime.lastError)
        console.log("Error creating context menu: " + 
          JSON.stringify(chrome.runtime.lastErr.message));
  }
  
  chrome.contextMenus.onClicked.addListener(handleContextOnClick);
  
  // Set up context menu tree at install time.
  chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create(
      { "title": "Set as Quicken Next",
        "type": "normal",
        "id": "quicken1",
        "contexts": ["all"]
      },
      basicOnCreate
    );
  });

})(); // namespace protection end
