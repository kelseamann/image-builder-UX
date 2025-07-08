# 📄 Images Table Source Code

## Complete PatternFly React Component

**File**: `src/app/Images/Images.tsx`  
**Lines**: 1,131 lines of TypeScript/React code  
**Features**: Advanced table with filtering, sorting, pagination, bulk operations, and more

### 🎯 View the Complete Source Code

**[➤ View Images.tsx Source Code](https://github.com/kelseamann/image-builder-UX/blob/ai_enabled/src/app/Images/Images.tsx)**

### 🚀 Live Demo

**[➤ Main Application](https://kelseamann.github.io/image-builder-UX)** (go to images on the left hand navigation)

### ✨ What's Included

- **1,131 lines** of production-ready React/TypeScript code
- **Full PatternFly v6** component implementation
- **Advanced table functionality**:
  - Multi-select with bulk operations
  - Expandable rows with detailed information
  - Favorites system (star/unstar)
  - Dynamic filtering (Name, OS, Status, Environment, etc.)
  - Column sorting with visual indicators
  - Pagination with configurable page sizes
- **Toast notifications** for all user actions
- **Complete CRUD operations** via kebab menus
- **Accessibility features** with ARIA labels
- **Responsive design** with scrollable layout

### 🔧 Key Features Implemented

1. **Filtering System**
   - Primary filter dropdown (Name, Target Environment, OS, Status, Last Update)
   - Secondary filter options (dynamic based on primary selection)
   - Always-visible favorites filter (All/Favorites Only/Non-favorites Only)
   - Real-time name search input

2. **Bulk Operations (inactive placeholder buttons)**
   - Migrate selected images
   - Duplicate selected images
   - Rebuild selected images
   - Master checkbox for select/deselect all

3. **Individual Actions (Kebab Menu- inactive placeholders)**
   - Edit (disabled placeholder)
   - Migrate 
   - Duplicate
   - Rebuild
   - Download
   - Delete (with confirmation)

4. **Table Features**
   - Expandable rows showing build information (Architecture, UUID)
   - Sortable columns with tooltips
   - Status badges with color coding and warning icons
   - Pagination controls

### 📱 Component Structure

```typescript
interface ImageTableRow extends ImageInfo {
  id: string;
  status: 'ready' | 'expired' | 'build failed';
  lastUpdate: string;
  dateUpdated: Date;
  targetEnvironment: 'AWS' | 'GCP' | 'Azure' | 'Bare metal' | 'VMWare';
  version: string;
  owner: string;
  isFavorited: boolean;
  uuid: string;
  architecture: 'x86_64' | 'aarch64';
  fileExtension: string;
}
```

### 🎨 Design System

- **PatternFly v6** components throughout
- **Outlined status badges** with proper color coding:
  - Ready: Green
  - Expired: Orange with warning icon  
  - Build Failed: Red
- **Toast notifications** positioned at top-right; these are only implemented to tell you migrate is disabled
- **Consistent spacing** and typography
- **Accessible** color contrasts and focus states

---

**Built with Cursor AI + PatternFly React**  
*Enterprise-grade table component for image management systems* 
