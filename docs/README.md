# Documentation

Essential documentation for the Vendor Dashboard Wireframe.

## 📚 Additional Resources

- **Data Documentation**: `data/README.md` - Data structure and usage
- **Main README**: `README.md` - Project overview

## 📦 Available Components

### Shared Components (20)
- **Navigation**: `Sidebar`, `TopHeader`, `DashboardLayout`, `UserProfile`
- **Data Display**: `StatCard`, `DataTable`, `Timeline`, `WorkOrderCard`
- **Inputs**: `SearchBar`, `FilterSystem`, `FilterSidebar`, `FilterBar`, `AdvancedFilterPanel`, `DateRangePicker`, `FileUpload`
- **Feedback**: `StatusBadge`, `PriorityBadge`, `EmptyState`, `LoadingSpinner`
- **Actions**: `ExportButton`, `AlertDialog`, `Accordion`, `Collapsible`

### UI Primitives (25+)
- **Basic**: `Button`, `Card`, `Input`, `Textarea`, `Badge`, `Label`
- **Forms**: `Select`, `Checkbox`, `RadioGroup`, `Switch`
- **Layout**: `Tabs`, `Dialog`, `Separator`, `ScrollArea`, `Drawer` (Sheet)
- **Feedback**: `Tooltip`, `Progress`, `Avatar`, `Accordion`, `Collapsible`

All components are theme-integrated and ready to use.

## 📊 Data Available

Import from `@/data`:
- `workOrders`, `invoices`, `payments`
- `marketplaceProjects`, `bids`, `supportTickets`
- `clients`, `activities`, `notifications`
- `vendor`, `metrics`
- Helper functions and chart data

## 🎨 Theme System

- **Primary Color**: Gold/Yellow (#f7d604)
- **Typography**: Inter (body) + Space Grotesk (headings)
- **Spacing**: 8px grid system
- **CSS Variables**: Defined in `styles/globals.css`
- **Responsive**: Mobile-first approach with breakpoints

## ✅ Project Status

- ✅ Theme system complete
- ✅ UI primitives ready (25+ components)
- ✅ Shared components ready (20 components)
- ✅ Data structure ready (11 models)
- ✅ Navigation components ready
- ✅ All 6 screen components implemented
- ✅ Data integration complete
- ✅ Filter system with responsive design
- ✅ Charts optimized (bar charts, enhanced line charts)

## 🚀 Features

- **Responsive Filter System**: Mobile drawer + desktop sidebar
- **Advanced Filtering**: Searchable filters with active filter chips
- **Work Order Cards**: Dedicated component for work order display
- **Optimized Charts**: Bar charts instead of pie charts, enhanced line charts with averages
- **Clean Layout**: Page titles in header only, optimized spacing
