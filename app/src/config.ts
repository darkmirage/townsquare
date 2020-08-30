let AGORA_APP_ID ='';
let GRPAHQL_HTTP_URL = '';
let GRAPHQL_WS_URL = '';
let PRESENCE_WS_URL = '';

switch (process.env.NODE_ENV) {
  case 'development':
    AGORA_APP_ID = process.env.REACT_APP_DEV_AGORA_APP_ID!;
    GRPAHQL_HTTP_URL = process.env.REACT_APP_DEV_GRPAHQL_HTTP_URL!;
    GRAPHQL_WS_URL = process.env.REACT_APP_DEV_GRAPHQL_WS_URL!;
    PRESENCE_WS_URL = process.env.REACT_APP_DEV_PRESENCE_WS_URL!;
    break;
  case 'production':
    AGORA_APP_ID = process.env.REACT_APP_PROD_AGORA_APP_ID!;
    GRPAHQL_HTTP_URL = process.env.REACT_APP_PROD_GRPAHQL_HTTP_URL!;
    GRAPHQL_WS_URL = process.env.REACT_APP_PROD_GRAPHQL_WS_URL!;
    PRESENCE_WS_URL = process.env.REACT_APP_PROD_PRESENCE_WS_URL!;
    break;
  default:
    throw new Error(`Missing configurations for environment: ${process.env.NODE_ENV}`);
}

export {
  AGORA_APP_ID,
  GRAPHQL_WS_URL,
  GRPAHQL_HTTP_URL,
  PRESENCE_WS_URL,
}
