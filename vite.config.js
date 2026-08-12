import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [
    svelte(),
    {
      name: 'main-html-entry',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          if (req.url === '/') req.url = '/main.html';
          next();
        });
      },
    },
  ],
  build: {
    rollupOptions: {
      input: 'main.html',
    },
  },
  server: {
    open: '/main.html',
  },
})
