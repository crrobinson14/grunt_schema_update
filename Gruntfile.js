/*
 * grunt-schema-update
 * https://github.com/crrobinson14/grunt_schema_update
 *
 * Copyright (c) 2014 Chad Robinson
 * Licensed under the MIT license. See LICENSE-MIT.
 */

'use strict';

module.exports = function(grunt) {
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        // Configuration to be run (and then tested)
        schema_update: {
            default_options: {
                options: {},
                files: 'test/fixtures/**.sql'
            },
            custom_options: {
                options: {
                    useTransaction: false,
                    pretend: false
                },
                files: 'test/fixtures/**.sql'
            }
        },

        // Unit tests
        nodeunit: {
            tests: ['test/*_test.js']
        }
    });

    grunt.loadTasks('tasks');

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    grunt.registerTask('test', ['schema_update', 'nodeunit']);
    grunt.registerTask('default', ['jshint', 'test']);
};
