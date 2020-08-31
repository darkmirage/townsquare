import firebase from 'firebaseApp';

let cachedToken: string | null = null;

export async function refreshToken(
  force: boolean = false
): Promise<string | null> {
  const token = await firebase.auth().currentUser?.getIdToken(force);
  cachedToken = token || null;
  return cachedToken;
}

export function getToken(): string | null {
  refreshToken();
  return cachedToken;
}
