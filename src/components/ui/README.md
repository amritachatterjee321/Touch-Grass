# UI Components Library

This directory contains all the available UI components for the TOUCHGRASS application. All components are built using Radix UI primitives and styled with Tailwind CSS.

## 🚀 Quick Start

Import components from the main index file:

```tsx
import { Button, Card, Input, Badge } from './components/ui';
```

## 📚 Available Components

### Basic Components
- **Button** - Various button styles and variants
- **Badge** - Small status indicators
- **Card** - Content containers with header, content, and footer
- **Input** - Text input fields
- **Label** - Form labels
- **Textarea** - Multi-line text input

### Form Components
- **Select** - Dropdown selection component
- **Checkbox** - Checkbox input
- **RadioGroup** - Radio button groups
- **Switch** - Toggle switch
- **Form** - Form handling with validation

### Layout Components
- **Accordion** - Collapsible content sections
- **Tabs** - Tabbed content navigation
- **Sidebar** - Side navigation component
- **NavigationMenu** - Main navigation menu
- **Breadcrumb** - Navigation breadcrumbs
- **Separator** - Visual dividers

### Interactive Components
- **Progress** - Progress bars
- **Slider** - Range slider input
- **Tooltip** - Hover tooltips
- **Popover** - Floating content panels
- **HoverCard** - Hover-activated cards
- **ContextMenu** - Right-click context menus

### Data Display
- **Table** - Data tables
- **Avatar** - User profile images
- **Skeleton** - Loading placeholders
- **Chart** - Data visualization charts

### Feedback Components
- **Alert** - Status messages
- **AlertDialog** - Confirmation dialogs
- **Dialog** - Modal dialogs
- **Sheet** - Slide-out panels
- **Drawer** - Drawer panels
- **Toast** - Notification toasts

### Advanced Components
- **Command** - Command palette interface
- **DropdownMenu** - Dropdown menus
- **Menubar** - Application menu bars
- **Calendar** - Date picker calendar
- **Carousel** - Image/content carousel
- **Resizable** - Resizable panels

## 🎨 Styling

All components use the retro gaming theme defined in `globals.css`:

- **Retro Colors**: Sky blue, light green, pink, yellow, purple
- **Press Start 2P Font**: Authentic retro gaming typography
- **Pixel-Perfect Rendering**: Crisp, retro-style graphics
- **3D Effects**: Outset borders, shadows, and hover animations

## 🔧 Usage Examples

### Basic Button
```tsx
<Button>Click me</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Delete</Button>
```

### Card Layout
```tsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
</Card>
```

### Form Input
```tsx
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="Enter your email" />
</div>
```

### Select Dropdown
```tsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Choose an option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

### Tabs Interface
```tsx
<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content for tab 1</TabsContent>
  <TabsContent value="tab2">Content for tab 2</TabsContent>
</Tabs>
```

## 🎯 Customization

### Adding Custom Variants
```tsx
// In the component file
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        retro: "bg-[#98fb98] text-[#2d2d2d] border-2 border-[#32cd32] hover:bg-[#90ee90]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
```

### Using CSS Variables
```tsx
// Access theme colors
<div className="bg-[var(--retro-primary)] text-[var(--retro-foreground)]">
  Retro styled content
</div>
```

## 📱 Responsive Design

All components are mobile-responsive and include:
- Touch-friendly sizing (minimum 44px touch targets)
- Responsive breakpoints
- Mobile-optimized interactions
- Adaptive layouts

## ♿ Accessibility

Components include:
- ARIA labels and descriptions
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Reduced motion support

## 🚀 Performance

- Lazy loading for heavy components
- Optimized re-renders
- Minimal bundle size impact
- Tree-shaking support

## 🔗 Related Files

- `globals.css` - Global styles and theme variables
- `utils.ts` - Utility functions (cn, clsx)
- `use-mobile.ts` - Mobile detection hook
- `UIDemo.tsx` - Component showcase and examples
