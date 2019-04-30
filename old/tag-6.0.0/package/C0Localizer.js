// C0 SaveTV Blocker - Copyright (c) 2017 Countryen
// C0Localizer.js - General i18n and l10n features.
// See: https://developer.chrome.com/apps/i18n

/**
 * Class.
 * General i18n and l10n.
 * Uses the chrome.i18n feature (see _locales-folder).
 * Chrome internally uses the messages via mask: "__MSG_<ID>__" 
 */
function C0Localizer() {
    /** Function to get the localized string/literal for the given l10n-ID.
    * @param {string} id ID of the literal you want to get.
    */
    this.localize = function (id) {
        return chrome.i18n.getMessage(id);
    };

    /** Function to localize a full HTML-File using the given document.
     * Searches the HTML for elements with attribute "data-l10n-id".
    * @param {object} doc Document of the HTML-file to search (e.g. window.document).
    */
    this.localizeHTML = function(doc) {
        var elementsToBeLocalized = doc.body.querySelectorAll("*[data-l10n-id]");
        var len = elementsToBeLocalized.length;
        var element = null;
        var id = "";
        for (var i = 0; i < len; i++) {
            element = elementsToBeLocalized[i];
            id = element.getAttribute("data-l10n-id");
            element.textContent = this.localize(id);
        }
    }; 
}