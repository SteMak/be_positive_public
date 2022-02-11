CREATE TYPE token_status AS ENUM (
  'Ok',
  'LockedToTransfer',
  'LockedToListen',
  'SuperOk'
);
CREATE TABLE tokens (
  id varchar(46) PRIMARY KEY,
  owner_id varchar(64) NOT NULL,
  title varchar(64),
  description varchar(512),
  created_at varchar(20),
  transferred_at varchar(20),
  updated_at varchar(20),
  creator varchar(64),
  status token_status NOT NULL DEFAULT 'Ok',
  selleble boolean NOT NULL DEFAULT false,
  price varchar(39) NOT NULL DEFAULT '0',
  reports_speech text NOT NULL,
  reports_offence text NOT NULL,
  reports_speech_on_verify INT NOT NULL,
  reports_offence_on_verify INT NOT NULL
);