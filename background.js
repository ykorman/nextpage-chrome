(function () {  // namespace protection

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    console.log("got request: " + JSON.stringify(request));

    if (request === true)
      chrome.pageAction.show(sender.tab.id);

  });

  function injectedCallback(results) {
    // TODO handle results
    console.log("got result back: " + JSON.stringify(results));
  }

  // shortcut commands
  chrome.commands.onCommand.addListener(function(command) {
    console.log("got command " + command);
    if (command == "open-next-page") {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var currentTab = tabs[0];
        chrome.tabs.sendMessage(currentTab.id, true);
      });
    } else if (command == "open-prev-page") {
      chrome.tabs.executeScript(null, {code: 'history.back();'});
    }
  });

  // Called when the user clicks on the page action.
  chrome.pageAction.onClicked.addListener(function(tab) {
    // debug icon change to see that the click is actually done
    chrome.pageAction.setIcon({path:"icon19_click.png", tabId: tab.id});
    chrome.tabs.sendMessage(tab.id, true);
  });

})(); // namespace protection end
