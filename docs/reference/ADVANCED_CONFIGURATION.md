# ⚙️ Advanced Configuration Guide

**Deep configuration options for customizing GoCarbonTracker**

## Environment Configuration

### **Core Environment Variables**
```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# API Configuration
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_API_VERSION=v1
VITE_API_TIMEOUT=30000

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEMO_MODE=true
VITE_ENABLE_EXPERIMENTAL_FEATURES=false
VITE_ENABLE_OFFLINE_MODE=false

# Theme & UI Configuration
VITE_DEFAULT_THEME=light
VITE_ENABLE_THEME_SWITCHER=true
VITE_BRAND_COLORS_PRIMARY=#1e40af
VITE_BRAND_COLORS_SECONDARY=#059669

# Performance Settings
VITE_LAZY_LOADING=true
VITE_VIRTUAL_SCROLLING=true
VITE_CACHE_DURATION=300000
VITE_MAX_CONCURRENT_REQUESTS=5
```

### **Development vs Production Settings**
```bash
# .env.development
VITE_LOG_LEVEL=debug
VITE_ENABLE_DEV_TOOLS=true
VITE_HOT_RELOAD=true
VITE_SOURCE_MAPS=true

# .env.production
VITE_LOG_LEVEL=error
VITE_ENABLE_DEV_TOOLS=false
VITE_MINIFY=true
VITE_DROP_CONSOLE=true
```

## Build Configuration

### **Vite Advanced Configuration**
```typescript
// vite.config.ts
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      react({
        // React Fast Refresh configuration
        fastRefresh: process.env.NODE_ENV === 'development',
      }),
    ],
    
    // Build optimizations
    build: {
      target: 'es2020',
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: env.VITE_SOURCE_MAPS === 'true',
      minify: env.VITE_MINIFY === 'true' ? 'terser' : false,
      
      // Code splitting strategy
      rollupOptions: {
        output: {
          manualChunks: {
            // Vendor libraries
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-ui': [
              '@radix-ui/react-dialog',
              '@radix-ui/react-dropdown-menu',
              '@radix-ui/react-tabs'
            ],
            'vendor-data': ['@supabase/supabase-js', '@tanstack/react-query'],
            'vendor-charts': ['recharts', 'date-fns'],
            
            // App modules
            'components-ui': [/src\/components\/ui/],
            'hooks': [/src\/hooks/],
            'utils': [/src\/utils/],
          },
          
          // Asset naming
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: ({ name }) => {
            if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(name ?? '')) {
              return 'images/[name]-[hash][extname]';
            }
            if (/\.css$/.test(name ?? '')) {
              return 'css/[name]-[hash][extname]';
            }
            return 'assets/[name]-[hash][extname]';
          },
        },
      },
      
      // Terser configuration for production
      terserOptions: {
        compress: {
          drop_console: env.VITE_DROP_CONSOLE === 'true',
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.debug'],
        },
        mangle: {
          safari10: true,
        },
      },
    },
    
    // Development server
    server: {
      port: parseInt(env.VITE_DEV_PORT) || 3000,
      host: env.VITE_DEV_HOST || 'localhost',
      open: env.VITE_AUTO_OPEN === 'true',
      cors: true,
      
      // Proxy configuration for API calls
      proxy: env.VITE_API_PROXY === 'true' ? {
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      } : undefined,
    },
    
    // Path resolution
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@components': resolve(__dirname, 'src/components'),
        '@hooks': resolve(__dirname, 'src/hooks'),
        '@utils': resolve(__dirname, 'src/utils'),
        '@types': resolve(__dirname, 'src/types'),
        '@assets': resolve(__dirname, 'src/assets'),
      },
    },
    
    // CSS configuration
    css: {
      devSourcemap: mode === 'development',
      modules: {
        localsConvention: 'camelCase',
      },
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/styles/variables.scss";',
        },
      },
    },
    
    // Define global constants
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __COMMIT_HASH__: JSON.stringify(process.env.GITHUB_SHA?.substring(0, 7) || 'dev'),
    },
  };
});
```

## Application Configuration

### **Runtime Configuration System**
```typescript
// src/config/index.ts
interface AppConfig {
  api: {
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
    rateLimit: number;
  };
  features: {
    analytics: boolean;
    demoMode: boolean;
    experimentalFeatures: boolean;
    offlineMode: boolean;
  };
  ui: {
    theme: 'light' | 'dark' | 'system';
    enableThemeSwitcher: boolean;
    animations: boolean;
    lazyLoading: boolean;
  };
  performance: {
    cacheEnabled: boolean;
    cacheDuration: number;
    virtualScrolling: boolean;
    maxConcurrentRequests: number;
  };
}

export const config: AppConfig = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://hiplsgbyxbalukmejxaq.supabase.co/rest/v1',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000,
    retryAttempts: parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS) || 3,
    rateLimit: parseInt(import.meta.env.VITE_API_RATE_LIMIT) || 1000,
  },
  features: {
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    demoMode: import.meta.env.VITE_ENABLE_DEMO_MODE === 'true',
    experimentalFeatures: import.meta.env.VITE_ENABLE_EXPERIMENTAL_FEATURES === 'true',
    offlineMode: import.meta.env.VITE_ENABLE_OFFLINE_MODE === 'true',
  },
  ui: {
    theme: import.meta.env.VITE_DEFAULT_THEME as 'light' | 'dark' | 'system' || 'light',
    enableThemeSwitcher: import.meta.env.VITE_ENABLE_THEME_SWITCHER === 'true',
    animations: import.meta.env.VITE_ENABLE_ANIMATIONS !== 'false',
    lazyLoading: import.meta.env.VITE_LAZY_LOADING === 'true',
  },
  performance: {
    cacheEnabled: import.meta.env.VITE_CACHE_ENABLED !== 'false',
    cacheDuration: parseInt(import.meta.env.VITE_CACHE_DURATION) || 300000,
    virtualScrolling: import.meta.env.VITE_VIRTUAL_SCROLLING === 'true',
    maxConcurrentRequests: parseInt(import.meta.env.VITE_MAX_CONCURRENT_REQUESTS) || 5,
  },
};

// Configuration validation
export function validateConfig(): void {
  const required = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
  ];
  
  const missing = required.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
```

### **Feature Flag System**
```typescript
// src/hooks/useFeatureFlag.ts
import { config } from '@/config';

export function useFeatureFlag(flag: keyof typeof config.features): boolean {
  return config.features[flag];
}

// Usage in components
function DashboardComponent() {
  const analyticsEnabled = useFeatureFlag('analytics');
  const experimentalEnabled = useFeatureFlag('experimentalFeatures');
  
  return (
    <div>
      {analyticsEnabled && <AnalyticsWidget />}
      {experimentalEnabled && <ExperimentalFeature />}
    </div>
  );
}
```

## Database Configuration

### **Supabase Advanced Setup**
```typescript
// src/lib/supabase.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '@/config';

// Custom Supabase client with advanced configuration
export const supabase: SupabaseClient = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!,
  {
    auth: {
      // Persistence configuration
      storage: window.localStorage,
      storageKey: 'gocarbontracker-auth',
      
      // Auto refresh settings
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      
      // Security settings
      flowType: 'pkce',
    },
    
    // Real-time configuration
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
    
    // Global configuration
    global: {
      headers: {
        'X-Client-Info': `gocarbontracker@${__APP_VERSION__}`,
      },
    },
    
    // Database configuration
    db: {
      schema: 'public',
    },
  }
);

// Connection monitoring
export function monitorConnection() {
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event, session?.user?.id);
  });
}
```

### **Database Query Optimization**
```typescript
// src/lib/queryOptimization.ts
export const queryConfig = {
  // Pagination settings
  defaultPageSize: 50,
  maxPageSize: 1000,
  
  // Cache settings
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
  
  // Query timeouts
  queryTimeout: 30000, // 30 seconds
  
  // Retry configuration
  retry: 3,
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
};

// Optimized query builder
export function buildOptimizedQuery(
  table: string,
  select: string = '*',
  options: {
    filters?: Record<string, any>;
    orderBy?: string;
    limit?: number;
    offset?: number;
  } = {}
) {
  let query = supabase.from(table).select(select);
  
  // Apply filters
  if (options.filters) {
    Object.entries(options.filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value);
      }
    });
  }
  
  // Apply ordering
  if (options.orderBy) {
    const [column, direction = 'asc'] = options.orderBy.split(':');
    query = query.order(column, { ascending: direction === 'asc' });
  }
  
  // Apply pagination
  if (options.limit) {
    query = query.limit(Math.min(options.limit, queryConfig.maxPageSize));
  }
  
  if (options.offset) {
    query = query.range(options.offset, options.offset + (options.limit || queryConfig.defaultPageSize) - 1);
  }
  
  return query;
}
```

## Performance Configuration

### **Caching Strategy**
```typescript
// src/lib/cache.ts
interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxSize: number; // Maximum cache size
  strategy: 'lru' | 'fifo'; // Eviction strategy
}

class AdvancedCache {
  private cache = new Map<string, { data: any; timestamp: number; hits: number }>();
  private config: CacheConfig;
  
  constructor(config: CacheConfig) {
    this.config = config;
  }
  
  set(key: string, data: any): void {
    if (this.cache.size >= this.config.maxSize) {
      this.evict();
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      hits: 0,
    });
  }
  
  get(key: string): any | null {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    // Check if expired
    if (Date.now() - item.timestamp > this.config.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    // Update hit count
    item.hits++;
    
    return item.data;
  }
  
  private evict(): void {
    if (this.config.strategy === 'lru') {
      // Remove least recently used (lowest hits)
      let lruKey = '';
      let lruHits = Infinity;
      
      for (const [key, item] of this.cache.entries()) {
        if (item.hits < lruHits) {
          lruHits = item.hits;
          lruKey = key;
        }
      }
      
      if (lruKey) this.cache.delete(lruKey);
    } else {
      // FIFO - remove oldest entry
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }
  }
}

export const cache = new AdvancedCache({
  ttl: config.performance.cacheDuration,
  maxSize: 1000,
  strategy: 'lru',
});
```

### **Bundle Optimization**
```typescript
// src/lib/lazyLoading.ts
import { lazy } from 'react';

// Lazy load heavy components
export const LazyDashboard = lazy(() => 
  import('@/pages/Dashboard').then(module => ({ default: module.Dashboard }))
);

export const LazyAnalysis = lazy(() => 
  import('@/pages/Analysis').then(module => ({ default: module.Analysis }))
);

export const LazyReports = lazy(() => 
  import('@/pages/Reports').then(module => ({ default: module.Reports }))
);

// Preload components on hover
export function preloadComponent(componentName: string) {
  switch (componentName) {
    case 'Dashboard':
      import('@/pages/Dashboard');
      break;
    case 'Analysis':
      import('@/pages/Analysis');
      break;
    case 'Reports':
      import('@/pages/Reports');
      break;
  }
}
```

## Security Configuration

### **Content Security Policy**
```typescript
// src/utils/security.ts
export const cspPolicy = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'",
    'https://hiplsgbyxbalukmejxaq.supabase.co',
    'https://www.googletagmanager.com',
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'",
    'https://fonts.googleapis.com',
  ],
  'font-src': [
    "'self'",
    'https://fonts.gstatic.com',
  ],
  'img-src': [
    "'self'",
    'data:',
    'https://hiplsgbyxbalukmejxaq.supabase.co',
  ],
  'connect-src': [
    "'self'",
    'https://hiplsgbyxbalukmejxaq.supabase.co',
    'wss://hiplsgbyxbalukmejxaq.supabase.co',
  ],
  'frame-ancestors': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
};

// Apply CSP via meta tag
export function applyCsp(): void {
  if (!config.features.cspEnabled) return;
  
  const cspString = Object.entries(cspPolicy)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');
    
  const meta = document.createElement('meta');
  meta.httpEquiv = 'Content-Security-Policy';
  meta.content = cspString;
  document.head.appendChild(meta);
}
```

### **API Security**
```typescript
// src/lib/apiSecurity.ts
export class SecureApiClient {
  private requestQueue: Array<() => Promise<any>> = [];
  private activeRequests = 0;
  
  async request(url: string, options: RequestInit = {}): Promise<Response> {
    // Rate limiting
    await this.waitForSlot();
    
    // Add security headers
    const secureOptions: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        ...options.headers,
      },
    };
    
    // Request timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.api.timeout);
    
    try {
      this.activeRequests++;
      
      const response = await fetch(url, {
        ...secureOptions,
        signal: controller.signal,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response;
    } finally {
      clearTimeout(timeoutId);
      this.activeRequests--;
      this.processQueue();
    }
  }
  
  private async waitForSlot(): Promise<void> {
    if (this.activeRequests < config.performance.maxConcurrentRequests) {
      return;
    }
    
    return new Promise((resolve) => {
      this.requestQueue.push(resolve);
    });
  }
  
  private processQueue(): void {
    if (this.requestQueue.length > 0 && this.activeRequests < config.performance.maxConcurrentRequests) {
      const next = this.requestQueue.shift();
      if (next) next();
    }
  }
}
```

## Monitoring Configuration

### **Application Metrics**
```typescript
// src/lib/metrics.ts
class MetricsCollector {
  private metrics: Record<string, number> = {};
  
  increment(metric: string, value = 1): void {
    this.metrics[metric] = (this.metrics[metric] || 0) + value;
  }
  
  timing(metric: string, duration: number): void {
    this.metrics[`${metric}_duration`] = duration;
  }
  
  gauge(metric: string, value: number): void {
    this.metrics[metric] = value;
  }
  
  getMetrics(): Record<string, number> {
    return { ...this.metrics };
  }
  
  reset(): void {
    this.metrics = {};
  }
}

export const metrics = new MetricsCollector();

// Performance monitoring hook
export function usePerformanceMonitoring() {
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        metrics.timing(`performance_${entry.name}`, entry.duration);
      }
    });
    
    observer.observe({ entryTypes: ['measure', 'navigation'] });
    
    return () => observer.disconnect();
  }, []);
}
```

## Testing Configuration

### **Advanced Test Setup**
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
    
    // Mock configuration
    deps: {
      inline: ['@supabase/supabase-js'],
    },
    
    // Test timeout
    testTimeout: 10000,
    hookTimeout: 10000,
  },
  
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@utils': resolve(__dirname, 'src/utils'),
    },
  },
});
```

---

**Ready for advanced configuration?** Start with the sections most relevant to your needs and gradually implement additional optimizations as your application scales.