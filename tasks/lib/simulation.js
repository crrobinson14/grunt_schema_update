/*
 * grunt-schema-update
 * https://github.com/crrobinson14/grunt_schema_update
 *
 * Copyright (c) 2014 Chad Robinson
 * Licensed under the MIT license. See LICENSE-MIT.
 */

'use strict';

var Q = require('q'),
    fs = require('fs');

exports.init = function(grunt, options) {
    var exports = {},
        currentVersion = 1;

    /**
     * Connect to the server.
     * @returns {promise} A promise that will be resolved/rejected when the connection succeeds
     */
    exports.connect = function() {
        var deferred = Q.defer();

        grunt.log.writeln('FakeMySQL: Simulating connection...');
        deferred.resolve();

        return deferred.promise;
    };

    /**
     * Get the current version number from the server.
     * @returns {promise} A promise that will be resolved with the version number once it is obtained
     */
    exports.getVersion = function() {
        var deferred = Q.defer();

        grunt.log.writeln('FakeMySQL: Simulating version 1...');
        deferred.resolve(1);

        return deferred.promise;
    };

    /**
     * Process an update script, then set the version number in the database.
     * @param {Object} entry - The entry to process
     * @returns {promise} A promise that will be resolved/rejected when the update completes
     */
    exports.processUpdate = function(entry) {
        var deferred = Q.defer();

        grunt.verbose.writeln('FakeMySQL: Simulating update to version ' + entry.version + ' from ' + entry.filename);

        // We don't really need this, we're just proving that the file is readable
        var content = fs.readFileSync(entry.filename, 'utf8');

        currentVersion = entry.version;
        deferred.resolve(entry.version);

        return deferred.promise;
    };

    return exports;
};
