/*
 * grunt-schema-update
 * https://github.com/crrobinson14/grunt_schema_update
 *
 * Copyright (c) 2014 Chad Robinson
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  grunt.registerMultiTask('schema_update', 'Database schema update utility.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      driver: 'mysql',
      connection: {
        host: 'localhost',
        user: '',
        pass: ''
      },
      queryGetVersion: 'SELECT version FROM schema_version',
      querySetVersion: 'REPLACE INTO schema_version (version) VALUES ({version})',
      queryVersionSafe: true
    });

    var filesToProcess = [];

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
        console.log(f.src);
//      // Concat specified files.
//      var src = f.src.filter(function(filepath) {
//        // Warn on and remove invalid source files (if nonull was set).
//        if (!grunt.file.exists(filepath)) {
//          grunt.log.warn('Source file "' + filepath + '" not found.');
//          return false;
//        } else {
//          return true;
//        }
//      }).map(function(filepath) {
//        // Read file source.
//        return grunt.file.read(filepath);
//      }).join(grunt.util.normalizelf(','));
//
//      // Handle options.
//      src += options.punctuation;
//
//      // Write the destination file.
//      grunt.file.write(f.dest, src);
//
//      // Print a success message.
//      grunt.log.writeln('File "' + f.dest + '" created.');
    });


/*
      grunt.log.writeln('Updating DB.');

      // Default and user-supplied options
      var options = this.options({
                                 });

      grunt.verbose.writeflags(options, 'Options');
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
  });
};
