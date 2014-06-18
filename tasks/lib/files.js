/**
 * @file Handler functions for file processing
 */

'use strict';

var path = require('path'),
    wrench = require('wrench');

function FileUtils() {
    var self = this;

    /**
     * Pretty-print an entry's version and comment
     */
    this.formatEntry = function(entry) {
        return '[' + String('     ' + entry.version).slice(-6) + ']' +
               ' :: ' + entry.comment;
    };

    /**
     * Retrieve the first line of a file, and determine whether it's a comment.
     */
    this.firstLine = function(file) {
        var f = new wrench.LineReader(file),
            comment = '';

        if (f.hasNextLine()) {
            comment = f.getNextLine();
            if (comment.indexOf('-- ') !== 0) {
                comment = '';
            } else {
                comment = comment.substring(3);
            }
        }

        return comment;
    };

    /**
     * Get a list of files to process.
     */
    this.filesToProcess = function(src) {
        var files = [];

        // For each file, get its version (we ignore files that don't start with
        // numbers) and optional comment
        src.map(function(entry) {
            var base = path.basename(entry),
                parts = base.match(/^([0-9]+)/gi);

            if (!parts || parts.length !== 1) {
                return;
            }

            files.push({
                filename: entry,
                base: base,
                version: (parts && parts.length === 1) ? +parts[0] : 999999999,
                comment: self.firstLine(entry)
            });
        });

        return files.sort(function(a, b) {
            return a.version - b.version;
        });
    };
}

module.exports = new FileUtils();
