import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on mode (development, production)
  const env = loadEnv(mode, process.cwd(), '');

  // --- REWORK: Environment Variable Validation ---
  if (!env.VITE_SUPABASE_URL || !env.VITE_SUPABASE_ANON_KEY) {
    throw new Error('CRITICAL ERROR: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be defined in your .env file');
  }
  
  return {
    server: {
      host: "0.0.0.0",
      port: 8080,
      // EPIC 13: Enhanced proxy configuration for ESG extraction services
      proxy: {
        '/api/gemini': {
          target: 'http://localhost:54321/functions/v1/process-report',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/gemini/, ''),
          secure: false,
        },
        // EPIC 13: ESG extraction API endpoints
        '/api/esg-extraction': {
          target: 'http://localhost:54321/functions/v1/esg-extraction',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/esg-extraction/, ''),
          secure: false,
        },
        '/api/file-upload': {
          target: 'http://localhost:54321/functions/v1/file-upload',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/file-upload/, ''),
          secure: false,
        },
      },
    },
    plugins: [
      react(),
      mode === 'development' &&
      componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    publicDir: 'public',
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      // EPIC 13: Optimize bundle splitting for ESG extraction modules
      rollupOptions: {
        output: {
          manualChunks: {
            'esg-extractor': [
              './src/components/ESGExtractor/ESGExtractorMain.tsx',
              './src/services/geminiAPI.ts',
              './src/hooks/useESGExtraction.ts'
            ],
            'vendor': ['react', 'react-dom'],
          },
        },
      },
      copyPublicDir: true,
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      css: true,
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
      exclude: [
        '**/node_modules/**', 
        '**/dist/**', 
        '**/forum-service/**', 
        'src/test/auth.test.tsx', 
        'src/test/integration.test.tsx'
      ],
    },
    // EPIC 13: Environment variable validation (Note: this is a build-time flag, runtime check is preferred)
    define: {
      __GEMINI_API_ENABLED__: JSON.stringify(!!env.VITE_GEMINI_API_KEY),
    },
  }
});