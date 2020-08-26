#! /bin/bash

# This is for local development purpose only
docker run -d --net=host \
       -e HASURA_GRAPHQL_DATABASE_URL=postgres://postgres:thisisfine1@localhost:5432/townsquare \
       -e HASURA_GRAPHQL_ENABLE_CONSOLE=true \
       -e HASURA_GRAPHQL_DEV_MODE=true \
       -e HASURA_GRAPHQL_UNAUTHORIZED_ROLE=anonymous \
       -e HASURA_GRAPHQL_ADMIN_SECRET="myadminsecretkey" \
       -e HASURA_GRAPHQL_JWT_SECRET='{"type":"RS256","jwk_url": "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com", "audience": "townsquare-chat", "issuer": "https://securetoken.google.com/townsquare-chat"}' \
       hasura/graphql-engine:v1.3.1
