(function () {  // namespace protection

  var nextCommandQueryMap = {};

  // Listen for the content script (element_searcher.js) for query registration
  // and listen for the excuter script (executer.js) for query requests
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // if the request comes from the executer, send him the element to click on
    if (request === "executer") {
      if ((sender.tab !== undefined) && 
          (sender.tab.id in nextCommandQueryMap)) {
        console.log("got request from executer for tab " + sender.tab.id);
        sendResponse(nextCommandQueryMap[sender.tab.id]);
      } else {
        console.log("got request from executer but no tab is associated");
      }
      return false;
    }
    // this is the element searcher - update the map of elements
    if (request === "none") {
      if ((sender.tab !== undefined) && (sender.tab.id in nextCommandQueryMap))
        console.log("got null request for tab " + sender.tab.id + 
                    " which previously held \'" + 
                    nextCommandQueryMap[sender.tab.id] + "\'"); 
      nextCommandQueryMap[sender.tab.id] = "";
      if (sender.tab !== undefined)
        chrome.pageAction.hide(sender.tab.id);
    } else {
      console.log("got identification of \'" + request + 
                  "\' for tab " + sender.tab.id);
      // only show the icon if wasn't already shown
      if ((sender.tab !== undefined) &&
          (nextCommandQueryMap[sender.tab.id] !== "")) {
        chrome.pageAction.show(sender.tab.id);
      }
      nextCommandQueryMap[sender.tab.id] = request;
    }
  });

  function injectedCallback(results) {
    // TODO handle results
    console.log("got result back: " + results);
  }

  function clickOnElementByQuery(query) { 
    chrome.tabs.executeScript(null,
      {file: 'executer.js', runAt: 'document_end'},
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

})(); // namespace protection end
