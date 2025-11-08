import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: '/vendor-dash-v1/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Split React and React DOM into a separate chunk
          if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
            return 'vendor-react';
          }
          
          // Split PDF libraries (heavy, rarely used)
          if (id.includes('@react-pdf') || id.includes('react-pdf')) {
            return 'vendor-pdf';
          }
          
          // Split Tiptap editor (heavy, rarely used)
          if (id.includes('@tiptap')) {
            return 'vendor-editor';
          }
          
          // Split Recharts (charting library) into a separate chunk
          if (id.includes('recharts')) {
            return 'vendor-charts';
          }
          
          // Split TanStack Table (table library)
          if (id.includes('@tanstack/react-table') || id.includes('@tanstack/react-virtual')) {
            return 'vendor-table';
          }
          
          // Split Excel/CSV libraries (only used for exports, dynamically imported)
          // Note: xlsx is dynamically imported, but Vite may still bundle it
          // if it's imported anywhere statically. We'll keep it separate.
          if (id.includes('xlsx') || id.includes('papaparse')) {
            return 'vendor-export';
          }
          
          // Note: Faker has been removed - data is now pre-generated as JSON files
          
          // Split date-fns (used frequently but can be separate)
          if (id.includes('date-fns')) {
            return 'vendor-dates';
          }
          
          // Split Radix UI components into a separate chunk
          if (id.includes('@radix-ui')) {
            return 'vendor-radix';
          }
          
          // Split other UI libraries into a separate chunk
          if (
            id.includes('lucide-react') ||
            id.includes('cmdk') ||
            id.includes('vaul') ||
            id.includes('sonner') ||
            id.includes('embla-carousel-react') ||
            id.includes('react-day-picker') ||
            id.includes('react-datepicker') ||
            id.includes('react-date-range') ||
            id.includes('react-resizable-panels') ||
            id.includes('react-hook-form') ||
            id.includes('react-dropzone') ||
            id.includes('react-vertical-timeline-component') ||
            id.includes('input-otp') ||
            id.includes('class-variance-authority') ||
            id.includes('clsx') ||
            id.includes('tailwind-merge') ||
            id.includes('currency.js') ||
            id.includes('fuse.js') ||
            id.includes('use-debounce') ||
            id.includes('zod')
          ) {
            return 'vendor-ui';
          }
          
          // Split remaining node_modules into vendor chunk
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
    },
    // Ensure React is deduped to prevent multiple instances
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    // Ensure React is properly resolved and optimized
    include: ['react', 'react-dom'],
  },
}))

