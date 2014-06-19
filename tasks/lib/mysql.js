/*
 * grunt-schema-update
 * https://github.com/crrobinson14/grunt_schema_update
 *
 * Copyright (c) 2014 Chad Robinson
 * Licensed under the MIT license. See LICENSE-MIT.
 */

'use strict';

/**
 * grunt-schema-update
 * https://github.com/crrobinson14/grunt_schema_update
 *
 * Copyright (c) 2014 Chad Robinson
 * Licensed under the MIT license.
 */

'use strict';

exports.init = function(grunt, options) {
    var exports = {},
        connection,
        mysql = require('mysql'),
        currentVersion = 0;

    /**
     * Connect to the MySQL server.
     * @returns {boolean} true if the connection was successful
     */
    exports.connect = function() {
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

    return exports;
};
