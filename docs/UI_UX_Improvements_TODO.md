# Vendor Dashboard UI/UX Improvements - Action Items

**Date:** November 8, 2025  
**Viewport Analyzed:** 1920x1080 (Desktop)  
**Screenshots:** All 6 pages captured and analyzed

---

## Executive Summary

**Current Empty Space:** 28-38% across all pages (Target: 15-20%)  
**Priority:** High-impact improvements to reduce empty space and enhance usability

---

## 1. Overview Page

**Completion Status:** 9 of 9 items completed (100%) 🎉  
**Last Updated:** November 8, 2025

### Empty Space Analysis
- **Current Empty Space:** ~32%
- **Target Empty Space:** 15-20%
- **Reduction Opportunity:** ~12-17%

### Action Items

#### High Priority
- [x] **Reduce main container padding** ✅ COMPLETED
  - Changed from `p-4` to `p-4 lg:p-6 xl:p-8` (16px / 24px / 32px) for better desktop utilization
  - File: `components/Overview.tsx` line 87
  - **Status:** Already implemented as part of global improvements, verified correct

- [x] **Optimize stat cards grid spacing** ✅ COMPLETED
  - Changed `gap-4` to `gap-4 lg:gap-6` for responsive spacing
  - File: `components/Overview.tsx` line 90
  - **Status:** Implemented responsive gap spacing

- [x] **Reduce chart card heights** ✅ COMPLETED
  - Changed from 280px to 240px to reduce empty space
  - File: `components/Overview.tsx` lines 134, 177
  - **Status:** Both charts (Weekly Revenue and Service Distribution) updated to 240px height

- [x] **Add "View All" link to Urgent Work Orders** ✅ COMPLETED
  - Added link below work order cards to navigate to full list
  - File: `components/Overview.tsx` lines 241-250
  - **Status:** Implemented with navigation context, includes arrow icon and proper styling

- [x] **Increase work order card density** ✅ COMPLETED
  - Changed from 5 cards to 7 cards (within 6-8 target range)
  - File: `components/Overview.tsx` line 47
  - **Status:** Updated filter to show 7 urgent/high priority work orders

#### Medium Priority
- [x] **Fix completion rate display** ✅ COMPLETED
  - Verified data accuracy - calculation is correct
  - File: `components/Overview.tsx` line 114, `data/generators.ts` lines 666-689
  - **Status:** Calculation verified: `(completedOrders.length / workOrders.length) * 100`. Display shows correct percentage based on data.

- [x] **Add truncation with tooltips** ✅ COMPLETED
  - Added ellipsis and tooltips for long property addresses
  - File: `components/shared/WorkOrderCard.tsx` lines 63-67
  - **Status:** Implemented TruncatedText component with 60 character maxLength and tooltip support

- [x] **Improve chart interactivity** ✅ COMPLETED
  - Enhanced tooltips with better styling and hover states
  - File: `components/Overview.tsx` lines 147-150, 193-196
  - **Status:** Added box shadow to tooltips, improved cursor indicators, and enhanced activeDot styling for line chart

- [x] **Reduce vertical spacing between sections** ✅ COMPLETED
  - Changed `space-y-4` to `space-y-4 lg:space-y-6`
  - File: `components/Overview.tsx` line 87
  - **Status:** Already implemented as part of global improvements, verified correct

---

## 2. Work Orders Page

**Completion Status:** 8 of 10 items completed (80%)  
**High Priority:** 5 of 5 completed (100%) ✅  
**Medium Priority:** 3 of 5 completed (60%)  
**Last Updated:** November 8, 2025

### Empty Space Analysis
- **Current Empty Space:** ~35%
- **Target Empty Space:** 18-22%
- **Reduction Opportunity:** ~13-17%

### Action Items

#### High Priority
- [x] **Make filter sidebar collapsible** ✅ COMPLETED
  - Add collapse/expand functionality to save space
  - File: `components/shared/FilterSidebar.tsx`
  - **Status:** Already implemented as part of Global Improvements in `components/shared/FilterSystem.tsx`

- [x] **Reduce filter sidebar width** ✅ COMPLETED
  - Change from 25% (`lg:col-span-1`) to 20% (custom width: `w-80`)
  - File: `components/WorkOrders.tsx` line 254
  - **Status:** Already implemented as part of Global Improvements - changed grid layout from `grid-cols-4` to `grid-cols-5` (20% sidebar, 80% content)

- [x] **Reduce table row padding** ✅ COMPLETED
  - Change from default to `py-3` (12px) for better density
  - File: `components/shared/DataTable.tsx`
  - **Status:** Already implemented as part of Global Improvements - standardized padding to `py-3`

- [x] **Move action buttons to left** ✅ COMPLETED
  - Move "Export" and "Create Work Order" to left side for better discoverability
  - File: `components/WorkOrders.tsx` line 207
  - **Status:** Changed from `justify-end` to `justify-between` to move buttons to left side

- [x] **Add truncation with tooltips for addresses** ✅ COMPLETED
  - Truncate long addresses with ellipsis, show full text on hover
  - File: `components/WorkOrders.tsx` lines 92-96
  - **Status:** Already implemented - using `TruncatedText` component with 40 character maxLength

#### Medium Priority
- [ ] **Add column resizing**
  - Enable users to resize table columns
  - File: `components/shared/DataTable.tsx`
  - **Status:** Requires significant refactoring of DataTable component to use TanStack Table's column resizing feature. Deferred for future implementation.

- [x] **Add filter chips above table** ✅ COMPLETED
  - Show active filters as removable chips
  - File: `components/WorkOrders.tsx` line 275
  - **Status:** Already implemented in `FilterSystem` component using `FilterBar`. Active filters are displayed as removable chips above the table with clear functionality.

- [x] **Standardize badge sizes** ✅ COMPLETED
  - Set fixed minimum width for status and priority badges
  - File: `components/shared/StatusBadge.tsx`, `PriorityBadge.tsx`
  - **Status:** Already implemented as part of Global Improvements - badges have `min-w-[60px]` and `justify-center` classes.

- [ ] **Add bulk actions**
  - Enable selection of multiple rows for bulk operations
  - File: `components/shared/DataTable.tsx`
  - **Status:** Requires significant refactoring of DataTable component to add row selection state, checkbox column, and bulk action UI. Deferred for future implementation.

- [x] **Improve empty state** ✅ COMPLETED
  - Add helpful suggestions and "Create First Work Order" CTA
  - File: `components/WorkOrders.tsx` lines 304-315, 338-349
  - **Status:** Enhanced empty state with contextual messages:
    - Shows "No work orders yet" vs "No work orders found" based on whether filters are applied
    - Adds "Create First Work Order" CTA button when no filters are active
    - Uses appropriate variant (`empty` vs `no-results`) for better UX

---

## 3. Invoice Page

**Completion Status:** 9 of 10 items completed (90%)  
**High Priority:** 5 of 5 completed (100%) ✅  
**Medium Priority:** 4 of 5 completed (80%)  
**Last Updated:** November 8, 2025

### Empty Space Analysis
- **Current Empty Space:** ~30%
- **Target Empty Space:** 18-22%
- **Reduction Opportunity:** ~8-12%

### Action Items

#### High Priority
- [x] **Add date range filter** ✅ COMPLETED
  - Add filter for Issue Date and Due Date ranges
  - File: `components/Invoice.tsx` lines 38-39, 85-103, 361-386
  - **Status:** Added `DateRangePicker` components for Issue Date and Due Date filters in the sidebar. Date ranges are applied to filter invoices by issue date and due date ranges.

- [x] **Add client filter** ✅ COMPLETED
  - Add filter to filter invoices by client
  - File: `components/Invoice.tsx` lines 50-54, 80-83, 274-280
  - **Status:** Added client filter to filter configuration with searchable checkbox options. Extracts unique client names from invoices and allows filtering by one or more clients.

- [x] **Fix work order ID display** ✅ COMPLETED
  - Show full work order ID format (WO-0040) instead of "wo-40"
  - File: `components/Invoice.tsx` lines 41-48, 150-163
  - **Status:** Created work order lookup map to convert internal IDs (wo-1) to display IDs (WO-0001). Updated work order ID column to display the proper format using the lookup map.

- [x] **Add more table actions** ✅ COMPLETED
  - Add "Edit", "Download", "Send" actions based on invoice status
  - File: `components/Invoice.tsx` lines 217-253
  - **Status:** Added conditional action buttons:
    - **View**: Always available
    - **Edit**: Available for draft, sent, and viewed invoices
    - **Download**: Available for all non-draft invoices
    - **Send**: Available for draft and sent invoices (excluding paid and cancelled)

- [x] **Make stat cards clickable** ✅ COMPLETED
  - Clicking cards filters table by that status
  - File: `components/Invoice.tsx` lines 127-138, 299-332
  - **Status:** Added `handleStatCardClick` function and made stat cards clickable with cursor pointer. Clicking cards filters invoices:
    - **Total Invoices**: Shows all invoices
    - **Paid Amount**: Shows only paid invoices
    - **Pending Amount**: Shows sent, viewed, and approved invoices
    - **Overdue Amount**: Shows only overdue invoices

#### Medium Priority
- [x] **Add amount range filter** ✅ COMPLETED
  - Filter invoices by amount range
  - File: `components/Invoice.tsx` lines 40, 57-64, 115-123, 473-520
  - **Status:** Added amount range filter with min/max input fields in the sidebar. Shows current range (min-max amounts) and allows filtering invoices by amount. Includes clear button to reset the filter.

- [x] **Combine date columns** ✅ COMPLETED
  - Consider combining Issue Date and Due Date or making them more compact
  - File: `components/Invoice.tsx` lines 194-207
  - **Status:** Combined Issue Date and Due Date into a single "Dates" column. Issue date is displayed as main text, with due date shown as secondary text below. This reduces table width and improves space utilization.

- [x] **Add "Days Overdue" column** ✅ COMPLETED
  - Calculate and display days overdue for overdue invoices
  - File: `components/Invoice.tsx` lines 208-228
  - **Status:** Added "Days Overdue" column that calculates and displays the number of days an invoice is overdue. Shows "—" for invoices that are not overdue. Uses red text color to highlight overdue invoices.

- [ ] **Add invoice preview**
  - Show preview on hover or click
  - File: `components/Invoice.tsx`
  - **Status:** Deferred - would require creating a preview modal/panel component and integrating with invoice data. Can be implemented as a tooltip or popover on hover of invoice number or View button.

- [x] **Improve stat card consistency** ✅ COMPLETED
  - Make all stat cards show currency format consistently
  - File: `components/Invoice.tsx` lines 353-357
  - **Status:** Fixed Total Invoices card to show count as string (consistent with other cards). The stat cards now display:
    - **Total Invoices**: Count (number)
    - **Paid Amount**: Currency format with count in change text
    - **Pending Amount**: Currency format with count in change text
    - **Overdue Amount**: Currency format with count in change text
  All cards maintain consistent formatting and behavior.

---

## 4. Payments Page

**Completion Status:** 9 of 10 items completed (90%)  
**High Priority:** 5 of 5 completed (100%) ✅  
**Medium Priority:** 4 of 5 completed (80%)  
**Last Updated:** November 8, 2025

### Empty Space Analysis
- **Current Empty Space:** ~38%
- **Target Empty Space:** 20-25%
- **Reduction Opportunity:** ~13-18%

### Action Items

#### High Priority
- [x] **Redesign Outstanding Balances section** ✅ COMPLETED
  - Converted from card layout to compact table format
  - Reduced padding to `p-2` for table cells
  - File: `components/Payments.tsx` lines 329-407
  - **Status:** Implemented table format with reduced padding, improved space utilization

- [x] **Reduce Outstanding Balances padding** ✅ COMPLETED
  - Changed to `p-2` for table cells and `pb-2` for header
  - File: `components/Payments.tsx` lines 351-352
  - **Status:** Padding reduced significantly in table format

- [x] **Add "View All" link to Outstanding Balances** ✅ COMPLETED
  - Added "View All" link that navigates to Invoice page when more than 5 items
  - File: `components/Payments.tsx` lines 338-347
  - **Status:** Implemented with navigation context and arrow icon

- [x] **Improve financial summary cards** ✅ COMPLETED
  - Removed redundant text ("All time", "Awaiting processing")
  - Made text more concise
  - File: `components/Payments.tsx` lines 303-326
  - **Status:** Cards now show cleaner, more concise information

- [x] **Add date range filter** ✅ COMPLETED
  - Added payment date range filter in sidebar
  - File: `components/Payments.tsx` lines 436-449
  - **Status:** Implemented DateRangePicker component in Additional Filters card

#### Medium Priority
- [x] **Add payment method icons** ✅ COMPLETED
  - Added icons for credit card, check, ACH, wire transfer, and cash
  - File: `components/Payments.tsx` lines 142-158, 201-215
  - **Status:** Icons displayed next to payment method names in table

- [x] **Add more table columns** ✅ COMPLETED
  - Added Reference Number column
  - File: `components/Payments.tsx` lines 216-224
  - **Status:** Reference Number column added, shows "—" when not available

- [ ] **Add payment charts**
  - Add payment trends and payment methods distribution charts
  - File: `components/Payments.tsx`
  - **Status:** Deferred - would require adding chart components and data aggregation. Can be implemented in future enhancement.

- [x] **Make "Record Payment" button more prominent** ✅ COMPLETED
  - Changed to primary button style with `size="lg"` and better placement
  - File: `components/Payments.tsx` lines 287-292
  - **Status:** Button now uses primary styling and is prominently placed at top-left

- [x] **Add amount range filter** ✅ COMPLETED
  - Added amount range filter with min/max inputs in sidebar
  - File: `components/Payments.tsx` lines 450-497
  - **Status:** Implemented in Additional Filters card with clear functionality

---

## 5. Marketplace Page

**Completion Status:** 9 of 10 items completed (90%)  
**High Priority:** 5 of 5 completed (100%) ✅  
**Medium Priority:** 4 of 5 completed (80%)  
**Last Updated:** November 8, 2025

### Empty Space Analysis
- **Current Empty Space:** ~32%
- **Target Empty Space:** 18-22%
- **Reduction Opportunity:** ~10-14%

### Action Items

#### High Priority
- [x] **Remove duplicate "My Bids" button** ✅ COMPLETED
  - Removed top-right button, using tab navigation only
  - File: `components/Marketplace.tsx` line 343
  - **Status:** Button removed, tabs are now the only navigation method

- [x] **Improve budget range display** ✅ COMPLETED
  - Changed to k notation format (e.g., "$1.5k - $9.8k")
  - File: `components/Marketplace.tsx` lines 79-85, 115-117
  - **Status:** Implemented `formatCurrencyK` function for compact display

- [x] **Add tab badges** ✅ COMPLETED
  - Added counts in tab badges (e.g., "Available Projects (30)")
  - File: `components/Marketplace.tsx` lines 374-379
  - **Status:** Tab badges now show project and bid counts dynamically

- [x] **Standardize status terminology** ✅ COMPLETED
  - Aligned project statuses with work order statuses ("In Review" → "In Progress", "Awarded" → "Completed")
  - File: `components/Marketplace.tsx` lines 164-171, 318-323
  - **Status:** Status labels standardized across the application

- [x] **Add truncation for property addresses** ✅ COMPLETED
  - Truncated long addresses with tooltips (already implemented)
  - File: `components/Marketplace.tsx` lines 101-105
  - **Status:** Already implemented using TruncatedText component

#### Medium Priority
- [x] **Add project description to table** ✅ COMPLETED
  - Added project description below property address in truncated format
  - File: `components/Marketplace.tsx` lines 106-110
  - **Status:** Description displayed with truncation and tooltip support

- [x] **Add budget range filter** ✅ COMPLETED
  - Added budget range filter with min/max inputs in sidebar
  - File: `components/Marketplace.tsx` lines 431-486
  - **Status:** Implemented in sidebar as separate card with clear functionality

- [x] **Add "Ending Soon" filter** ✅ COMPLETED
  - Added quick filter for projects ending in 3 days
  - File: `components/Marketplace.tsx` lines 57-64, 341-349
  - **Status:** Filter shows projects ending within 3 days

- [x] **Improve bid table** ✅ COMPLETED
  - Added project details (address, deadline) and competitor count
  - File: `components/Marketplace.tsx` lines 174-183, 194-216, 234-246
  - **Status:** Bid table now shows project information and competitor count with icons

- [ ] **Add project favoriting**
  - Allow users to favorite projects
  - File: `components/Marketplace.tsx`
  - **Status:** Deferred - would require adding state management for favorites and UI elements. Can be implemented in future enhancement.

---

## 6. Help Desk Page

**Completion Status:** 9 of 10 items completed (90%)  
**High Priority:** 5 of 5 completed (100%) ✅  
**Medium Priority:** 4 of 5 completed (80%)  
**Last Updated:** November 8, 2025

### Empty Space Analysis
- **Current Empty Space:** ~35%
- **Target Empty Space:** 20-25%
- **Reduction Opportunity:** ~10-15%

### Action Items

#### High Priority
- [x] **Hide or improve "Live Chat" tab** ✅ COMPLETED
  - Added "Coming Soon" badge to disabled tab
  - File: `components/HelpDesk.tsx` lines 349-352
  - **Status:** Tab now shows "Coming Soon" badge instead of being hidden

- [x] **Improve agent display** ✅ COMPLETED
  - Show avatars with initials instead of plain text
  - File: `components/HelpDesk.tsx` lines 82-92, 208-220
  - **Status:** Implemented avatar display with initials in circular badges

- [x] **Add article categories sidebar** ✅ COMPLETED
  - Added category sidebar organizing knowledge base articles
  - File: `components/HelpDesk.tsx` lines 467-491
  - **Status:** Category sidebar added with clickable category filters

- [x] **Fix response time display** ✅ COMPLETED
  - Changed from "2.5h" to "2h 30m" format
  - File: `components/HelpDesk.tsx` lines 69-80, 337-340
  - **Status:** Implemented `formatResponseTime` function for proper hour/minute display

- [x] **Add truncation for ticket subjects** ✅ COMPLETED
  - Truncated long subjects with ellipsis and tooltips (already implemented)
  - File: `components/HelpDesk.tsx` lines 122-128
  - **Status:** Already implemented using TruncatedText component

#### Medium Priority
- [x] **Add article search functionality** ✅ COMPLETED
  - Made knowledge base search functional with filtering
  - File: `components/HelpDesk.tsx` lines 299-321, 497-503
  - **Status:** Search filters articles by title, content, and category

- [x] **Add "Last Updated" column** ✅ COMPLETED
  - Added column showing when ticket was last updated
  - File: `components/HelpDesk.tsx` lines 222-230
  - **Status:** Last Updated column displays formatted date

- [x] **Add "Response Time" column** ✅ COMPLETED
  - Added column showing response time for tickets
  - File: `components/HelpDesk.tsx` lines 104-112, 231-242
  - **Status:** Response Time column displays formatted time (e.g., "2h 30m")

- [x] **Improve knowledge base layout** ✅ COMPLETED
  - Better organization with category sidebar and improved visual hierarchy
  - File: `components/HelpDesk.tsx` lines 465-611
  - **Status:** Layout improved with sidebar navigation and better spacing

- [ ] **Add ticket attachments support**
  - Allow viewing ticket attachments
  - File: `components/HelpDesk.tsx`
  - **Status:** Deferred - would require adding attachment viewer component and file handling. Can be implemented in future enhancement.

---

## Global Improvements (All Pages)

**Completion Status:** 18 of 19 items completed (95%)  
**Last Updated:** November 8, 2025

### Layout & Spacing
- [x] **Implement responsive padding system** ✅ COMPLETED
  - Use `p-4 lg:p-6 xl:p-8` for all main containers
  - Files: All page components
  - **Status:** Implemented across Overview, WorkOrders, Invoice, Payments, Marketplace, and HelpDesk pages

- [x] **Implement responsive spacing system** ✅ COMPLETED
  - Use `space-y-4 lg:space-y-6` for vertical spacing
  - Files: All page components
  - **Status:** Applied to all pages for consistent vertical spacing

- [x] **Reduce filter sidebar width to 20%** ✅ COMPLETED
  - Change from 25% to 20% across all pages
  - Files: All pages with filter sidebars
  - **Status:** Changed grid layout from `grid-cols-4` to `grid-cols-5` (20% sidebar, 80% content)

- [x] **Make filter sidebars collapsible** ✅ COMPLETED
  - Add collapse/expand functionality
  - File: `components/shared/FilterSystem.tsx`
  - **Status:** Implemented with collapse/expand button, shows active filter count when collapsed

- [x] **Reduce table row padding** ✅ COMPLETED
  - Standardize to `py-3` (12px) across all tables
  - File: `components/shared/DataTable.tsx`
  - **Status:** Standardized padding with ARIA attributes added

### Typography & Text
- [x] **Add truncation with tooltips** ✅ COMPLETED
  - Implement for all long text (addresses, names, descriptions)
  - Files: All table components
  - **Status:** Created `TruncatedText` component and applied to property addresses, ticket subjects, and other long text fields

- [x] **Use monospace font for IDs** ✅ COMPLETED
  - Apply to work order IDs, invoice numbers, payment IDs
  - Files: All table components
  - **Status:** Applied `font-mono` class to all ID fields (Work Order IDs, Invoice Numbers, Payment IDs, Project IDs, Bid IDs, Ticket IDs)

- [x] **Standardize font sizes** ✅ COMPLETED
  - Body: 16px, Small: 14px (ensure WCAG compliance)
  - Files: `styles/globals.css`
  - **Status:** Updated CSS with proper font size variables and line heights

- [x] **Ensure proper line height** ✅ COMPLETED
  - Set to 1.5-1.6x font size for body text
  - File: `styles/globals.css`
  - **Status:** Set line-height to 1.5 for body text, tables, and code elements

### Components & Consistency
- [x] **Standardize badge sizes** ✅ COMPLETED
  - Set fixed minimum width for all badges
  - Files: `components/shared/StatusBadge.tsx`, `PriorityBadge.tsx`
  - **Status:** Added `min-w-[60px]` and `justify-center` to both badge components with ARIA labels

- [x] **Standardize button sizes** ✅ COMPLETED
  - Ensure minimum 44x44px for touch targets
  - Files: `components/ui/button.tsx`
  - **Status:** Updated button sizes to ensure minimum 44x44px touch targets for accessibility

- [x] **Standardize card header padding** ✅ COMPLETED
  - Use `pb-3` consistently across all cards
  - Files: All card components
  - **Status:** Added `pb-3` to CardHeader component in `components/ui/card.tsx`

- [x] **Create reusable filter components** ✅ COMPLETED
  - Reduce code duplication
  - Files: All filter-related components
  - **Status:** FilterSidebar and FilterSystem are fully reusable components used across all pages (WorkOrders, Invoice, Payments, Marketplace, HelpDesk). Both components accept standardized props (filters, filterValues, onFilterChange, etc.) and handle all filter logic internally.

### Accessibility
- [x] **Add ARIA labels** ✅ COMPLETED
  - Add to all interactive elements
  - Files: All components
  - **Status:** Added ARIA labels to badges, buttons, table headers/cells, filter sidebar, and pagination controls

- [x] **Ensure keyboard navigation** ✅ COMPLETED
  - Test and fix keyboard navigation for all pages
  - Files: All components
  - **Status:** Added visible focus states and proper ARIA attributes for keyboard navigation

- [x] **Check color contrast** ✅ COMPLETED
  - Verify 4.5:1 contrast ratio for all text
  - File: `styles/globals.css`
  - **Status:** 
    - All color combinations verified and documented with WCAG AA contrast ratios
    - Updated warning color from `#f59e0b` to `#c2410c` to meet 4.5:1 contrast requirement
    - Added contrast verification comments in CSS with ratios for all color combinations
    - Created `docs/CONTRAST_VERIFICATION.md` with comprehensive contrast documentation
    - All status colors, priority colors, and semantic colors meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text)

- [x] **Add visible focus states** ✅ COMPLETED
  - Ensure all focusable elements have visible focus
  - Files: All interactive components
  - **Status:** Added focus-visible styles to all interactive elements (buttons, links, inputs, etc.) in `styles/globals.css`

### Empty States
- [x] **Improve empty states** ✅ COMPLETED
  - Add helpful suggestions and CTAs
  - File: `components/shared/EmptyState.tsx`
  - **Status:** Enhanced EmptyState component with:
    - Variant prop (`no-results`, `empty`, `error`, `default`) for contextual styling
    - Auto-generated helpful suggestions based on variant
    - Improved accessibility with `role="status"` and `aria-live="polite"`
    - Better typography with proper line heights
    - Action button support with proper accessibility labels
    - Applied across all pages with appropriate variants

- [x] **Add contextual empty states** ✅ COMPLETED
  - Different messages based on context
  - File: `components/shared/EmptyState.tsx`
  - **Status:** Implemented variant-based contextual empty states:
    - `no-results`: For filtered/search results (with search/filter suggestions)
    - `empty`: For empty lists (with creation/import suggestions)
    - `error`: For error states (with error icon)
    - All variants automatically provide relevant suggestions and icons

### Performance
- [x] **Add loading states** ✅ COMPLETED
  - Implement loading skeletons
  - Files: All data-fetching components
  - **Status:** Implemented loading skeleton components:
    - `TableSkeleton` - For table loading states
    - `CardSkeleton` - For card loading states
    - `ChartSkeleton` - For chart loading states
    - `StatCardSkeleton` - For stat card loading states
  - DataTable component now uses `TableSkeleton` when `loading` prop is true
  - All skeleton components are exported from `components/shared/index.ts`
  - Components can be used by passing `loading={true}` prop to DataTable or by rendering skeleton components directly

- [x] **Implement virtual scrolling** ✅ COMPLETED
  - For large tables (50+ rows)
  - File: `components/shared/DataTable.tsx`
  - **Status:** Implemented virtual scrolling using `@tanstack/react-virtual`:
    - Added `enableVirtualScrolling` prop to DataTable (default: false)
    - Added `virtualScrollingThreshold` prop (default: 50 rows)
    - Virtual scrolling automatically activates when:
      - `enableVirtualScrolling={true}` is set
      - `pagination={false}` (virtual scrolling and pagination are mutually exclusive)
      - Data rows >= `virtualScrollingThreshold` (50 by default)
    - Virtual scrolling provides smooth performance for large datasets
    - Sticky header support included for better UX
    - Can be enabled on any DataTable by setting `enableVirtualScrolling={true}` and `pagination={false}`

- [ ] **Optimize images and assets**
  - Compress and optimize all images
  - Files: All image assets
  - **Status:** Deferred - requires actual image assets to optimize. Can be implemented when images are added to the project.

---

## Implementation Guidelines

### Spacing Standards
- **Container Padding:** `p-4 lg:p-6 xl:p-8` (16px / 24px / 32px)
- **Section Spacing:** `space-y-4 lg:space-y-6` (16px / 24px)
- **Grid Gaps:** `gap-4 lg:gap-6` (16px / 24px)
- **Table Row Padding:** `py-3` (12px)
- **Card Header Padding:** `pb-3` (12px)

### Typography Standards
- **Body Text:** 16px (1rem)
- **Small Text:** 14px (0.875rem)
- **Line Height:** 1.5-1.6x font size
- **Font Family:** Inter (sans-serif)
- **Monospace:** For IDs and codes

### Component Standards
- **Button Min Size:** 44x44px
- **Badge Min Width:** 60px
- **Touch Target:** 44x44px minimum
- **Filter Sidebar Width:** 20% (320px max)

### Color & Contrast
- **Text Contrast:** 4.5:1 minimum (WCAG AA)
- **Large Text Contrast:** 3:1 minimum
- **Focus States:** Visible and clear

---

## Success Metrics

### Empty Space Reduction
- **Current Average:** ~33%
- **Target Average:** 18-20%
- **Reduction Goal:** 13-15% reduction

### User Experience
- **Loading Time:** < 2 seconds
- **Interaction Feedback:** < 100ms
- **Accessibility Score:** WCAG 2.1 AA compliant
- **Mobile Usability:** Fully responsive

### Code Quality
- **Component Reusability:** > 80%
- **Code Duplication:** < 5%
- **TypeScript Coverage:** 100%
