// C0 SaveTV Blocker - Copyright (c) 2017 Countryen
// Popup script. Executed when the icon of the extension is clicked (at the top).

var storage = new C0Storage(C0STORAGE_TYPE.LOCAL);

/// Adding the Click-Event to the "to the options" button.
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("options").addEventListener("click", click_options);
});

/// Event-Handler for the Click-Event of the "to the options" button.
function click_options() {
  chrome.runtime.openOptionsPage();
}

