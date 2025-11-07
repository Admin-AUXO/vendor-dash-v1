# Loki

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
4. The site will be available at: `https://Admin-AUXO.github.io/loki/`

## Project Structure

```
├── components/          # React components
│   ├── shared/         # Shared components
│   └── ui/            # UI components
├── styles/            # Global styles
├── .github/           # GitHub Actions workflows
└── public/           # Static assets
```

## Technologies

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Radix UI
- Lucide React Icons

