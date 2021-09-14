#!/bin/bash

set -e

TAG=appName

# Build
docker build -t $TAG:dev .

# Run app
docker run --rm -p 3000:3000 --env-file .env --name $TAG $TAG:dev