import { Request } from 'express';

export function getHasuraClaims(userId: number) {
  const defaultClaims = {
    'x-hasura-default-role': 'user',
    'x-hasura-allowed-roles': ['user'],
    'x-hasura-user-id': `${userId}`,
  };
  const claims = {
    'https://hasura.io/jwt/claims': {
      ...defaultClaims,
    },
  };

  return claims;
}

export function getHasuraIdandRole(req: Request) {
  const variables = req.body.session_variables;
  const role = variables['x-hasura-role'];
  const id =
    'x-hasura-user-id' in variables
      ? parseInt(variables['x-hasura-user-id'], 10)
      : null;
  return { role, id };
}
