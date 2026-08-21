import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // The Lanyard component imports a binary glTF model; without this Vite tries
  // to parse it as UTF-8 text and the build fails.
  assetsInclude: ['**/*.glb'],
})
