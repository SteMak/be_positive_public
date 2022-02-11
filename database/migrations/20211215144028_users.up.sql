CREATE TABLE users (
  id varchar(64) PRIMARY KEY,
  banned boolean NOT NULL DEFAULT false,
  warnings BIGINT NOT NULL DEFAULT 0
);