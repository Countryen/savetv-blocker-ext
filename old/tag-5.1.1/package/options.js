var storage = new C0Storage(C0STORAGE_TYPE.LOCAL);

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("clear").addEventListener("click", clear);
  document.getElementById("save").addEventListener("click", save);
  document.getElementById("load").addEventListener("click", load);
  update();
});

function update() {
    storage.getOneAsync("entries", function(items) {
      while (document.getElementById('list').firstChild) {
        document.getElementById('list').removeChild(document.getElementById('list').firstChild);
      }
  
      var entries = items.entries;
      var len = entries.length;
  
      document.getElementById('counter').textContent = entries.length;
  
      for (var i = 0; i < len; i++) {
        var li = document.createElement("li");
        li.textContent = entries[i].title;
        document.getElementById('list').appendChild(li);
      }
      
    });
  
    storage.getSpaceOfAllAsync(function(spaceInBytes) {
      var spaceStruct = storage.convertBytesToBiggestUnit(spaceInBytes);
      document.getElementById('size').textContent = spaceStruct.amount;
      document.getElementById('type').textContent = spaceStruct.unit;
    });
    
  }
  
  function clear() {
    storage.setNewArray("entries");
    document.getElementById("notify").innerHTML = "";
    document.getElementById("notify").textContent = new Date().toLocaleString() + ": Sammlung geleert (Bitte www.save.tv neu laden)";
    document.getElementById("conditional-actions").innerHTML = "";
    update();
  }
  
  function save() {
    storage.getOneAsync("entries", function(items) {
      var saveJsonObject = { };
  
      var entries = items.entries;
      var len = entries.length;
  
      saveJsonObject.meta = {
        entryCount: len,
        saveDate: new Date().toLocaleDateString(),
        saveVersion: 1
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
  
      a.download = "C0SaveTVBlocker_Backup_" + new Date().toISOString() + ".json";
      a.href = url.createObjectURL(bb);
      a.textContent = 'Jetzt herunterladen';
  
      a.dataset.downloadurl = ["text/plain", a.download, a.href].join(':');
      a.draggable = true; // Don't really need, but good practice.
  
      document.getElementById("conditional-actions").innerHTML = "";
      document.getElementById("conditional-actions").appendChild(a);  
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
    loadButton.textContent = "Datei einlesen";
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
          document.getElementById("conditional-actions").textContent = new Date().toLocaleString() + ": Sammlung geladen (Bitte www.save.tv neu laden)";
          update();
      }
    }
    document.getElementById("conditional-actions").innerHTML = "";
    document.getElementById("conditional-actions").appendChild(loadInput);
    document.getElementById("conditional-actions").appendChild(loadButton);
    
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