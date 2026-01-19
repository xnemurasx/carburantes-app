import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Si más adelante quisieras GH Pages, aquí se configura base.
})
