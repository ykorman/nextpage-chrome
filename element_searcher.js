(function () {

  var selector = {};
  
  selector["google_search"] = "#pnnext";
  selector["arstechnica"] = "span.next";
  
  // keep always as last
  // in arstechnica this one moves to the next article, and the
  // more specific above moves to next page (if exists)
  selector["general"] = "a[rel=next]";
  
  var found = false;
  
  for (site in selector) {
    if (selector.hasOwnProperty(site)) {
      var query = selector[site];
      if (document.querySelector(query) !== null) {
        found = true;
        chrome.runtime.sendMessage(query);
        break;
      }
    }
  }
  
  if (!found)
    chrome.runtime.sendMessage("none");
  
})();