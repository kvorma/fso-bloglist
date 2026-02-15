#!/bin/bash

env_list="github fly"

for e in $env_list; do
  rm -f .env.$e
  grep -v "MONGODB_URI" .env > .env.$e
done

#eof