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
        var success = true,
            drivers = ['simulation', 'mysql'],
            db = null,
            currentVersion = 0,
            done = this.async(),
            self = this,
            // Merge task-specific and/or target-specific options with these defaults.
            options = this.options({
                driver: 'simulation',
                connection: {
                    host: 'localhost',
                    user: '',
                    pass: ''
                },
                queryGetVersion: 'SELECT version FROM schema_version',
                querySetVersion: 'REPLACE INTO schema_version (version) VALUES ({version})',
                queryVersionSafe: true,
                useTransaction: true,
                pretend: true
            });

        grunt.verbose.writeflags(options, 'Options');

        if (drivers.indexOf(options.driver) === -1) {
            grunt.log.error('Invalid driver. Supported values: ', grunt.log.wordlist(drivers));
            return false;
        }

        grunt.verbose.writeln('Loading driver ' + options.driver);
        db = require('./lib/' + options.driver).init(grunt, options);

        // TODO: We could avoid callback-hell here with Q cleverness, but it's not really a big deal and this is
        // easier to debug...
        db.connect().then(function() {
            return db.getVersion();
        }).then(function(version) {
            var promise_chain = Q.fcall(function(){});

            currentVersion = version;

            grunt.log.writeln('Found version ' + currentVersion);
            grunt.log.subhead((options.pretend) ? 'Would update:' : 'Updating:');

            fileUtils.filesToProcess(self.filesSrc, currentVersion).map(function(entry) {
                var promise_link = function() {
                    var deferred = Q.defer();

                    grunt.log.writeln(fileUtils.formatEntry(entry));

                    if (options.pretend) {
                        deferred.resolve();
                    } else {
                        db.processUpdate(entry, function(result) {
                            console.log('Done processing', result);
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
            done();
        });

        return success;
    });
};
