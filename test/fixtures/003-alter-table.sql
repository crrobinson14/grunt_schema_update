--- v003: Add a field to an existing table

-- The user table holds basic information about each user of the system
CREATE TABLE test (
  id int auto_increment NOT NULL,
  username varchar(255) NOT NULL,
  PRIMARY KEY(id),
  KEY(username)
);
