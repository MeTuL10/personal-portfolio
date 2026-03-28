import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Change the base to match your GitHub repo name: '/your-repo-name/'
export default defineConfig({
  plugins: [react()],
  base: '/personal-portfolio/', // <-- Change this to your GitHub repo name
})
