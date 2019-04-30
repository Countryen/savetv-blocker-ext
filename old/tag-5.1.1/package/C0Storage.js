// C0 SaveTV Blocker - Copyright (c) 2017 Countryen
// C0Storage.js - Useful functions for handling data storage
// See: https://developer.chrome.com/extensions/storage

var C0STORAGE_TYPE = {
    /// DO NOT USE!
    MANAGED: "managed",
    /// Local storage
    LOCAL: "local",
    /// Synced storage (cloud). If deactivated same as local.
    SYNC: "sync"
};
Object.freeze(C0STORAGE_TYPE);

/**
 * Class.
 * Storage handling for save/load of data.
 * Most operations are async (see callbacks).
 * @param {string} type see C0STORAGE_TYPE
 */
function C0Storage(type) {
    /**
     * The used storage (sync, local, managed).
     */
    this.store = null;
    /**
     * string-array for the log of all actions.
     */
    this.log = [];
    this.type = type;
    
    /**
     * Constructor.
     */
    {
        switch (this.type) {
            case "local":
                this.store = chrome.storage.local;
                break;
            case "sync":
                this.store = chrome.storage.sync;
                break;
            case "managed":
                throw "C0STORAGE_TYPE 'managed' not allowed!"

            default:
                throw "C0STORAGE_TYPE '" + this.type + "' unknown!"
        }
    }

    /// ******************************************************************************************** ///

    this.set = function(keyValuePair) {
        this.store.set(keyValuePair);
        this.log.push("C0Storage[" + this.type + "].set(" + keyValuePair.toString() + ")");
    };

    this.setNewArray = function(name) {
        var o = {};
        o[name] = [];
        this.store.set(o);
        this.log.push("C0Storage[" + this.type + "].setNewArray(" + name + ")");
    };

    this.setNewObject = function(name) {
        var o = {};
        o[name] = {};
        this.store.set(o);
        this.log.push("C0Storage[" + this.type + "].setNewArray(" + name + ")");
    };

    this.setNewValue = function(name) {
        var o = {};
        o[name] = null;
        this.store.set(o);
        this.log.push("C0Storage[" + this.type + "].setNewArray(" + name + ")");
    };

    /// ******************************************************************************************** ///

    this.getAllAsync = function(callback) {
        // fallback
        callback = callback || function(items) { 
            var all = items;
            console.log("C0Storage[" + this.type + "].getAllAsync() FALLBACK: " + all);
        };

        this.store.get(null, callback);
        this.log.push("C0Storage[" + this.type + "].getAllAsync() CALLBACKED");
    };

    this.getOneAsync = function(name, callback) {
        // fallback
        callback = callback || function(items, callback) { 
            var one = items[name];
            console.log("C0Storage[" + this.type + "].getOneAsync() FALLBACK: " + one);
        };

        this.store.get(name, callback);
        this.log.push("C0Storage[" + this.type + "].getOneAsync(" + name + ") CALLBACKED");
    };

    this.getManyAsync = function(nameArray, callback) {
        // fallback
        callback = callback || function(items) { 
            var many = [];
            var len = nameArray.length;
            for (var i = 0; i < len; i++) {
                many.push(items[nameArray[i]]);
            }
            console.log("C0Storage[" + this.type + "].getManyAsync() FALLBACK: " + many);
        };

        this.store.get(nameArray, callback);
        this.log.push("C0Storage[" + this.type + "].getManyAsync(" + nameArray.toString() + ") CALLBACKED");
    };

    /// ******************************************************************************************** ///

    this.removeOne = function(name) {
        this.store.remove(name);
        this.log.push("C0Storage[" + this.type + "].removeOne(" + name + ")");
    };

    this.removeMany = function(nameArray) {
        this.store.remove(nameArray);
        this.log.push("C0Storage[" + this.type + "].removeMany(" + nameArray.toString() + ")");
    };

    /// ******************************************************************************************** ///

    this.clearStore = function() {
        this.store.clear();
        this.log.push("C0Storage[" + this.type + "].clearStore()");
    };

    /// ******************************************************************************************** ///

    this.getSpaceOfAllAsync = function(callback) {
        // fallback
        callback = callback || function(space) { 
            console.log("C0Storage[" + this.type + "].getSpaceOfAllAsync() FALLBACK: " + space);
        };

        this.store.getBytesInUse(null, callback);
        this.log.push("C0Storage[" + this.type + "].getSpaceOfAllAsync() CALLBACKED");
    };

    this.getSpaceOfOneAsync = function(name, callback) {
        // fallback
        callback = callback || function(space) { 
            console.log("C0Storage[" + this.type + "].getSpaceOfOneAsync() FALLBACK: " + space);
        };

        this.store.getBytesInUse(name, callback);
        this.log.push("C0Storage[" + this.type + "].getSpaceOfOneAsync(" + name + ") CALLBACKED");
    };

    this.getSpaceOfManyAsync = function(nameArray, callback) {
        // fallback
        callback = callback || function(space) { 
            console.log("C0Storage[" + this.type + "].getSpaceOfManyAsync() FALLBACK: " + space);
        };

        this.store.getBytesInUse(nameArray, callback);
        this.log.push("C0Storage[" + this.type + "].getSpaceOfManyAsync(" + nameArray +") CALLBACKED");
    };

    /// ******************************************************************************************** ///
    /**
     * Helper function.
     * Calculates the biggest unit (e.g. from 1000B it's 1KB) from a given amount of Bytes.
     * @returns {object} Structure holding the "amount" and the "unit".
     * @example { "amount": 1, "unit": "KB" }
     */
    this.convertBytesToBiggestUnit = function(bytes) {
        var amount = 0;
        var unit = "B";

        var kb = 1000;
        var mb = 1000 * kb;
        var gb = 1000 * mb;
        var tb = 1000 * tb;

        if (bytes < kb) {
            amount = bytes;
            unit = "B";
        } else if (bytes < mb) {
            amount = bytes / kb;
            unit = "KB";
        } else if (bytes < gb) {
            amount = bytes / mb;
            unit = "MB";
        } else if (bytes < tb) {
            amount = bytes / gb;
            unit = "GB";
        } else {
            amount = bytes / tb;
            unit = "TB";
        }

        return {"amount": amount, "unit": unit};
    };

}

