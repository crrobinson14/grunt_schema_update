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
        connection,
        mysql = require('mysql');

    /**
     * Connect to the server.
     * @returns {promise} A promise that will be resolved/rejected when the connection succeeds
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
     * @returns {promise} A promise that will be resolved with the version number once it is obtained
     */
    exports.getVersion = function() {
        var deferred = Q.defer();

        grunt.log.writeln('MySQL: Getting current version...');

        connection.query(options.queryGetVersion, function(err, rows) {
            if (err) {
                grunt.log.writeln(err.code);
                deferred.reject();
            }

            deferred.resolve(rows[0].version);
        });

        return deferred.promise;
    };

    /**
     * Process an update script, then set the version number in the database.
     * @param {Object} entry - The entry to process
     * @returns {promise} A promise that will be resolved/rejected when the update completes
     */
    exports.processUpdate = function(entry) {
        var deferred = Q.defer();

        grunt.verbose.writeln('MySQL: Simulating update to version ' + entry.version + ' from ' + entry.filename);

        var content = fs.readFileSync(entry.filename, 'utf8');

        // TODO: Chain promises?
        connection.beginTransaction(function(err) {
            if (err) {
                grunt.log.error(err);
                deferred.reject();
                return;
            }

            connection.query(content, function(err) {
                if (err) {
                    connection.rollback();
                    deferred.reject();
                    return;
                }

                connection.commit(function(err) {
                    if (err) {
                        connection.rollback();
                        deferred.reject();
                        return;
                    }

                    deferred.resolve(entry.version);
                });
            });
        });

        return deferred.promise;
    };

    return exports;
};
