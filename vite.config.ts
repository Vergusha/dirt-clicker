import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Dirt Clicker',
        short_name: 'Dirt Clicker',
        description: 'A clicker game where you collect dirt blocks',
        theme_color: '#3d2b1f',
        background_color: '#242424',
        icons: [
          {
            src: 'src/assets/dirt.webp',
            sizes: '192x192',
            type: 'image/webp'
          },
          {
            src: 'src/assets/dirt.webp',
            sizes: '512x512',
            type: 'image/webp',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
