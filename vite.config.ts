import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Try to load Vite PWA plugin if present. If not installed, continue without it.
let pwaPlugin = null
try{
  // require used so TS/ES import doesn't fail when package missing
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { VitePWA } = require('vite-plugin-pwa')
  pwaPlugin = VitePWA({
    registerType: 'autoUpdate',
    manifest: {
      name: 'TIETABLE',
      short_name: 'TIETABLE',
      description: 'A creative PWA to view your daily timetable',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      icons: [
        { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
      ]
    }
  })
}catch(e){
  // plugin not installed; dev continues without PWA support
}

export default defineConfig({
  plugins: [
    react(),
    ...(pwaPlugin? [pwaPlugin]: [])
  ]
})
