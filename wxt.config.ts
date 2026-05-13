import { defineConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Mailman',
    description: 'Transform your Gmail into a calm, organized, stack-based email workspace.',
    version: '2.0.0',
    // key: 'YOUR_PUBLIC_KEY_HERE', // Uncomment and add your public key to lock the extension ID
    permissions: ['identity', 'storage', 'activeTab', 'tabs'],
    host_permissions: ['https://mail.google.com/*'],
    oauth2: {
      client_id: 'YOUR_CLIENT_ID_HERE.apps.googleusercontent.com',
      scopes: ['https://www.googleapis.com/auth/gmail.readonly'],
    },
    icons: {
      16: '/icons/icon-16.png',
      32: '/icons/icon-32.png',
      48: '/icons/icon-48.png',
      128: '/icons/icon-128.png',
    },
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
});
