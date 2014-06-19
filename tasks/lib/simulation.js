/*
 * grunt-schema-update
 * https://github.com/crrobinson14/grunt_schema_update
 *
 * Copyright (c) 2014 Chad Robinson
 * Licensed under the MIT license. See LICENSE-MIT.
 */

'use strict';

var Q = require('q');

exports.init = function(grunt, options) {
    var exports = {},
        currentVersion = 1;

    /**
     * Connect to the server.
     * @returns {Promise} A promise that will be resolved/rejected when the connection succeeds
     */
    exports.connect = function() {
        var deferred = Q.defer();

        grunt.log.writeln('FakeMySQL: Simulating connection...');
        deferred.resolve();

        return deferred.promise;
    };

    /**
     * Get the current version number from the server.
     * @returns {Promise} A promise that will be resolved with the version number once it is obtained
     */
    exports.getVersion = function() {
        var deferred = Q.defer();

        grunt.log.writeln('FakeMySQL: Simulating version 1...');
        deferred.resolve(1);

        return deferred.promise;
    };

    /**
     * Process an update script, then set the version number in the database.
     * @param {Number} version - the version this update will establish
     * @params {Number} file - The file containing the update
     * @returns {Promise} A promise that will be resolved/rejected when the update completes
     */
    exports.processUpdate = function(version, filename) {
        var deferred = Q.defer();

        grunt.verbose.writeln('FakeMySQL: Simulating update to version ' + version +
                          ' from ' + filename + (options.useTransaction
                              ? ', use transaction...'
                              : ', no transaction...'));

        currentVersion = version;
        deferred.resolve(version);

        return deferred.promise;
    };

    return exports;
};
