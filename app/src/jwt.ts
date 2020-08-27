import firebase from 'firebaseApp';

let cachedToken: string | null = null;

export async function refreshToken(force: boolean = false) {
  const token = await firebase.auth().currentUser?.getIdToken(force);
  cachedToken = token || null;
}

export function getToken(): string | null {
  refreshToken();
  return cachedToken;
}
