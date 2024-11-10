import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['graduation.png', 'robots.txt', 'apple-touch-icon.png', 'mark.webp'],
      manifest: {
        name: 'Taylors Educational Express',
        short_name: 'T.E.E',
        description: 'Taylor E-learning platform',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'graduation.png',  // Ensure this path is correct based on your `public` folder
            sizes: '192x192',
            type: 'image/webp'
          },
          {
            src: 'graduation.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});
