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
        connection,
        mysql = require('mysql');

    /**
     * Connect to the server.
     * @returns {Promise} A promise that will be resolved/rejected when the connection succeeds
     */
    exports.connect = function() {
        grunt.log.writeln('MySQL: Connecting to server...');
        connection = mysql.createConnection(options.connection);
        connection.connect(function(err) {
            grunt.fatal('Unable to connect to database server: ');
            console.log(err);
            return false;
        });

        if (!connection) {
            grunt.fatal('Unable to connect to database server.');
            return false;
        }

        grunt.log.ok('Current DB version: ');
        return true;
    };

    /**
     * Get the current version number from the server.
     * @returns {Promise} A promise that will be resolved with the version number once it is obtained
     */
    exports.getVersion = function() {
        grunt.log.writeln('MySQL: Getting current version...');

        connection.query('SELECT 1', function(err, rows) {
            // connected! (unless `err` is set)
        });

        return currentVersion;
    };

    /**
     * Process an update script, then set the version number in the database.
     * @param {Number} version - the version this update will establish
     * @params {Number} file - The file containing the update
     * @returns {Promise} A promise that will be resolved/rejected when the update completes
     */
    exports.processUpdate = function(version, filename) {
        grunt.verbose.writeln('MySQL: Simulating update to version ' + version +
                              ' from ' + filename + (options.useTransaction
            ? ', use transaction...'
            : ', no transaction...'));

        currentVersion = version;
        return true;
    };

    return exports;
};
