-- Initialize the database

-- Start from scratch here
DROP DATABASE IF EXISTS gstest;
CREATE DATABASE gstest;
GRANT ALL ON `gstest`.* TO 'gstest'@'localhost' IDENTIFIED BY '123456';

-- Track our version number
CREATE TABLE schema_version (
  schema_version int NOT NULL
);
