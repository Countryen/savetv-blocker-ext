// C0 Save.TV Blocker - Copyright (c) 2017 Countryen
// Script for options.html. Executed at the options page (extension > options).

var storage = new C0Storage(C0STORAGE_TYPE.LOCAL);
var localizer = new C0Localizer();

var GLOBAL_SELECTED_ENTRY_LI = null;

/// Everything is done when the DOM is fully loaded (to avoid problems):
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("clear-allowed").addEventListener("click", clearAllowed);
  document.getElementById("clear").addEventListener("click", clear);
  document.getElementById("save").addEventListener("click", save);
  document.getElementById("load").addEventListener("click", load);
  document.getElementById("delete").addEventListener("click", delete_);
  document.getElementById("details").addEventListener("click", details);
  update();
  localizer.localizeHTML(document);
});

/// Helper function.
/// Updates the HTML with info about the list of entries (amount)
/// Populates the list of entries to the list.
function update() {
    storage.getOneAsync("entries", function(items) {
      while (document.getElementById('list').firstChild) {
        document.getElementById('list').removeChild(document.getElementById('list').firstChild);
      }

      if (items.entries != undefined) {
      var entries = items.entries.sort(function compare(a,b) {
        var aa=a.title.toLowerCase(), bb=b.title.toLowerCase();
        if (aa < bb)
           return -1;
        if (aa > bb)
          return 1;
        return 0;
      });
      var len = entries.length;
  
      document.getElementById('counter').textContent = entries.length;
  
      for (var i = 0; i < len; i++) {
        var li = document.createElement("li");
        li.textContent = entries[i].title;
        li.addEventListener("click", function() { GLOBAL_SELECTED_ENTRY_LI = this; update(); });
        document.getElementById('list').appendChild(li);
      }
    }

      /// Conditional Visibility/Display/Styling
      if (!GLOBAL_SELECTED_ENTRY_LI) {
        document.getElementById("manage-entry").style.display = "none";
      } else {
        document.getElementById("manage-entry").style.display = "block";
        document.getElementById("manage-entry-title").textContent = GLOBAL_SELECTED_ENTRY_LI.textContent;
      }

      if (document.getElementById("list").children.length == 0) {
        document.getElementById("save").style.display = "none";
        document.getElementById("clear").style.display = "none";
        document.getElementById("clear-allowed").style.display = "none";
        document.getElementById("clear-allowed-label").style.display = "none";
      } else {
        document.getElementById("save").style.display = "inline-block";
        document.getElementById("clear").style.display = "inline-block";
        document.getElementById("clear-allowed").style.display = "inline-block";
        document.getElementById("clear-allowed-label").style.display = "inline-block";
      }

    });
  
    storage.getSpaceOfAllAsync(function(spaceInBytes) {
      var spaceStruct = storage.convertBytesToBiggestUnit(spaceInBytes);
      document.getElementById('size').textContent = spaceStruct.amount.toFixed(2);
      document.getElementById('type').textContent = spaceStruct.unit;
    });
  }

  storage.getSpaceOfAllAsync(function(spaceInBytes) {
    var spaceStruct = storage.convertBytesToBiggestUnit(spaceInBytes);
    document.getElementById('size').textContent = spaceStruct.amount.toFixed(2);
    document.getElementById('type').textContent = spaceStruct.unit;
  });
  
  function clear() {
    if (document.getElementById("clear-allowed").checked) {
      storage.setNewArray("entries");
      document.getElementById("notify").innerHTML = "";
      document.getElementById("notify").textContent = new Date().toLocaleString() + ": " + localizer.localize("OPTIONS_NotifyChangeMessage");
      document.getElementById("entries-actions").innerHTML = "";
      update();
    }
  }

  function delete_() {
    // TODO: delete selected entry (if) and update
    storage.getOneAsync("entries", function(items) {
      var entries = items.entries;
      var len = entries.length;
      
      for (var i = 0; i < len; i++) {
        var entry = entries[i];
        if (entry != undefined && entry.title === GLOBAL_SELECTED_ENTRY_LI.textContent) {
          entries.splice(i, 1);
          i = 0;
        }
      }
      storage.set({"entries": entries});
      update();
      GLOBAL_SELECTED_ENTRY_LI = null;

      document.getElementById("notify").innerHTML = "";
      document.getElementById("notify").textContent = new Date().toLocaleString() + ": " + localizer.localize("OPTIONS_NotifyChangeMessage");
    });
  }

  function details() {
    // TODO: Show details to the selected entry (if)
  }

  function clearAllowed() {
    if (this.checked) { 
      document.getElementById("clear").disabled = false; 
    } else {
      document.getElementById("clear").disabled = true;
    }
  }
  
  function save() {
    storage.getOneAsync("entries", function(items) {
      var saveJsonObject = { };
  
      var entries = items.entries;
      var len = entries.length;
  
      saveJsonObject.meta = {
        entryCount: len,
        saveDateUTC: new Date().toUTCString(),
        version: 1
      };
  
      saveJsonObject.entries = entries;
      
      var saveJsonString = JSON.stringify(saveJsonObject, null, 2);
      console.log(saveJsonString);
  
      // Donwload: 
      // see https://developers.google.com/web/updates/2011/08/Downloading-resources-in-HTML5-a-download
      // see http://html5-demos.appspot.com/static/a.download.html
      var url = window.webkitURL || window.URL || window.mozURL || window.msURL;
      var bb = new Blob([saveJsonString], {type: "text/plain"});
      var a = document.createElement('a');
  
      a.download = "SaveTV-Blocker_" + new Date().toISOString() + ".json";
      a.href = url.createObjectURL(bb);
      a.textContent = localizer.localize("OPTIONS_DownloadLink_TextContent");
  
      a.dataset.downloadurl = ["text/plain", a.download, a.href].join(':');
      a.draggable = true; // Don't really need, but good practice.
  
      document.getElementById("entries-actions").innerHTML = "";
      document.getElementById("entries-actions").appendChild(a);  
    });
  
    storage.getSpaceOfAllAsync(function(spaceInBytes) {
      var spaceStruct = storage.convertBytesToBiggestUnit(spaceInBytes);
      document.getElementById('size').textContent = spaceStruct.amount;
      document.getElementById('type').textContent = spaceStruct.unit;
    });
  }
  
  function load() {
    var loadInput = document.createElement("input");
    loadInput.type = "file";
    loadInput.id = "load-input";
  
  
    var loadButton = document.createElement("button");
    loadButton.textContent = localizer.localize("OPTIONS_LoadReadButton_TextContent");
    loadButton.onclick = function() {
      var loadInput = document.getElementById("load-input");
      var selectedFiles = loadInput.files;
      if (selectedFiles.length !== 1)
        throw Error("No file selected, loading can not proceed");
  
      var selectedFile = selectedFiles[0];
      var fileReader = new FileReader();
  
      // Asynchronous reading. The file must be utf-8!
      fileReader.onload = fileReader_onload; // see below.
      fileReader.readAsText(selectedFile);
  
      function fileReader_onload(fileReaderEvent) {
          var loadJsonString = fileReaderEvent.target.result;
          console.log(loadJsonString);
          var loadJsonObject = JSON.parse(loadJsonString);
          var entries = loadJsonObject.entries;
          storage.set({"entries": entries});
          document.getElementById("entries-actions").textContent = "";
          document.getElementById("notify").textContent = new Date().toLocaleString() + ": " + localizer.localize("OPTIONS_NotifyLoadMessage");
          update();
      }
    }
    document.getElementById("entries-actions").innerHTML = "";
    document.getElementById("entries-actions").appendChild(loadInput);
    document.getElementById("entries-actions").appendChild(loadButton);
    
  }

// Saves options to chrome.storage.sync.
function save_options() {
    var color = document.getElementById('color').value;
    var likesColor = document.getElementById('like').checked;
    chrome.storage.sync.set({
      favoriteColor: color,
      likesColor: likesColor
    }, function() {
      // Update status to let user know options were saved.
      var status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(function() {
        status.textContent = '';
      }, 750);
    });
  }
  
  // Restores select box and checkbox state using the preferences
  // stored in chrome.storage.
  function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
      favoriteColor: 'red',
      likesColor: true
    }, function(items) {
      document.getElementById('color').value = items.favoriteColor;
      document.getElementById('like').checked = items.likesColor;
    });
  }
  document.addEventListener('DOMContentLoaded', restore_options);
  document.getElementById('save').addEventListener('click',
      save_options);