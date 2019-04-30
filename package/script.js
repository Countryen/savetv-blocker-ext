/// C0 Save.TV Blocker - Copyright (c) 2017 Countryen
/// Main script.

var logger = new C0Logger(C0LOGGER_LEVEL_FLAG.WARNING, console.log);
var storage = new C0Storage(C0STORAGE_TYPE.LOCAL);
var localizer = new C0Localizer();

//var menu = new C0Menu();

/// Structure of the site / the list of entries (html).
/// Will be used as a container for each entry.
/// "Genres/Highlights"
function SAVETV() {

    this.META = {
        "url": null,
        "target": null,
        "title": null,
        "subtitle": null
    };

    this.UL = {
        "self": null,
        "selector": "ul.listing-liste",
        "LI": {
            "self": null,
            "selector": "li.listing-sendung",
            "A": {
                "self": null,
                "selector": "a.listing-sendung-a",
                "href": null,
                "DIV2": {
                    "self": null,
                    "selector": "div.listing-oben",
                    "P": {
                        "self": null,
                        "selector": "p.listing-oben-fade",
                        "B": {
                            "self": null,
                            "selector": "b",
                            "textContent": null
                        },
                        "SPAN": {
                            "self": null,
                            "selector": "span",
                            "textContent": null
                        }
                    }
                }
            }
        }
    };
};


/// Structure of the site / the overview of entries (html).
/// Will be used as a container for each entry.
/// "Programmübersicht"
function SAVETV_OVERVIEW() {
    
        this.META = {
            "url": null,
            "target": null,
            "title": null,
            "subtitle": null
        };
    
        this.DIV = {
            "self": null,
            "selector": "div#bandInnen",
            "DIV": {
                "self": null,
                "selector": "div.sendung",
                "A": {
                    "self": null,
                    "selector": "a.sendung-rechts",
                    "href": null,
                    "B": {
                        "self": null,
                        "selector": "b",
                        "textContent": null
                    },
                    "SPAN": {
                        "self": null,
                        "selector": "span",
                        "textContent": null
                    }
                }
            }
        };
    };

/// We need a listener for "contextmenu" to get the info about what was clicked.
/// Is fired when the user RIGHT CLICKS (not when the user clicks the actual context menu item!)
/// Will save the information in the var "GLOBAL_ENTRY" if "GLOBAL_OK" is true.
var GLOBAL_ENTRY;
var GLOBAL_OK;
window.addEventListener('contextmenu', function (event) {
    logger.logTrace("Event contextmenu (Chrome context menu activated) started.");
    
    // starting conditions
    GLOBAL_ENTRY = null;
    GLOBAL_OK = null;
    entry = null;
    entry = Object.assign({}, new SAVETV());
    ok = true;

    // try to get the ul & li from the event (clicked)
    entry.UL.self = event.target.closest(entry.UL.selector);
    entry.UL.LI.self = event.target.closest(entry.UL.LI.selector);

    // do we have an ul & li?
    ok = ((entry.UL.self != null) && (entry.UL.LI.self != null));

    // if we have ul & li, we try to get deeper (nested) elements.
    if (ok) {
        ok = getDeeperNestedElements(entry);
    }
    
    // Why GLOBAL? because the chrome.runtime.onMessage.addListener(function (message) { ... needs it!
    GLOBAL_ENTRY = entry;
    GLOBAL_OK = ok;
});


/// The same as above for the OVERVIEW_ENTRY
var GLOBAL_OVERVIEW_ENTRY;
var GLOBAL_OVERVIEW_OK;
window.addEventListener('contextmenu', function (event) {
    logger.logTrace("Event contextmenu (Chrome context menu activated) started OVERVIEW.");
    
    // starting conditions
    GLOBAL_OVERVIEW_ENTRY = null;
    GLOBAL_OVERVIEW_OK = null;
    entry = null;
    entry = Object.assign({}, new SAVETV_OVERVIEW());
    ok = true;

    // try to get the div & div from the event (clicked)
    entry.DIV.self = event.target.closest(entry.DIV.selector);
    entry.DIV.DIV.self = event.target.closest(entry.DIV.DIV.selector);

    // do we have an div & div?
    ok = ((entry.DIV.self != null) && (entry.DIV.DIV.self != null));

    // if we have div & div, we try to get deeper (nested) elements.
    if (ok) {
        ok = getDeeperNestedOverviewElements(entry);
    }
    
    // Why GLOBAL? because the chrome.runtime.onMessage.addListener(function (message) { ... needs it!
    GLOBAL_OVERVIEW_ENTRY = entry;
    GLOBAL_OVERVIEW_OK = ok;
});


function getDeeperNestedElements(entry) {
    // we try to get deeper (nested) elements.

    var ok = true;

    if (ok) {
        ok = entry.UL.LI.A.self = entry.UL.LI.self.querySelector(entry.UL.LI.A.selector);
    }
    if (ok) {
        ok = entry.UL.LI.A.DIV2.self = entry.UL.LI.A.self.querySelector(entry.UL.LI.A.DIV2.selector);
    }
    if (ok) {
        ok = entry.UL.LI.A.DIV2.P.self = entry.UL.LI.A.DIV2.self.querySelector(entry.UL.LI.A.DIV2.P.selector);
    }
    if (ok) {
        ok = entry.UL.LI.A.DIV2.P.SPAN.self = entry.UL.LI.A.DIV2.P.self.querySelector(entry.UL.LI.A.DIV2.P.SPAN.selector);
    }
    if (ok) {
        ok = entry.UL.LI.A.DIV2.P.B.self = entry.UL.LI.A.DIV2.P.self.querySelector(entry.UL.LI.A.DIV2.P.B.selector);
    }

    // if still ok, all neccessary elements are found. 
    if (ok) {
        // the location of the given entry.
        entry.location = window.location;
        // the href of the entry.
        entry.UL.LI.A.href = entry.UL.LI.A.self.href;
        // the title of the entry (big).
        entry.UL.LI.A.DIV2.P.B.textContent = entry.UL.LI.A.DIV2.P.B.self.textContent;
        // the subtitle of the entry.
        entry.UL.LI.A.DIV2.P.SPAN.textContent = entry.UL.LI.A.DIV2.P.SPAN.self.textContent;
        
        entry.META.url = entry.location.href;
        entry.META.target = entry.UL.LI.A.href;
        entry.META.title = entry.UL.LI.A.DIV2.P.B.textContent;
        entry.META.subtitle = entry.UL.LI.A.DIV2.P.SPAN.textContent;
    }

    return ok;
}

function getDeeperNestedOverviewElements(entry) {
    // we try to get deeper (nested) elements.

    var ok = true;

    if (ok) {
        ok = entry.DIV.DIV.A.self = entry.DIV.DIV.self.querySelector(entry.DIV.DIV.A.selector);
    }
    if (ok) {
        ok = entry.DIV.DIV.A.B.self = entry.DIV.DIV.A.self.querySelector(entry.DIV.DIV.A.B.selector);
    }
    if (ok) {
        ok = entry.DIV.DIV.A.SPAN.self = entry.DIV.DIV.A.self.querySelector(entry.DIV.DIV.A.SPAN.selector);
    }

    // if still ok, all neccessary elements are found. 
    if (ok) {
        // the location of the given entry.
        entry.location = window.location;
        // the href of the entry.
        entry.DIV.DIV.A.href = entry.DIV.DIV.A.self.href;
        // the title of the entry (big).
        entry.DIV.DIV.A.B.textContent = entry.DIV.DIV.A.B.self.textContent;
        // the subtitle of the entry.
        entry.DIV.DIV.A.SPAN.textContent = entry.DIV.DIV.A.SPAN.self.textContent;
        
        entry.META.url = entry.location.href;
        entry.META.target = entry.DIV.DIV.A.href;
        entry.META.title = entry.DIV.DIV.A.B.textContent;
        entry.META.subtitle = entry.DIV.DIV.A.SPAN.textContent;
    }

    return ok;
}

/// What happens when a message is sent (and retrieved here).
/// background.js sends messages when the context menu item is clicked.
/// saves the "GLOBAL_ENTRY" to the entries that are hidden.
/// saves the "GLOBAL_OVERVIEW_ENTRY" to the entries that are hidden.
chrome.runtime.onMessage.addListener(function (message) {
    logger.logDebug("Message:", message.name);
    switch (message.name) {
        case 'c0savetvblocker-main-menu-item-clicked':
            if (GLOBAL_OK) {
                hide(GLOBAL_ENTRY);
            }
            if (GLOBAL_OVERVIEW_OK) {
                hide(GLOBAL_OVERVIEW_ENTRY);
            }
        break;

        case 'c0savetvblocker-test-menu-item-clicked':
            var ul = document.querySelector(new SAVETV().UL.selector);
            var lis = ul.querySelectorAll("li");
            var len = lis.length;
            var entries = [];
            for (var i = 0; i < len; i++) {
                var entry = null;
                entry = Object.assign({}, new SAVETV());
                entry.UL.self = ul;
                entry.UL.LI.self = lis[i];
                getDeeperNestedElements(entry);
                logger.logDebug(entry.META.title);
                entries.push(entry);
            }
            entries[0].META.title = "test";
            logger.logDebug(entries);
            hideMany(entries);
        break;

        case 'c0savetvblocker-context-menu-item-updated': 
            hideAllSavedEntriesThatEqualTitle();
        break;

        case 'c0savetvblocker-runtime-on-installed-clear':
            storage.getSpaceOfAllAsync(function(spaceInBytes) {
                if (spaceInBytes === 0) {
                    storage.setNewArray("entries");
                }
            });
    }
    

    // TODO: Here we need to add the entry to the list of hidden entries!
    // TODO: STORAGE
});

function hide(entry) {
    logger.logDebug("Hide(Entry):", entry.META.title);
    
    storage.getOneAsync("entries", function(items) {
        var entries = items.entries;
        var existingEntry = entries.find(function(e) { 
            return (e != null && e.title == entry.META.title); 
        });
        
        var entryAlreadyHidden = existingEntry != null;
        logger.logDebug("Hide(Entry) - Already Hidden:", entryAlreadyHidden);
        if (!entryAlreadyHidden) {
            entries.push(entry.META);
            storage.set({"entries": entries});

            hideAllSavedEntriesThatEqualTitle();
            hideAllSavedEntriesThatEqualTitleOverview();
        }
        
    });     
}

function hideMany(entriesToHide) {
    logger.logDebug("Hide(Entries):", entriesToHide.length);

    storage.getOneAsync("entries", function(items) {
        var entries = items.entries;
        var len = entriesToHide.length;
        for (var i = 0; i < len; i++) {
            var entry = entriesToHide[i];
            logger.logDebug("Hide(Entry):", entry.META.title);

            var existingEntry = entries.find(function(e) { 
                return (e != null && e.title == entry.META.title); 
            });
            
            var entryAlreadyHidden = existingEntry != null;
            logger.logDebug("Hide(Entry) - Already Hidden:", entryAlreadyHidden);
            if (!entryAlreadyHidden) {
                entries.push(entry.META);
            }
        }
        storage.set({"entries": entries});    
        hideAllSavedEntriesThatEqualTitle();   
        hideAllSavedEntriesThatEqualTitleOverview();     
    });     
}

// OBSOLETE, see hideAllSavedEntriesThatEqualTitle
function hideAllSavedEntriesThatContainTitle() {
    logger.logDebug("hideAllSavedEntriesThatContainTitle begins...");
    storage.getOneAsync("entries", function(items) {
        var liCollection = document.querySelectorAll(new SAVETV().UL.selector + " " + new SAVETV().UL.LI.selector);
        var len1 = items.entries.length;
        var len2 = liCollection.length;
        for (var i = 0; i < len1; i++) {
            var entry = items.entries[i];
            for (var j = 0; j < len2; j++) {
                var li = liCollection[j];
                if (li.textContent.indexOf(entry.title) > -1) {
                    var p = document.createElement("p");
                    p.innerHTML = "<b>" + entry.title + "</b> " + entry.subtitle;
                    li.parentNode.replaceChild(p, li);
                }
            }
        }
    });
}

function hideAllSavedEntriesThatEqualTitle() {
    logger.logDebug("hideAllSavedEntriesThatEqualTitle begins...");

    // First hide all entries of the "old" set _1 -> Because of QUOTA_BYTES_PER_ITEM.
    // TODO: WARNING: NEEDS TO BE REFACTORED
    storage.getOneAsync("old_entries_1", function(items) {
        var liCollection = document.querySelectorAll(new SAVETV().UL.selector + " " + new SAVETV().UL.LI.selector);
        var len1 = items.old_entries_1.length;
        var len2 = liCollection.length;
        for (var i = 0; i < len1; i++) {
            var entry = items.old_entries_1[i];
            for (var j = 0; j < len2; j++) {
                var li = liCollection[j];
                // we need to test against the textContent of the <b> insided the <p> inside the second <div> inside the <a> of the li.
                var li_a = li.querySelector(new SAVETV().UL.LI.A.selector);
                var li_a_div2 = li_a.querySelector(new SAVETV().UL.LI.A.DIV2.selector);
                var li_a_div2_p = li_a_div2.querySelector(new SAVETV().UL.LI.A.DIV2.P.selector);
                var li_a_div2_p_b =  li_a_div2_p.querySelector(new SAVETV().UL.LI.A.DIV2.P.B.selector);
                var title = li_a_div2_p_b.textContent;
                if (title === entry.title) {
                    var p = document.createElement("p");
                    p.innerHTML = "<b>" + entry.title + "</b> " + entry.subtitle;
                    li.parentNode.replaceChild(p, li);
                }
            }
        }
    });

    // Then hide all entries of the "active" set -> Because of QUOTA_BYTES_PER_ITEM.
    // TODO: WARNING: NEEDS TO BE REFACTORED
    storage.getOneAsync("entries", function(items) {
        var liCollection = document.querySelectorAll(new SAVETV().UL.selector + " " + new SAVETV().UL.LI.selector);
        var len1 = items.entries.length;
        var len2 = liCollection.length;
        for (var i = 0; i < len1; i++) {
            var entry = items.entries[i];
            for (var j = 0; j < len2; j++) {
                var li = liCollection[j];
                // we need to test against the textContent of the <b> insided the <p> inside the second <div> inside the <a> of the li.
                var li_a = li.querySelector(new SAVETV().UL.LI.A.selector);
                var li_a_div2 = li_a.querySelector(new SAVETV().UL.LI.A.DIV2.selector);
                var li_a_div2_p = li_a_div2.querySelector(new SAVETV().UL.LI.A.DIV2.P.selector);
                var li_a_div2_p_b =  li_a_div2_p.querySelector(new SAVETV().UL.LI.A.DIV2.P.B.selector);
                var title = li_a_div2_p_b.textContent;
                if (title === entry.title) {
                    var p = document.createElement("p");
                    p.innerHTML = "<b>" + entry.title + "</b> " + entry.subtitle;
                    li.parentNode.replaceChild(p, li);
                }
            }
        }
    });
}

function hideAllSavedEntriesThatEqualTitleOverview() {
    logger.logDebug("hideAllSavedEntriesThatEqualTitleOverview begins...");
    
    // First hide all entries of the "old" set _1 -> Because of QUOTA_BYTES_PER_ITEM.
    // TODO: WARNING: NEEDS TO BE REFACTORED
    storage.getOneAsync("old_entries_1", function(items) {
        var divCollection = document.querySelectorAll(new SAVETV_OVERVIEW().DIV.selector + " " + new SAVETV_OVERVIEW().DIV.DIV.selector);
        var len1 = items["old_entries_1"].length;
        var len2 = divCollection.length;
        for (var i = 0; i < len1; i++) {
            var entry = items["old_entries_1"][i];
            for (var j = 0; j < len2; j++) {
                var div = divCollection[j];
                // we need to test against the textContent of the <b> insided the <a> of the div.
                var div_a = div.querySelector(new SAVETV_OVERVIEW().DIV.DIV.A.selector);
                var div_a_b = div_a.querySelector(new SAVETV_OVERVIEW().DIV.DIV.A.B.selector);
                var title = div_a_b.textContent;
                if (title === entry.title) {
                    var p = document.createElement("p");
                    p.style.fontSize = "xx-small";
                    p.innerHTML = "<b>" + entry.title + "</b>";
                    div.parentNode.replaceChild(p, div);
                }
            }
        }
    });

    // Then hide all entries of the "active" set -> Because of QUOTA_BYTES_PER_ITEM.
    // TODO: WARNING: NEEDS TO BE REFACTORED
    storage.getOneAsync("entries", function(items) {
        var divCollection = document.querySelectorAll(new SAVETV_OVERVIEW().DIV.selector + " " + new SAVETV_OVERVIEW().DIV.DIV.selector);
        var len1 = items.entries.length;
        var len2 = divCollection.length;
        for (var i = 0; i < len1; i++) {
            var entry = items.entries[i];
            for (var j = 0; j < len2; j++) {
                var div = divCollection[j];
                // we need to test against the textContent of the <b> insided the <a> of the div.
                var div_a = div.querySelector(new SAVETV_OVERVIEW().DIV.DIV.A.selector);
                var div_a_b = div_a.querySelector(new SAVETV_OVERVIEW().DIV.DIV.A.B.selector);
                var title = div_a_b.textContent;
                if (title === entry.title) {
                    var p = document.createElement("p");
                    p.style.fontSize = "xx-small";
                    p.innerHTML = "<b>" + entry.title + "</b>";
                    div.parentNode.replaceChild(p, div);
                }
            }
        }
    });
}

/// Adding a MutationObserver on Document loading.
/// This way, whenever the UL (with entries) changes, they get checked.
/// or whenever the DIV (with overview) changes, they get checked.
document.addEventListener('DOMContentLoaded', function() { 
    logger.logTrace("Event: DOMContentLoaded (MutationObserver registration) started.");

    // Observation of list:
    var observer1 = new MutationObserver(function(mutations) {
        logger.logDebug("List Mutations Observed, starts hiding");
        hideAllSavedEntriesThatEqualTitle();   
    });

    // Observation of overview:
    var observer2 = new MutationObserver(function(mutations) {
        logger.logDebug("Overview Mutations Observed, starts hiding");
        hideAllSavedEntriesThatEqualTitleOverview();   
    });
    
    var config = { attributes: false, childList: true, characterData: false };
    var target1 = document.querySelector(new SAVETV().UL.selector);
    var target2 = document.querySelector(new SAVETV_OVERVIEW().DIV.selector);

    if (target1 != null) { observer1.observe(target1, config); }
    if (target2 != null) { observer2.observe(target2, config); }
    
});

logger.logAlways("Loaded Completely");
