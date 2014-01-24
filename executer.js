(function () {   // namespace protection
  function executer(query) {
    console.log("executer: got query " + query);
    element = document.querySelector(query);
    if ((element !== undefined) && (element.click !== undefined)) {
      console.log("found clickable element, clicking...");
      element.click();
    }
  }
  // send a request to the background script for the element to "click" on
  chrome.runtime.sendMessage("executer", executer);
  
  return true;
})();  // namespace protection end