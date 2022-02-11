CREATE TABLE events (
  id varchar(39) PRIMARY KEY,
  type varchar(10),
  initiator varchar(64),
  timestamp varchar(20),
  sender varchar(64),
  receiver varchar(64),
  token_id varchar(46),
  status varchar(20),
  selleble boolean,
  price varchar(39)
);