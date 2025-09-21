# Universal Admin Sidebar Toggle System

A reusable, standalone sidebar toggle solution for admin dashboards. Easy to implement, highly customizable, and works with any CSS framework.

## 🚀 Features

- **Responsive Design** - Works on mobile and desktop
- **Click to Toggle** - Simple click interaction
- **Hover Preview** - Show sidebar on hover when collapsed
- **State Persistence** - Remembers user preference
- **Keyboard Support** - ESC key to close
- **Smooth Animations** - CSS transitions
- **Easy Customization** - Flexible configuration
- **Framework Agnostic** - Works with any CSS framework
- **Zero Dependencies** - Pure JavaScript

## 📦 Installation

1. **Download the file:**
   ```bash
   # Download sidebar-toggle.js to your assets folder
   assets/js/sidebar-toggle.js
   ```

2. **Include in your HTML:**
   ```html
   <script src="assets/js/sidebar-toggle.js"></script>
   ```

3. **Initialize (optional):**
   ```javascript
   // Auto-initializes, but you can customize:
   AdminSidebar.init({
     // Your custom options here
   });
   ```

## 🎯 Basic Usage

### HTML Structure

```html
<div class="min-h-screen flex">
  <!-- Sidebar -->
  <aside id="sidebar" class="fixed inset-y-0 left-0 z-40 w-72 transform bg-white border-r -translate-x-full lg:translate-x-0" data-sidebar-state="expanded">
    <!-- Sidebar content -->
  </aside>

  <!-- Main content -->
  <div id="mainContent" class="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out lg:ml-72">
    <!-- Topbar with toggle buttons -->
    <header class="h-16 flex items-center justify-between px-4 bg-white border-b">
      <div class="flex items-center gap-2">
        <!-- Mobile toggle -->
        <button id="sidebarToggle" class="p-2 lg:hidden rounded-md hover:bg-gray-100">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path fill-rule="evenodd" d="M3.75 5.25a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5H4.5a.75.75 0 0 1-.75-.75Zm0 6a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5H4.5a.75.75 0 0 1-.75-.75Zm0 6a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5H4.5a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd"/>
          </svg>
        </button>
        
        <!-- Desktop toggle -->
        <button id="desktopSidebarToggle" class="hidden lg:flex p-2 rounded-md hover:bg-gray-100">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path fill-rule="evenodd" d="M3.75 5.25a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5H4.5a.75.75 0 0 1-.75-.75Zm0 6a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5H4.5a.75.75 0 0 1-.75-.75Zm0 6a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5H4.5a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>
    </header>
    
    <!-- Main content -->
    <main class="p-6">
      <!-- Your content here -->
    </main>
  </div>
</div>
```

### CSS Requirements

```css
/* Required: Sidebar transitions */
#sidebar {
  transition: transform 0.3s ease-in-out;
}

/* Required: Main content layout */
#mainContent {
  transition: margin-left 0.3s ease-in-out;
}

/* Required: Desktop layout */
@media (min-width: 1024px) {
  #mainContent {
    margin-left: 18rem; /* Adjust based on sidebar width */
  }
  
  #sidebar[data-sidebar-state="collapsed"] ~ #mainContent {
    margin-left: 0 !important;
  }
}
```

## ⚙️ Configuration

### Default Configuration

```javascript
const defaultConfig = {
  // Selectors
  sidebar: '#sidebar',
  mobileToggle: '#sidebarToggle',
  desktopToggle: '#desktopSidebarToggle',
  mainContent: '#mainContent',
  
  // Classes
  sidebarCollapsed: 'lg:-translate-x-full',
  sidebarExpanded: 'lg:translate-x-0',
  hoverSidebar: 'hover-sidebar',
  
  // Data attributes
  stateAttribute: 'data-sidebar-state',
  storageKey: 'admin-sidebar-state',
  
  // Breakpoints
  desktopBreakpoint: 1024,
  
  // Animation
  animationDuration: 300,
  
  // Features
  enableHover: true,
  enablePersistence: true,
  enableKeyboard: true,
  
  // Callbacks
  onToggle: null,
  onExpand: null,
  onCollapse: null
};
```

### Custom Configuration

```javascript
AdminSidebar.init({
  // Custom selectors
  sidebar: '#mySidebar',
  mobileToggle: '#mobileToggle',
  desktopToggle: '#desktopToggle',
  mainContent: '#mainContent',
  
  // Custom classes (for different CSS frameworks)
  sidebarCollapsed: 'sidebar-hidden',
  sidebarExpanded: 'sidebar-visible',
  hoverSidebar: 'sidebar-hover',
  
  // Custom storage key
  storageKey: 'my-app-sidebar-state',
  
  // Custom breakpoint
  desktopBreakpoint: 768,
  
  // Disable features
  enableHover: false,
  enablePersistence: false,
  enableKeyboard: false,
  
  // Custom callbacks
  onToggle: (state) => {
    console.log('Sidebar toggled to:', state);
    // Your custom logic here
  },
  onExpand: () => {
    console.log('Sidebar expanded');
    // Your custom logic here
  },
  onCollapse: () => {
    console.log('Sidebar collapsed');
    // Your custom logic here
  }
});
```

## 🔧 API Methods

### Public Methods

```javascript
// Initialize with custom config
AdminSidebar.init(config);

// Manual control
AdminSidebar.expand();        // Expand sidebar
AdminSidebar.collapse();      // Collapse sidebar
AdminSidebar.toggle();        // Toggle sidebar

// State checking
AdminSidebar.isExpanded();    // Returns true if expanded
AdminSidebar.isCollapsed();   // Returns true if collapsed

// Update configuration
AdminSidebar.updateConfig(newConfig);
```

### Example Usage

```javascript
// Check if sidebar is expanded
if (AdminSidebar.isExpanded()) {
  console.log('Sidebar is currently expanded');
}

// Programmatically toggle
document.getElementById('myButton').addEventListener('click', () => {
  AdminSidebar.toggle();
});

// Custom callback
AdminSidebar.init({
  onToggle: (state) => {
    // Update your UI based on sidebar state
    document.body.classList.toggle('sidebar-expanded', state === 'expanded');
  }
});
```

## 🎨 CSS Framework Support

### Tailwind CSS (Default)

```html
<aside id="sidebar" class="fixed inset-y-0 left-0 z-40 w-72 transform bg-white border-r -translate-x-full lg:translate-x-0">
```

### Bootstrap

```html
<aside id="sidebar" class="position-fixed top-0 start-0 h-100 w-75 bg-white border-end" style="transform: translateX(-100%);">
```

### Custom CSS

```html
<aside id="sidebar" class="sidebar sidebar-hidden">
```

```css
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 18rem;
  background: white;
  border-right: 1px solid #e5e7eb;
  transition: transform 0.3s ease-in-out;
}

.sidebar-hidden {
  transform: translateX(-100%);
}

.sidebar-visible {
  transform: translateX(0);
}
```

## 📱 Responsive Behavior

- **Mobile (< 1024px)**: Sidebar overlays content, toggle shows/hides with overlay
- **Desktop (≥ 1024px)**: Sidebar pushes content, toggle shows/hides with layout adjustment
- **Hover**: On desktop, hover over toggle button to preview sidebar when collapsed

## 🔄 State Management

- **Persistence**: User preference saved to localStorage
- **Default State**: Sidebar expanded by default on desktop
- **State Attribute**: `data-sidebar-state="expanded|collapsed"`
- **Storage Key**: Configurable via `storageKey` option

## 🎯 Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **ES6+ Features**: Uses modern JavaScript
- **No Dependencies**: Pure vanilla JavaScript
- **Mobile Friendly**: Touch-optimized interactions

## 🚀 Quick Start

1. **Copy the HTML structure** from the example
2. **Include the JavaScript file** in your project
3. **Add the required CSS** for transitions
4. **Customize selectors** if needed
5. **Test on mobile and desktop**

## 📝 License

MIT License - Feel free to use in your projects!

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

If you have any questions or need help implementing this system, feel free to reach out!

---

**Happy coding! 🎉**
