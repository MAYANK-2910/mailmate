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
    chrome.runtime.sendMessage({ type: 'AUTHENTICATE', interactive }, (response) => {
      if (chrome.runtime.lastError) {
        authState = { token: null, isAuthenticated: false };
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }

      if (response?.error) {
        authState = { token: null, isAuthenticated: false };
        reject(new Error(response.error));
        return;
      }

      if (!response?.token) {
        authState = { token: null, isAuthenticated: false };
        reject(new Error('No token received'));
        return;
      }

      authState = { token: response.token, isAuthenticated: true };
      resolve(response.token);
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
    chrome.runtime.sendMessage({ type: 'REVOKE_TOKEN', token: authState.token }, () => {
      authState = { token: null, isAuthenticated: false };
      resolve();
    });
  });
}

export async function gmailFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = await getToken();
  const response = await fetch(`${GMAIL_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (response.status === 401) {
    await revokeToken();
    const newToken = await authenticate(true);
    const retryResponse = await fetch(`${GMAIL_API_BASE}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${newToken}`,
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    if (!retryResponse.ok) {
      throw new Error(`Gmail API error: ${retryResponse.status} ${retryResponse.statusText}`);
    }
    return retryResponse.json();
  }

  if (!response.ok) {
    throw new Error(`Gmail API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export function getAuthState(): AuthState {
  return { ...authState };
}

export async function checkAuthStatus(): Promise<boolean> {
  try {
    await authenticate(false);
    return true;
  } catch {
    return false;
  }
}
