(function () {  // namespace protection

  var requestMap = {};

  // Listen for the content script (element_searcher.js) for query registration
  // and listen for the excuter script (executer.js) for query requests
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    
    // if the request comes from the executer, send him the element to click on
    console.log("got request: " + JSON.stringify(request));
    
    if (request.type === "executer") {
      if (sender.tab !== undefined) {
        console.log("got request from executer for tab " + sender.tab.id);
        console.log("sending back " + JSON.stringify(requestMap[sender.tab.id]));
        sendResponse(requestMap[sender.tab.id]);
      } else {
        console.log("got request from executer but no tab is associated");
        sendResponse(undefined);
      }
      return false;
    }

    if (request.type === "none") {
      if ((sender.tab !== undefined) && 
          (sender.tab.id in requestMap) &&
          (requestMap[sender.tab.id] !== undefined)) {
        console.log("got null request for tab " + sender.tab.id + 
                    " which previously held " + 
                    JSON.stringify(requestMap[sender.tab.id])); 
        delete requestMap[sender.tab.id];
        chrome.pageAction.hide(sender.tab.id);
      }
      return false;
    }
    
    if ((request.type === "query") ||
        (request.type === "url")) 
    {
      if ((sender.tab === undefined) ||
          (sender.tab.id === undefined)) {
        console.log("got request but no tab id");
        return false;
      }
      
      if (JSON.stringify(requestMap[sender.tab.id]) === 
            JSON.stringify(request)) {
        // already enabled
        console.log("request already enabled");
        return false;
      }
      
      console.log("got identification of type " + request.type + 
                  " for tab " + sender.tab.id);
      
      requestMap[sender.tab.id] = request;
      // show "next" button
      chrome.pageAction.show(sender.tab.id);
      
      return true;
    }

  });

  function injectedCallback(results) {
    // TODO handle results
    console.log("got result back: " + JSON.stringify(results));
  }

  function runExecuter(currentTab) {
    console.log("injecting executer");
    chrome.tabs.executeScript(currentTab.id,
      {file: 'executer.js', runAt: 'document_end', allFrames: true},
      injectedCallback);
  }

  // shortcut commands
  chrome.commands.onCommand.addListener(function(command) {
    console.log("got command " + command);
    if (command == "open-next-page") {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var currentTab = tabs[0];
        runExecuter(currentTab);
      });
    } else if (command == "open-prev-page") {
      chrome.tabs.executeScript(null, {code: 'history.back();'});
    }
  });

  // Called when the user clicks on the page action.
  chrome.pageAction.onClicked.addListener(function(tab) {
    // debug icon change to see that the click is actually done
    chrome.pageAction.setIcon({path:"Quicken2_Clicked.png", tabId: tab.id});
    runExecuter(tab);
  });

  // in case the tab gets replaced update the array
  chrome.webNavigation.onTabReplaced.addListener(function(details) {
    // check if the old tab ID was in the array, if so, move to new ID
    if (requestMap[details.replacedTabId] !== undefined) {
      requestMap[details.tabId] = 
        requestMap[details.replacedTabId];
      delete requestMap[details.replacedTabId];
    }
  });

  /*
  function inject_element_searcher(tabId) {
    chrome.tabs.executeScript(tabId, 
      {file: "element_searcher.js", runAt: "document_idle", allFrames: false}, 
      injectedCallback);
  }
  
  chrome.webNavigation.onDOMContentLoaded.addListener(function(details) {
    console.log("tab " + details.tabId + " loaded url " + details.url);
    inject_element_searcher(details.tabId);
  });
  */

})(); // namespace protection end
