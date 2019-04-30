// C0 SaveTV Blocker - Copyright (c) 2017 Countryen
// C0Logger.js - General Logging and Alerting.

var C0LOGGER_LEVEL_FLAG = {
    ALWAYS: 0,
    ERROR: 1,
    WARNING: 2,
    INFO: 4,
    TRACE: 8,
    DEBUG: 16
};
Object.freeze(C0LOGGER_LEVEL_FLAG);

/**
 * Class.
 * General Logging and Alerting.
 * Sends the logging to a defined output-stream of function(...texts).
 * @param {int} level see C0LOGGER_LEVEL_FLAG
 * @param {function} out which output-stream-function is to be used.
 */
function C0Logger(level, out) {
    /**
     * The used output-stream-function (eg. console.log).
     */
    this.out = null;

    /**
     * The used level for logging (eg. C0LOGGER_LEVEL_FLAG.INFO).
     */
    this.level = null;

    /**
     * Constructor.
     */
    {
        this.out = out;
        this.level = level;
    }

    /// ******************************************************************************************** ///

    this.log = function(level, ...texts) {
        if (level <= this.level) {
            this.out(new Date().toLocaleString(), ":", "C0 SaveTV Blocker", ...texts);
        }
     };

    /// ******************************************************************************************** ///

    this.logAlways = function(...texts) {
        this.log(C0LOGGER_LEVEL_FLAG.ALWAYS, ...texts);
    };

    this.logError = function(...texts) { 
        this.log(C0LOGGER_LEVEL_FLAG.ERROR, ...texts);
    };

    this.logWarning = function(...texts) { 
        this.log(C0LOGGER_LEVEL_FLAG.WARNING, ...texts);
    };

    this.logInfo = function(...texts) { 
        this.log(C0LOGGER_LEVEL_FLAG.INFO, ...texts);
    };

    this.logTrace = function(...texts) { 
        this.log(C0LOGGER_LEVEL_FLAG.TRACE, ...texts);
    };

    this.logDebug = function(...texts) { 
        this.log(C0LOGGER_LEVEL_FLAG.DEBUG, ...texts);
    };
}
