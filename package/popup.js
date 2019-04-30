// C0 Save.TV Blocker - Copyright (c) 2017 Countryen
// Script for the popup.html. Executed when the icon of the extension is clicked (at the top).

var storage = new C0Storage(C0STORAGE_TYPE.LOCAL);
var localizer = new C0Localizer();

/// Adding the Click-Event to the "to the options" button.
document.addEventListener('DOMContentLoaded', function() {
  var optionsButton = document.getElementById("options");
  optionsButton.addEventListener("click", click_options);
  
  //see also: https://medium.com/@xpl/hot-reloading-for-chrome-extensions-3da296916286
  //document.getElementById("reload").addEventListener("click", () => chrome.runtime.reload());

  localizer.localizeHTML(document);
});

/// Event-Handler for the Click-Event of the "to the options" button.
function click_options() {
  chrome.runtime.openOptionsPage();
}

