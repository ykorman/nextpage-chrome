(function () {  // namespace protection

  var nextCommandQueryMap = {};

  // Listen for the content script (element_searcher.js) for query registration
  // and listen for the excuter script (executer.js) for query requests
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // if the request comes from the executer, send him the element to click on
    console.log("got request: " + JSON.stringify(request));
    if (request.type === "executer") {
      if ((sender.tab !== undefined) && 
          (sender.tab.id in nextCommandQueryMap)) {
        console.log("got request from executer for tab " + sender.tab.id);
        sendResponse(nextCommandQueryMap[sender.tab.id]);
      } else {
        console.log("got request from executer but no tab is associated");
      }
      return false;
    }

    if (request.type === "none") {
      // TODO something is wrong here, I should simply remove the entry in the
      // Map and hide the tab
      if ((sender.tab !== undefined) && (sender.tab.id in nextCommandQueryMap)) {
        console.log("got null request for tab " + sender.tab.id + 
                    " which previously held " + 
                    JSON.stringify(nextCommandQueryMap[sender.tab.id])); 
        delete nextCommandQueryMap[sender.tab.id];
        chrome.pageAction.hide(sender.tab.id);
      }
      return false;
    }
    
    if ((request.type === "query") ||
        (request.type === "url")) 
    {
      console.log("got identification of type " + request.type + 
                  " for tab " + sender.tab.id);
      // only show the icon if wasn't already shown
      if ((sender.tab !== undefined) &&
          (nextCommandQueryMap[sender.tab.id] !== "")) {
        chrome.pageAction.show(sender.tab.id);
      }
      nextCommandQueryMap[sender.tab.id] = request;
      return false;
    }

  });

  function injectedCallback(results) {
    // TODO handle results
    console.log("got result back: " + results);
  }

  function runExecuter() { 
    chrome.tabs.executeScript(null,
      {file: 'executer.js', runAt: 'document_idle'},
      injectedCallback);
  }

  // shortcut commands
  chrome.commands.onCommand.addListener(function(command) {
    console.log("got command " + command);
    if (command == "open-next-page") {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var current = tabs[0];
        runExecuter();
      });
    } else if (command == "open-prev-page") {
      chrome.tabs.executeScript(null, {code: 'history.back();'});
    }
  });

  // Called when the user clicks on the page action.
  chrome.pageAction.onClicked.addListener(function(tab) {
    if (nextCommandQueryMap[tab.id] !== "")
      runExecuter();
  });

})(); // namespace protection end
