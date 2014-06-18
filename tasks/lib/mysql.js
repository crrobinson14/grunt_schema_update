/**
 * @file Fake MySQL driver for CI testing
 */

'use strict';

exports.init = function(grunt, options) {
    var exports = {},
        currentVersion = 0;

    /**
     * Connect to the MySQL server.
     * @returns {boolean} true if the connection was successful
     */
    exports.connect = function() {
        grunt.log.writeln('FakeMySQL: Simulating connection...');
        return true;
    };

    /**
     * Connect to the MySQL server.
     * @returns {boolean} true if the connection was successful
     */
    exports.getVersion = function() {
        grunt.log.writeln('FakeMySQL: Simulating connection...');
        return true;
    };

    return exports;
};
