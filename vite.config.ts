import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      watch: {
        ignored: ['**/backend/**', '**/*.db', '**/*.db-journal', '**/*.db-wal'],
      },
    },
    plugins: [react(), svgr()],
    define: {
      // API Key removida - agora gerenciada pelo backend seguro
      // A chave NUNCA é exposta no cliente
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
