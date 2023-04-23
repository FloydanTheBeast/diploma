/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import viteTsConfigPaths from 'vite-tsconfig-paths';

import packageJson from '../../package.json';

export default defineConfig({
  cacheDir: '../../node_modules/.vite/client',

  server: {
    port: 4200,
    host: 'localhost',
  },

  preview: {
    port: 4300,
    host: 'localhost',
  },

  define: {
    APP_VERSION: JSON.stringify(packageJson.version),
  },

  plugins: [
    react(),
    viteTsConfigPaths({
      root: '../../',
    }),
    checker({
      typescript: {
        tsconfigPath: 'tsconfig.app.json',
      },
      enableBuild: false,
    }),
    // FIXME: Temporary workaround for `Cannot access before initialization` error
    {
      name: 'singleHMR',
      handleHotUpdate({ modules }) {
        modules.map(m => {
          m.importedModules = new Set();
          m.importers = new Set();
          return m;
        });

        return modules;
      },
    },
  ],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [
  //    viteTsConfigPaths({
  //      root: '../../',
  //    }),
  //  ],
  // },

  test: {
    globals: true,
    cache: {
      dir: '../../node_modules/.vitest',
    },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
});
