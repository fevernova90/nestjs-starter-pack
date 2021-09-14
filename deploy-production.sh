#!/bin/bash

set -e

IMAGE_NAME=appName
TAG=production
REMOTE_REPO=remoteRepo

# Build
docker build --pull --no-cache -t $IMAGE_NAME:$TAG .

# Tag
docker tag $IMAGE_NAME:$TAG $REMOTE_REPO/$IMAGE_NAME:$TAG

# Push
docker push $REMOTE_REPO/$IMAGE_NAME:$TAG
