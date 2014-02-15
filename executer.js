(function () {   // namespace protection
  function executer(request) {
    if (request === undefined) {
      console.log("got bad request");
      return;
    }
    
    console.log("executer: got request " + request.type);
    if (request.type === "url") {
      console.log("moving to url " + request.url);
      window.location = request.url;
    }
    if (request.type === "query") {
      element = document.querySelector(request.query);
      if ((element !== undefined) && (element.click !== undefined)) {
        console.log("found clickable element, clicking...");
        element.click();
      }
    }
  }
  // send a request to the background script for the element to "click" on
  chrome.runtime.sendMessage({type: "executer"}, executer);
  
  return true;
})();  // namespace protection end