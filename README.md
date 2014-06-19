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

The type of database to connect to. Currently, only MySQL is supported, but this tool has been designed to handle
additional database types in the future. (Pull requests welcome!)

#### options.files
Type: `String`
Default value: `'mysql'`

The type of database to connect to. Currently, only MySQL is supported, but this tool has been designed to handle
additional database types in the future. (Pull requests welcome!)

#### options.connection
Type: `Object`
Default value: `{}`

One or more options to be passed to the database connection call. For example, for MySQL you might use:

```js
    ...
    options: {
        ...
        driver: 'mysql',
        connection: {
            host: 'localhost',
            user: 'root',
            password: 'mypass'
        }
        ...
    },
    ...
```

These options will be passed through as-is to the `createConnection()` (or similar) call, so you may include any
options supported by the driver's module. For example, all of the node-mysql options are supported as described
in the [node-mysql project on Github](http://gruntjs.com/).

#### options.queryGetVersion
Type: `String`
Default value: `SELECT version FROM schema_version`

A query to execute to obtain the current database schema version number. If the connection succeeds but this call
fails, the assumption about the current version is controlled by the `queryVersionSafe` option described below.

#### options.querySetVersion
Type: `String`
Default value: `REPLACE INTO schema_version (version) VALUES ({version})`

A query to execute to update the current database version number. The token `{version}` will be replaced with the new
version from the last successful file import. Note that the version will be updated after each successful schema
update script import, so if five updates are executed but the fifth call fails, the version will be the version of the
fourth (last successful) update. This helps prevent duplicate updates -- after a failed update, you can fix only the
failing script and try again safely.

Note that some drivers support things like parameter binding... but we don't use this because they don't all work the
same way. Since this is such a simple query, a simple string-replace operation lets us support more database drivers
more easily.

#### options.queryVersionSafe
Type: `Boolean`
Default value: `true`

If the version query does not return a valid integer version value, this option controls what happens next. If it is
set to `true`, the script will terminate with an error. If it is set to `false`, the database will be presumed to be
corrupt or invalid and the schema update will start from the first file in the series. This is useful for populating
empty databases from scratch.

### Usage Examples

#### Default Options

In this example, the default options are used to do something with whatever. So if the `testing` file has the content
`Testing` and the `123` file had the content `1 2 3`, the generated result would be `Testing, 1 2 3.`

```js


grunt.initConfig({
    schema_update:
        options: {
            driver: 'simulation',
            connection: {
                host: 'localhost',
                user: '',
                pass: '',
                multipleStatements: true
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
