/**
 * @file Fake MySQL driver for CI testing
 */

'use strict';

exports.init = function(grunt, options) {
    var exports = {},
        currentVersion = 1;

    /**
     * Connect to the server.
     * @returns {boolean} true if the connection was successful
     */
    exports.connect = function() {
        grunt.log.writeln('FakeMySQL: Simulating connection...');
        return true;
    };

    /**
     * Get the current version number from the server.
     * @returns {Number} The current version number
     */
    exports.getVersion = function() {
        grunt.log.writeln('FakeMySQL: Simulating version 1...');

        return currentVersion;
    };

    /**
     * Process an update script, then set the version number in the database.
     * @param {Number} version - the version this update will establish
     * @params {Number} file - The file containing the update
     * @returns {boolean} true if the update was successful
     */
    exports.processUpdate = function(version, filename) {
        grunt.verbose.writeln('FakeMySQL: Simulating update to version ' + version +
                          ' from ' + filename + (options.useTransaction
                              ? ', use transaction...'
                              : ', no transaction...'));

        currentVersion = version;
        return true;
    };

    return exports;
};
