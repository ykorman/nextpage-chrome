(function () {
  if (document.getElementById("pnnext") !== null) {
    chrome.runtime.sendMessage("google_search");
  }
})();