/// C0 SaveTV Blocker - Copyright (c) 2017 Countryen
/// Script is loaded when the site (save.tv) is loaded.

/// Adds right-click (contextmenu) buttons.
function createConextMenuButtons() {
    // Creates 1 Context-Menu-Button.
    // The Main button to hide an entry.
    // The button sends a MESSAGE, see the name inside the "onClick".
    chrome.contextMenus.create({
        "id": "c0savetvblocker-main-menu-item", 
        "title": "C0 SaveTV Blocker - Alle Einträge mit diesem Titel verstecken",
        "enabled": true,
        "contexts": [
            "link"
        ],
        "documentUrlPatterns": [
            "*://www.save.tv/*"
        ],
        "targetUrlPatterns": [
            "*://*.save.tv/*"
        ],
        "onclick": function(info, tab) {
            chrome.tabs.sendMessage(tab.id, {
                'name': 'c0savetvblocker-main-menu-item-clicked'
            });
        }
    });

    /*
    // Creates 1 Context-Menu-Button.
    // Test menu button.
    // The button sends a MESSAGE, see the name inside the "onClick".
    chrome.contextMenus.create({
        "id": "c0savetvblocker-test-menu-item",
        "title": "C0 SaveTV Blocker - Test",
        "enabled": true,
        "contexts": [
            "link"
        ],
        "documentUrlPatterns": [
            "*://www.save.tv/*"
        ],
        "targetUrlPatterns": [
            "*://*.save.tv/*"
        ],
        "onclick": function(info, tab) {
            chrome.tabs.sendMessage(tab.id, {
                'name': 'c0savetvblocker-test-menu-item-clicked'
            });
        }
    });
    */
}

createConextMenuButtons();


