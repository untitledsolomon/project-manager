# KanbanFlow Design Guidelines

## Color Palette

### Primary Colors
- **Background (Dark)**: `#1E1E2E` - Deep space blue-black for main background
- **Surface (Dark)**: `#282839` - Slightly lighter surface for cards and containers
- **Accent Primary**: `#7C5DFA` - Vibrant purple for primary actions and highlights
- **Accent Secondary**: `#00C2FF` - Electric blue for secondary elements and accents

### Secondary Colors
- **Success**: `#4ECE3D` - Mint green for success states
- **Warning**: `#FF8F00` - Amber for warnings
- **Danger**: `#FF5252` - Coral red for errors and destructive actions
- **Info**: `#64B5F6` - Sky blue for informational elements

### Text Colors
- **Text Primary**: `#FFFFFF` - White for primary text
- **Text Secondary**: `#B3B3CC` - Soft lavender for secondary text
- **Text Muted**: `#6E6E8F` - Muted purple-gray for less important text

## Typography

- **Primary Font**: 'Inter', sans-serif
- **Heading Font**: 'Poppins', sans-serif
- **Monospace Font**: 'Fira Code', monospace (for code snippets or technical content)

### Font Sizes
- **Heading 1**: 28px (2rem)
- **Heading 2**: 24px (1.714rem)
- **Heading 3**: 20px (1.429rem)
- **Body Text**: 14px (1rem)
- **Small Text**: 12px (0.857rem)

## Layout

### Sidebar
- Fixed width: 260px
- Always visible on desktop, collapsible on mobile
- Contains:
  - User profile summary
  - Navigation to different views
  - Project/board list
  - Quick actions

### Dashboard
- Grid-based layout with responsive cards
- Summary statistics at the top
- Recent boards/projects
- Activity timeline
- Quick access to pinned items

### Board View
- Flexible layout that combines:
  - Structured Kanban columns (like Trello)
  - Optional canvas areas for free-form arrangement (like Milanote)
- Horizontal scrolling for columns
- Zoom controls for canvas areas

## Components

### Cards
- Rounded corners: 8px
- Subtle shadow: `0 4px 6px rgba(0, 0, 0, 0.1)`
- Hover effect: Slight elevation increase and highlight border
- Support for:
  - Color labels
  - Cover images
  - Progress indicators
  - Due dates
  - Attachments indicator

### Buttons
- Primary: Filled with accent color
- Secondary: Outlined with accent color
- Text-only: No background, just text in accent color
- Icon buttons: Circular with hover effect
- All buttons have subtle hover and active states

### Modals
- Centered with dark overlay
- Smooth entrance animation
- Clear header and action buttons
- Escape key and overlay click to dismiss

## Interactions

### Drag and Drop
- Smooth animation during drag
- Visual indicator for drop zones
- Haptic feedback on mobile when dragging

### Transitions
- All transitions: 0.2s ease-in-out
- Page transitions: Subtle fade
- Element entrance: Fade up and in
- Element exit: Fade down and out

## Responsive Behavior

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Adaptations
- Sidebar collapses to bottom navigation
- Single column view with modal for board details
- Larger touch targets (min 44px)
- Swipe gestures for common actions

## Special Features

### Canvas Mode
- Toggle between structured Kanban and free-form canvas
- Grid snapping option
- Connection lines between related items
- Mini-map for large canvases

### Dark Mode
- Default is dark mode
- High contrast option for accessibility
- Careful use of colors to maintain readability

### Visual Customization
- Custom background options
- Ability to change accent colors
- Card and list color coding

## Iconography

- Outlined style icons (Material Design or Phosphor Icons)
- Consistent 24px size
- Use of icon + text for important actions
- Icon-only for secondary actions (with tooltips)

## Accessibility

- Minimum contrast ratio: 4.5:1
- Keyboard navigation support
- Screen reader friendly markup
- Focus indicators for keyboard users 