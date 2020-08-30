#! /bin/bash

# This is for local development purpose only
docker run -d --net=host --env-file .env hasura/graphql-engine:v1.3.1
