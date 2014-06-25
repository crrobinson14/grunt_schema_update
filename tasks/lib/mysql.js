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
        var deferred = Q.defer(),
            // TODO: Gah, didn't plan this out very well...
            d2, d2_result;

        if (grunt.option('reload-schema')) {
            d2_result = exports.create();
        } else {
            d2 = Q.defer();
            d2.resolve();
            d2_result = d2.promise;
        }

        d2_result.then(function() {
            grunt.log.writeln('MySQL: Connecting to server...');
            connection = mysql.createConnection(options.connection);
            connection.connect(function(err) {
                if (err) {
                    grunt.fatal('Unable to connect to database server: ', err);

                    deferred.reject();
                    return;
                }

                deferred.resolve();
            });
        });

        return deferred.promise;
    };

    /**
     * Execute a query.
     * @returns {promise} A promise that will be resolved/rejected with the result of the query
     */
    exports.query = function(query) {
        var deferred = Q.defer();

        grunt.verbose.writeln('Executing query: ' + query);

        connection.query(query, function(err, rows) {
            if (err) {
                grunt.log.error(err.message);
                deferred.reject();
                return;
            }

            deferred.resolve(rows);
        });

        return deferred.promise;
    };

    function createSchema() {
        grunt.log.writeln('MySQL: Creating the database...');

        var promise_chain = Q.fcall(function(){}),
            queries = [
                    'DROP DATABASE IF EXISTS `' + options.create.createDB + '`',
                    'CREATE DATABASE `' + options.create.createDB + '`',
                    'GRANT ALL ON `' + options.create.createDB + '`.* ' +
                    'TO \'' + options.create.createUser + '\'' +
                    '@\'' + options.create.createHost + '\'' +
                    ' IDENTIFIED BY \'' + options.create.createPass + '\'',
                    'USE `' + options.create.createDB + '`',
                    'CREATE TABLE schema_version (version int NOT NULL)',
                    'INSERT INTO schema_version VALUES (0)'
            ];

        queries.map(function(query) {
            // TODO: We use this pattern in two spots, refactor?
            var promise_link = function() {
                var deferred = Q.defer();

                exports.query(query).then(function(result) {
                    deferred.resolve(result);
                });

                return deferred.promise;
            };

            promise_chain = promise_chain.then(promise_link);
        });

        return promise_chain;
    }

    /**
     * Create the required database
     * @returns {promise} A promise that will be resolved/rejected when the connection succeeds
     */
    exports.create = function() {
        var deferred = Q.defer();

        grunt.log.writeln('MySQL: Connecting to server...');

        // TODO: Use fcall?
        connection = mysql.createConnection(options.create.connection);
        connection.connect(function(err) {
            if (err) {
                grunt.fatal('Unable to connect to database server: ', err);

                deferred.reject();
                return;
            }

            createSchema().then(function() {
                connection.destroy();
                connection = null;

                deferred.resolve();
            }).catch(function() {
                deferred.reject();
            });
        });

        return deferred.promise;
    };

    /**
     * Get the current version number from the server.
     * @returns {promise} A promise that will be resolved with the version number once it is obtained
     */
    exports.getVersion = function() {
        var deferred = Q.defer();

        // TODO: Should this aspect be refactored into the base plugin?
        if (grunt.option('reload-schema')) {
            grunt.log.subhead('MySQL: Force reload schema');
            deferred.resolve(0);
        } else {
            connection.query(options.queryGetVersion, function(err, rows) {
                if (err) {
                    grunt.log.error(err.message);
                    deferred.reject();
                    return;
                }

                grunt.log.writeln('MySQL: Found version ' + rows[0].version);
                deferred.resolve(rows[0].version);
            });
        }

        return deferred.promise;
    };

    /**
     * Process an update script, then set the version number in the database.
     * @param {Object} entry - The entry to process
     * @returns {promise} A promise that will be resolved/rejected when the update completes
     */
    exports.processUpdate = function(entry) {
        var deferred = Q.defer(),
            content = fs.readFileSync(entry.filename, 'utf8');

        grunt.verbose.writeln('MySQL: Updating to version ' + entry.version + ' from ' + entry.filename);

        // TODO: Chain promises?
        // NOTE: We used to start a transaction here, but since most schema updates execute commands that perform an
        // implicit commit...
        connection.query(content, function(err) {
            if (err) {
                grunt.fatal(err.message);
                deferred.reject();
                return;
            }

            connection.query(options.querySetVersion.replace('{version}', entry.version), function(err) {
                if (err) {
                    grunt.fatal(err.message);
                    deferred.reject();
                    return;
                }

                deferred.resolve(entry.version);
            });
        });

        return deferred.promise;
    };

    return exports;
};
