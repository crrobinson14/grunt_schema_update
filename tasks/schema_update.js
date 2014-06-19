/*
 * grunt-schema-update
 * https://github.com/crrobinson14/grunt_schema_update
 *
 * Copyright (c) 2014 Chad Robinson
 * Licensed under the MIT license. See LICENSE-MIT.
 */

'use strict';

var fileUtils = require('./lib/files'),
    Q = require('q');

module.exports = function(grunt) {
    grunt.registerMultiTask('schema_update', 'Database schema update utility.', function() {
        var drivers = ['simulation', 'mysql'],
            db = null,
            currentVersion = 0,
            done = this.async(),
            self = this,
            options = this.options({
                driver: 'simulation',
                connection: {
                    host: 'localhost',
                    user: '',
                    pass: '',
                    database: 'test',
                    multipleStatements: true
                },
                queryGetVersion: 'SELECT version FROM schema_version',
                querySetVersion: 'UPDATE schema_version SET version={version}'
            });

        grunt.verbose.writeflags(options, 'Options');
        if (drivers.indexOf(options.driver) === -1) {
            grunt.log.error('Invalid driver. Supported values: ', grunt.log.wordlist(drivers));
            return false;
        }

        grunt.verbose.writeln('Loading driver ' + options.driver);
        db = require('./lib/' + options.driver).init(grunt, options);

        db.connect().then(function() {
            return db.getVersion();
        }).then(function(version) {
            var promise_chain = Q.fcall(function(){});

            currentVersion = version;

            grunt.log.subhead(grunt.option('pretend') ? 'Would update:' : 'Updating:');

            fileUtils.filesToProcess(self.filesSrc, currentVersion).map(function(entry) {
                var promise_link = function() {
                    var deferred = Q.defer();

                    grunt.log.writeln(fileUtils.formatEntry(entry));

                    if (grunt.option('pretend')) {
                        deferred.resolve();
                    } else {
                        db.processUpdate(entry).then(function(result) {
                            currentVersion = entry.version;
                            deferred.resolve(result);
                        });
                    }

                    return deferred.promise;
                };

                // add the link onto the chain
                promise_chain = promise_chain.then(promise_link);
            });

            return promise_chain;
        }).then(function() {
            grunt.log.ok('Final version: ' + currentVersion);
        }).catch(function() {
            grunt.log.error('Update failed.');
        }).finally(function() {
            done();
        });
    });
};
