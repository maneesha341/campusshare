import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // silently picks up new deploys without needing a manual refresh
      includeAssets: ['favicon.ico', 'favicon-16.png', 'favicon-32.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'CampusShare',
        short_name: 'CampusShare',
        description: 'Buy and sell used academic books, right on campus.',
        theme_color: '#FFFCF5', // matches the app's paper background
        background_color: '#FFFCF5', // shown briefly on the splash screen while the app loads
        display: 'standalone', // hides the browser chrome so it looks like a native app
        start_url: '/',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5000',
      '/uploads': 'http://localhost:5000',
    },
  },
});