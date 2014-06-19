/*
 * grunt-schema-update
 * https://github.com/crrobinson14/grunt_schema_update
 *
 * Copyright (c) 2014 Chad Robinson
 * Licensed under the MIT license. See LICENSE-MIT.
 */

'use strict';

var fileUtils = require('./lib/files');

module.exports = function(grunt) {
    grunt.registerMultiTask('schema_update', 'Database schema update utility.', function() {
        // Merge task-specific and/or target-specific options with these defaults.
        var currentVersion = 0,
            success = true,
            drivers = ['simulation', 'mysql'],
            filesToProcess,
            db = null,
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
        if (!db.connect()) {
            return false;
        }

        currentVersion = db.getVersion();

        grunt.log.writeln('Found version ' + currentVersion);

        filesToProcess = fileUtils.filesToProcess(this.filesSrc, currentVersion);
        if (options.pretend) {
            grunt.log.subhead('Would update:');
            filesToProcess.map(function(entry) {
                grunt.log.writeln(fileUtils.formatEntry(entry));
            });
        } else {
            grunt.log.subhead('Updating:');
            filesToProcess.map(function(entry) {
                if (success) {
                    grunt.log.writeln(fileUtils.formatEntry(entry));
                    success = db.processUpdate(entry.version, entry.filename);

                    if (success) {
                        currentVersion = entry.version;
                    }
                }
            });
        }

        if (success) {
            grunt.log.ok('Final version: ' + currentVersion);
        } else {
            grunt.log.error('Update failed.');
        }

        /*
              grunt.log.writeln('Updating DB.');

              // Default and user-supplied options
              var options = this.options({
                                         });

              console.log(options );

              switch (options.driver) {
                  case 'mysql':
                      var mysql = require('mysql'),
                          connection = mysql.createConnection({
                                                                  host: options.host,
                                                                  user: options.user,
                                                                  password: options.pass
                                                              }),
                          currentVersion = 0;

                      if (!connection) {
                          grunt.fatal('Unable to connect to database server.');
                          return false;
                      }

                      connection.connect(function(err) {
                          grunt.fatal('Unable to connect to database server: ');
                          console.log(err);
                          return false;
                      });

                      if (!connection) {
                          grunt.fatal('Unable to connect to database server.');
                          return false;
                      }

                      connection.query(options.versionQuery, function(err, rows, fields) {
                          if (err) throw err;

                          grunt.log.ok('Current DB version: ', rows[0].version);
                      });



                      connection.end();

                      break;

                  default:
                      grunt.fatal('Invalid database driver. Supported drivers: mysql');
                      return false;
              }

              //                    if (!grunt.file.exists(options.log)) {
              //                    var result = grunt.file.read(options.log);
              //                var done = this.async();

              //                grunt.verbose.writeln('git ' + args.join(' '));

              // Run the git log command and parse the result.
              //                grunt.util.spawn(
              //                    {
              //                        cmd: 'git',
              //                        args: args
              //                    },
              //
              //                    function (error, result) {
              //                        if (error) {
              //                            grunt.log.error(error);
              //                            return done(false);
              //                        }
              //
              //                        var changelog = getChangelog(result);
              //
              //                        writeChangelog(changelog);
              //
              //                        done();
              //                    }
              //                );
        */

        return success;
    });
};
