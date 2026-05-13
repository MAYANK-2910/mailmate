export default defineBackground(() => {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'AUTHENTICATE') {
      chrome.identity.getAuthToken({ interactive: message.interactive }, (result) => {
        if (chrome.runtime.lastError) {
          sendResponse({ error: chrome.runtime.lastError.message });
          return;
        }
        
        const token = typeof result === 'string' ? result : (result as chrome.identity.GetAuthTokenResult)?.token;
        if (!token) {
          sendResponse({ error: 'No token received' });
          return;
        }

        sendResponse({ token });
      });
      return true; // Keep message channel open for async response
    }

    if (message.type === 'REVOKE_TOKEN') {
      chrome.identity.removeCachedAuthToken({ token: message.token }, () => {
        sendResponse({ success: true });
      });
      return true;
    }

    if (message.type === 'GET_AUTH_STATUS') {
      chrome.identity.getAuthToken({ interactive: false }, (token) => {
        sendResponse({ authenticated: !!token });
      });
      return true;
    }

    if (message.type === 'GET_UNREAD_COUNT') {
      sendResponse({ count: message.count ?? 0 });
      return true;
    }
  });

  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'UPDATE_BADGE') {
      const count = message.count ?? 0;
      chrome.action.setBadgeText({
        text: count > 0 ? String(count > 99 ? '99+' : count) : '',
      });
      chrome.action.setBadgeBackgroundColor({ color: '#6366f1' });
    }
  });
});
