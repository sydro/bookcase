#!/bin/bash

mongod --bind_ip_all --replSet rs0 > /var/log/mongodb/mongo.log &

sleep 3;

echo "rs.initiate();" | mongo

sleep 5;
echo 'use bookcase;
db.createUser(
  {
    user: "bookcase",
    pwd: "test123",
    roles: [ { role: "readWrite", db: "bookcase" } ]
  }
);' | mongo

tail -f /var/log/mongodb/mongo.log
