(function () {
  if (document.getElementById("pnnext") !== null) {
    chrome.runtime.sendMessage("google-search");
  } else if (document.getElementsByClassName("next")[0] !== undefined) {
    chrome.runtime.sendMessage("arstechnica");
  } else {
    chrome.runtime.sendMessage("none");
  }
})();