import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  
  const serverConfig = {
    port: parseInt(env.VITE_PORT) || 5173,
    proxy: {
      '/api': `http://localhost:${env.PORT || 3001}`,
      '/ws': {
        target: `ws://localhost:${env.PORT || 3001}`,
        ws: true
      },
      '/shell': {
        target: `ws://localhost:${env.PORT || 3001}`,
        ws: true
      }
    }
  }

  if (env.VITE_ALLOWED_HOST) {
    serverConfig.allowedHosts = [env.VITE_ALLOWED_HOST]
  }

  if (env.VITE_HMR_HOST) {
    serverConfig.hmr = {
      host: env.VITE_HMR_HOST,
      protocol: env.VITE_HMR_PROTOCOL || 'wss',
      clientPort: parseInt(env.VITE_HMR_CLIENT_PORT) || 443
    }
  }

  return {
    plugins: [react()],
    server: serverConfig,
    build: {
      outDir: 'dist',
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-codemirror': [
              '@uiw/react-codemirror',
              '@codemirror/lang-css',
              '@codemirror/lang-html',
              '@codemirror/lang-javascript',
              '@codemirror/lang-json',
              '@codemirror/lang-markdown',
              '@codemirror/lang-python',
              '@codemirror/theme-one-dark'
            ],
            'vendor-xterm': ['@xterm/xterm', '@xterm/addon-fit', '@xterm/addon-clipboard', '@xterm/addon-webgl']
          }
        }
      }
    }
  }
})
