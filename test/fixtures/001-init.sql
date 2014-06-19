-- Initialize the database

-- Start from scratch here
DROP DATABASE IF EXISTS gstest;
CREATE DATABASE gstest;
GRANT ALL ON `gstest`.* TO 'gstest'@'localhost' IDENTIFIED BY '123456';
USE gstest;

-- Track our version number
CREATE TABLE schema_version (
  version int NOT NULL
);

INSERT INTO schema_version VALUES (0);
