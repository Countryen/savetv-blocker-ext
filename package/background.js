/// C0 Save.TV Blocker - Copyright (c) 2017 Countryen
/// Script executes when the site (www.save.tv) is loaded (background)

var localizer = new C0Localizer();
var storage = new C0Storage(C0STORAGE_TYPE.LOCAL);

/// Function.
/// Adds the right-click (contextmenu) buttons.
function createContextMenuButtons() {
    // Creates 1 Context-Menu-Button.
    // The Main button to hide an entry.
    // The button sends a MESSAGE, see the name inside the "onClick".
    chrome.contextMenus.create({
        "id": "c0savetvblocker-main-menu-item", 
        "title": localizer.localize("GENERAL_ContextMenuMainItem_Title"),
        "enabled": true,
        "contexts": [
            "link"
        ],
        "documentUrlPatterns": [
			// Logged Out:
            "*://www.save.tv/STV/S/obj/TVProgCtr/stations.cfm*", 
            "*://www.save.tv/STV/S/obj/TVProgCtr/TvProgramm*",
			// Logged In:
			"*://www.save.tv/STV/M/obj/TVProgCtr/stations.cfm*", 
            "*://www.save.tv/STV/M/obj/TVProgCtr/TvProgramm*"
        ],
        "targetUrlPatterns": [
			// Logged Out:
            "*://www.save.tv/STV/S/obj/TC/SendungsDetails.cfm*",
			// Logged In:
			"*://www.save.tv/STV/M/obj/archive/VideoArchiveDetails.cfm*"
        ],
        "onclick": function(info, tab) {
            chrome.tabs.sendMessage(tab.id, {
                'name': 'c0savetvblocker-main-menu-item-clicked'
            });
        }
    });
}

/// =============================================================================

/// Execution:
createContextMenuButtons();

/// Installation-Check: After installation the "entries" must be set to an empty array.
/// Other wise the full application will fail until the first CLEAR is done (see options-page).
storage.getOneAsync("entries", function(items) {
    if (items == undefined || items.entries == undefined) {
        storage.setNewArray("entries");
    }
});

storage.getOneAsync("old_entries_1", function(items) {
    if (items == undefined || items.old_entries_1 == undefined) {
        storage.setNewArray("old_entries_1");
    }
});

/// Add a info-note to the background-page for suspicious people.
document.writeln("This is the background site of the Save.TV Blocker Extension (by Countryen (C0)).");
document.writeln("It's script (background.js) is only used to display this message and to create the extra context-menu-button to hide/add entries.");
document.writeln("It is loaded when you browse on www.save.tv");


