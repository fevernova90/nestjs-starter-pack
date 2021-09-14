#!/bin/bash

set -e

IMAGE_NAME=appName
TAG=staging
REMOTE_REPO=remoteRepo

# Build
docker build --pull -t hl-phoneburner-$IMAGE_NAME:$TAG .

# Tag
docker tag hl-phoneburner-$IMAGE_NAME:$TAG $REMOTE_REPO/$IMAGE_NAME:$TAG

# Push
docker push $REMOTE_REPO/$IMAGE_NAME:$TAG
