const GMAIL_API_BASE = 'https://gmail.googleapis.com/gmail/v1/users/me';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
}

let authState: AuthState = {
  token: null,
  isAuthenticated: false,
};

export async function authenticate(interactive: boolean = true): Promise<string> {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive }, (token) => {
      if (chrome.runtime.lastError) {
        authState = { token: null, isAuthenticated: false };
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      if (!token) {
        authState = { token: null, isAuthenticated: false };
        reject(new Error('No token received'));
        return;
      }
      authState = { token, isAuthenticated: true };
      resolve(token);
    });
  });
}

export async function getToken(): Promise<string> {
  if (authState.token) {
    return authState.token;
  }
  return authenticate(false).catch(() => authenticate(true));
}

export async function revokeToken(): Promise<void> {
  if (!authState.token) return;
  return new Promise((resolve) => {
    chrome.identity.removeCachedAuthToken({ token: authState.token! }, () => {
      authState = { token: null, isAuthenticated: false };
      resolve();
    });
  });
}
