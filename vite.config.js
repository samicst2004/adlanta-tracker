import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/adlanta-tracker/', // <--- Yahan apni repo ka naam dalein (e.g., /adlanta-tracker/)
})