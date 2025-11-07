# Vendor Dashboard

React application built with Vite, TypeScript, and Tailwind CSS.

## Features

- React 18 with TypeScript
- Vite for fast development and building
- Tailwind CSS for styling
- Radix UI components
- Multiple dashboard views (Overview, Work Orders, Payments, Invoice, Marketplace, Help Desk)

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

This project is automatically deployed to GitHub Pages using GitHub Actions. The deployment workflow runs on every push to the `main` branch.

### Setting up GitHub Pages

1. Go to your repository settings on GitHub
2. Navigate to "Pages" in the left sidebar
3. Under "Source", select "GitHub Actions"
4. The site will be available at: `https://admin-auxo.github.io/vendor-dash/`

## Project Structure

```
├── components/          # React components
│   ├── shared/         # Shared reusable components
│   └── ui/            # UI primitives
├── data/              # Dummy data and generators
│   ├── types.ts       # TypeScript type definitions
│   ├── generators.ts  # Data generation functions
│   └── index.ts       # Main data export
├── docs/              # Documentation
│   ├── NEXT_STEPS.md  # Implementation roadmap
│   ├── VENDOR_DASHBOARD_WIREFRAME_GUIDE.md
│   ├── THEME_DOCUMENTATION.md
│   ├── REUSABLE_COMPONENTS.md
│   └── ...
├── styles/            # Global styles
└── public/           # Static assets
```

## Documentation

- **[Next Steps](./docs/NEXT_STEPS.md)** - Implementation roadmap and next steps
- **[Wireframe Guide](./docs/VENDOR_DASHBOARD_WIREFRAME_GUIDE.md)** - Complete wireframe specifications
- **[Theme Documentation](./docs/THEME_DOCUMENTATION.md)** - Theme system and styling guide
- **[Reusable Components](./docs/REUSABLE_COMPONENTS.md)** - Component library documentation
- **[Data Documentation](./data/README.md)** - Data structure and usage guide

## Technologies

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Radix UI
- Lucide React Icons
- React Icons (FontAwesome, Material, Heroicons)
- TanStack Table (data tables)
- Recharts (charts)
- Date-fns (date utilities)
- React Hook Form + Zod (forms & validation)

## Features

- 📊 **6 Dashboard Screens**: Overview, Work Orders, Invoice, Payments, Marketplace, Help Desk
- 🎨 **Complete Theme System**: Gold/yellow theme (#f7d604) with comprehensive styling
- 🧩 **Reusable Components**: 12+ shared components (DataTable, SearchBar, FilterPanel, etc.)
- 📦 **Dummy Data**: Complete data structure with 11 data models and generators
- 📱 **Desktop-First**: Optimized for desktop use (1920x1080+)
- ♿ **Accessible**: WCAG compliant with keyboard navigation
- 🎯 **Type-Safe**: Full TypeScript support

