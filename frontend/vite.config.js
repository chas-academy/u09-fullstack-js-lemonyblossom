import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import manifest from './public/manifest.json';


export default defineConfig(() => {
  return {
    build: {
      outDir: 'build',
    },
    plugins: [react(),
      VitePWA({ 
         registerType: 'autoUpdate',
         includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
         manifest: manifest 
       })
   
    ],
    server: {
      port: 3000, 
    },
  };
});