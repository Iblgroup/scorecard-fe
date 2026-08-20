import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Pinned, not left to Vite's "first free port" walk. The authenticator portal
  // maps each dashboard to a fixed dev port (VITE_DASHBOARD_PORTS), so a
  // drifting port breaks the login handoff. 5173 is the portal itself, then
  // 5174 dsr-fe, 5175 here, 5176 distribution-metrics-fe. strictPort makes a
  // clash loud instead of silently shifting this app onto a neighbour's port.
  server: {
    port: 5175,
    strictPort: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
