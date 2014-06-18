-- Test a failing update query

-- This query isn't legit, so it will throw an error. The table should already exist.
CREATE TABLE test (
  id int auto_increment NOT NULL,
  PRIMARY KEY(id)
);
