# Grunt Schema Updater

> Database schema update utility for grunt-based builds and deployments

Schema-less databases are great, but not for every situation... and if you're still using MySQL, PostgreSQL, or another
traditional SQL database, keeping schemas in sync between development, QA, and production environments is still a
challenge.

SQL update scripts are ideal because they can be tracked through Git, SVN, or Mercurial. All you need is a tool to make
sure the updates are performed consistently among all systems. Grunt Schema Updater is that tool. This plugin scans a
folder for SQL scripts that match a given filename pattern, for example:

```shell
000-init.sql
001-additional-keys.sql
002-groups-table.sql
```

Updates are processed in order, in transactions, and failures/retries are handled gracefully. 

Because this is a multiTask, you can register several entries and maintain multiple schemas from one tool!

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the
[Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a
[Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with
 that process, you may install this plugin with this command:

```shell
npm install grunt-schema-update --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-schema-update');
```

## The "schema_update" task

### Overview
In your project's Gruntfile, add a section named `schema_update` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  schema_update: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.driver
Type: `String`
Default value: `'mysql'`

The type of database to connect to. Currently, only `'simulation'` and `'mysql'` are supported, but since the database
layer is modular, it would be easy to add more. (Pull requests welcome!)

#### options.src
Type: `String`
Default value: `'mysql'`

The files to process. Standard Grunt files syntax is accepted (wildcards, arrays, etc.)

#### options.connection
Type: `Object`
Default value: `{}`

A database connection configuration block. This is passed as-is to the database layer, so you can include any options
that layer supports. For example, for MySQL you might use:

```js
    ...
    options: {
        ...
        driver: 'mysql',
        connection: {
            host: 'localhost',
            user: 'root',
            pass: '',
            database: 'test',
            multipleStatements: true
        }
        ...
    },
    ...
```

#### options.create
Type: `Object`
Default value:
```js
    create: {
        connection: {
            host: 'localhost',
            user: 'root',
            password: ''
        },
        createDB: 'gstest',
        createUser: 'gstest',
        createPass: '123456',
        createHost: 'localhost'
    },
```

A create-schema configuration block. Includes a 'connection' block for connecting to the server, plus options for how
the database and user to access it should be named. Note that a separate connection is made when running this section,
so you can include details for a privileged user account here.

This block is only required if `--reload-schema` is used. You may optionally skip this block and create the database
manually, but if you want to reload the schema you will then have to re-create it manually as well (including the
`schema_version` table!)

#### options.queryGetVersion
Type: `String`
Default value: `SELECT version FROM schema_version`

A query to execute to obtain the current database schema version number. If the connection succeeds but this call
fails, this is assumed to be an error condition unless the 'reload-schema' command line option was also included.

#### options.querySetVersion
Type: `String`
Default value: `UPDATE schema_version SET version={version}`

A query to execute to update the current schema version number. The token `{version}` will be replaced with the new
version from the last successful file import. (We don't use prepared statements because the syntax differences between
database drivers make it hard to provide a generic option for that.")

Note that the version will be updated after EACH successful schema update script import. If five updates are executed
but the fifth call fails, the version will be the version of the fourth (last successful) update. This helps prevent
duplicate updates because you can safely re-run the command to pick up where you left off.

#### options.queryVersionSafe
Type: `Boolean`
Default value: `true`

If the version query does not return a valid integer version value, this option controls what happens next. If it is
set to `true`, the script will terminate with an error. If it is set to `false`, the database will be presumed to be
corrupt or invalid and the schema update will start from the first file in the series. This is useful for populating
empty databases from scratch.

### Command-Line Arguments

In addition to the standard configuration options, this plugin also supports two command-line arguments:

#### `--pretend`

If you include `--pretend` when running Grunt, the list of updates that will be performed will be displayed, but not
executed. You can also use the `simulation` driver to provide a similar effect, but this mechanism may be more useful
for general use.

#### `--reload-schema`

If this parameter is included, the database version is ignored and is assumed to be 0. Updates will thus start with
version 1 (or the first version after it, sorted numerically). Be sure this file contains enough information to
construct the database AND the schema-version tracking table. See test/fixtures/001-init.sql for an example. This is
useful if you want to wipe-and-reload the database schema.

### Usage Examples

#### Default Options

The example configuration below will examine the `schema/` subdirectory and perform any required updates found inside
it. It will do this against a local MySQL database, logging in as root (no password) against database `mydb`. 

```js
grunt.initConfig({
    schema_update:
        options: {
            driver: 'simulation',
            connection: {
                host: 'localhost',
                user: 'gstest',
                password: '123456',
                database: 'gstest',
                multipleStatements: true
            },
            create: {
                connection: {
                    host: 'localhost',
                    user: 'root',
                    password: ''
                },
                createDB: 'gstest',
                createUser: 'gstest',
                createPass: '123456',
                createHost: 'localhost'
            },
            queryGetVersion: 'SELECT version FROM schema_version',
            querySetVersion: 'REPLACE INTO schema_version (version) VALUES ({version})',
            queryVersionSafe: true,
            pretend: true
        },
        src: 'schema/**.sql'
    }
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed
functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

v0.1.0 - Initial release. I yam what I yam.
