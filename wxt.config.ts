import { defineConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Mailman',
    description: 'Transform your Gmail into a calm, organized, stack-based email workspace.',
    version: '2.0.0',
    key: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA04usH4BugTm/F7cqWF2Nb25tRXV+93U+FHvpHTMQFCGsUydpgq31jwUdtO7nRSIPiF3Zw4IIrinZA2nybuNGdPFUnJKt2ssD4c00otJDbNhKCavAauCQSXiYXPrrPHGUnZZpbsHA0SQzNPmbWwzB0LdlN27LRVTDwnhmlcybf62At6wvb277VPbfANDVkJAIXpkf+4TVT1FcbyoriImpDgfGG8n0UC3pA4Irc+gaxGDrTHOs7fuVrMV2KIei8V/CfBgADg8N7AJp0+iz3m7HtasEIG4/Q2uan9SrIs+yl+iCDGc6hAisV9y1aTUxGW0qJAFMjNHoXURMOrgL/eiuswIDAQAB',
    permissions: ['identity', 'storage', 'activeTab', 'tabs'],
    host_permissions: ['https://mail.google.com/*'],
    oauth2: {
      client_id: '1006815105102-11rtdk2o3cdd3tn4g0l6eis1442d3gfo.apps.googleusercontent.com',
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
