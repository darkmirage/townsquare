import firebase from 'firebaseApp';

let cachedToken: string | null = null;

export async function refreshToken(
  force: boolean = false
): Promise<string | null> {
  const user = firebase.auth().currentUser;
  if (!user) {
    cachedToken = null;
    return cachedToken;
  }

  const token = await user.getIdToken(force);
  const results = await user.getIdTokenResult();
  if ('https://hasura.io/jwt/claims' in results.claims) {
    cachedToken = token || null;
    return cachedToken;
  } else {
    cachedToken = null;
    return cachedToken;
  }
}

export function getToken(): string | null {
  refreshToken();
  return cachedToken;
}
