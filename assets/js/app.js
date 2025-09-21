// S Admin Dashboard - Main JavaScript File
window.Dashboard = {
    // Initialize all components
    init: function() {
      this.initSidebarToggle();
      this.initThemeToggle();
      this.initYear();
      this.initChart();
      this.initSearch();
      this.initNotifications();
      this.initMessages();
      this.initResponsive();
      this.initSmartMenu();
      this.initPageAnimations();
    },

    // Sidebar toggle functionality
    initSidebarToggle: function() {
      const sidebar = document.getElementById('sidebar');
      const mobileToggle = document.getElementById('sidebarToggle');
      const desktopToggle = document.getElementById('desktopSidebarToggle');
      const overlay = this.createOverlay();

      if (!sidebar) {
        console.error('Sidebar element not found');
        return;
      }

      // Mobile toggle (hamburger menu)
      if (mobileToggle) {
        mobileToggle.addEventListener('click', (e) => {
          e.preventDefault();
          console.log('Mobile toggle clicked');
          this.toggleMobileSidebar(sidebar, overlay);
        });
      } else {
        console.log('Mobile toggle not found');
      }

      // Desktop toggle
      if (desktopToggle) {
        desktopToggle.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('Desktop toggle clicked');
          this.toggleDesktopSidebar(sidebar);
        });

        // Add hover functionality for desktop toggle
        this.addDesktopHoverFunctionality(desktopToggle, sidebar);
      } else {
        console.log('Desktop toggle not found');
      }

      // Close sidebar when clicking overlay (mobile only)
      overlay.addEventListener('click', () => {
        this.closeMobileSidebar(sidebar, overlay);
      });

      // Close sidebar when clicking outside (mobile and tablet only)
      document.addEventListener('click', (e) => {
        // Skip if sidebar was just opened
        if (this._sidebarJustOpened) return;
        
        // Only apply outside click behavior on mobile and tablet (below lg breakpoint)
        if (window.innerWidth >= 1024) return;
        
        const isSidebar = sidebar.contains(e.target);
        const isMobileToggle = mobileToggle && mobileToggle.contains(e.target);
        const isOverlay = overlay && overlay.contains(e.target);
        
        // Don't close if clicking on sidebar, mobile toggle, or overlay
        if (!isSidebar && !isMobileToggle && !isOverlay) {
          // Mobile/Tablet: close if sidebar is open
          if (sidebar.classList.contains('translate-x-0')) {
            this.closeMobileSidebar(sidebar, overlay);
          }
        }
      });

      // Close sidebar on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          if (window.innerWidth < 1024) {
            this.closeMobileSidebar(sidebar, overlay);
          } else {
            this.collapseDesktopSidebar(sidebar);
          }
        }
      });

      // Initialize sidebar state
      this.initializeSidebarState(sidebar);
    },

    // Create overlay for mobile sidebar
    createOverlay: function() {
      const overlay = document.createElement('div');
      overlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden hidden';
      overlay.id = 'sidebar-overlay';
      document.body.appendChild(overlay);
      return overlay;
    },

    // Initialize sidebar state
    initializeSidebarState: function(sidebar) {
      const savedState = localStorage.getItem('sadmin-sidebar-state');
      if (window.innerWidth >= 1024) { // Desktop
        // Default to expanded if no saved state
        if (savedState === 'collapsed') {
          this.collapseDesktopSidebar(sidebar);
        } else {
          // Default to expanded state - ensure it's visible on desktop
          sidebar.classList.remove('-translate-x-full', 'lg:-translate-x-full');
          sidebar.classList.add('lg:translate-x-0');
          sidebar.setAttribute('data-sidebar-state', 'expanded');
          sidebar.style.transform = 'translateX(0)';
          this.updateMainContentLayout(false);
          this.updateDesktopToggleIcon(true);
        }
      } else { // Mobile/Tablet
        // Mobile sidebar starts closed - force hidden state
        sidebar.classList.add('-translate-x-full');
        sidebar.classList.remove('translate-x-0', 'lg:translate-x-0');
        sidebar.setAttribute('data-sidebar-state', 'collapsed');
        sidebar.style.transform = 'translateX(-100%)';
        this.updateMainContentLayout(false); // Mobile doesn't need layout adjustment
      }
    },

    // Mobile sidebar methods
    toggleMobileSidebar: function(sidebar, overlay) {
      const isOpen = sidebar.classList.contains('translate-x-0');
      
      if (isOpen) {
        this.closeMobileSidebar(sidebar, overlay);
      } else {
        this.openMobileSidebar(sidebar, overlay);
        // Prevent immediate closing when opening
        setTimeout(() => {
          this._sidebarJustOpened = false;
        }, 100);
      }
    },

    openMobileSidebar: function(sidebar, overlay) {
      // Remove all translate classes and add the mobile show class
      sidebar.classList.remove('-translate-x-full', 'lg:-translate-x-full', 'lg:translate-x-0');
      sidebar.classList.add('translate-x-0');
      // Force the transform to ensure it shows on mobile
      sidebar.style.transform = 'translateX(0)';
      overlay.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
      this._sidebarJustOpened = true;
    },

    closeMobileSidebar: function(sidebar, overlay) {
      // Remove show class and add hide class
      sidebar.classList.remove('translate-x-0');
      sidebar.classList.add('-translate-x-full');
      // Force the transform to ensure it hides on mobile
      sidebar.style.transform = 'translateX(-100%)';
      overlay.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    },

    // Desktop sidebar methods
    toggleDesktopSidebar: function(sidebar) {
      // Check if sidebar is currently expanded by looking at data-sidebar-state
      const isExpanded = sidebar.getAttribute('data-sidebar-state') === 'expanded';
      
      // Remove hover class when toggling
      sidebar.classList.remove('hover-sidebar');
      
      if (isExpanded) {
        this.collapseDesktopSidebar(sidebar);
      } else {
        this.expandDesktopSidebar(sidebar);
      }
    },

    expandDesktopSidebar: function(sidebar) {
      // Clear any hover state
      sidebar.classList.remove('hover-sidebar');
      
      // Force show the sidebar
      sidebar.classList.remove('lg:-translate-x-full');
      sidebar.classList.add('lg:translate-x-0');
      sidebar.setAttribute('data-sidebar-state', 'expanded');
      
      // Force transform to ensure it's visible
      if (window.innerWidth >= 1024) {
        sidebar.style.transform = 'translateX(0)';
      }
      
      localStorage.setItem('sadmin-sidebar-state', 'expanded');
      this.updateDesktopToggleIcon(true);
      this.updateMainContentLayout(false);
    },

    collapseDesktopSidebar: function(sidebar) {
      // Clear any hover state
      sidebar.classList.remove('hover-sidebar');
      
      // Force hide the sidebar completely
      sidebar.classList.add('lg:-translate-x-full');
      sidebar.classList.remove('lg:translate-x-0');
      sidebar.setAttribute('data-sidebar-state', 'collapsed');
      
      // Force transform to ensure it's hidden
      if (window.innerWidth >= 1024) {
        sidebar.style.transform = 'translateX(-100%)';
      }
      
      localStorage.setItem('sadmin-sidebar-state', 'collapsed');
      this.updateDesktopToggleIcon(false);
      this.updateMainContentLayout(true);
    },

    // Update main content layout based on sidebar state
    updateMainContentLayout: function(isCollapsed) {
      const mainContent = document.getElementById('mainContent');
      if (!mainContent) return;

      if (isCollapsed) {
        // When sidebar is collapsed, main content takes full width
        mainContent.classList.remove('lg:ml-72');
        mainContent.classList.add('lg:ml-0');
      } else {
        // When sidebar is expanded, main content has margin for sidebar
        mainContent.classList.remove('lg:ml-0');
        mainContent.classList.add('lg:ml-72');
      }
    },

    // Add desktop hover functionality
    addDesktopHoverFunctionality: function(desktopToggle, sidebar) {
      let hoverTimeout;
      let isHovering = false;
      let isPermanentlyExpanded = false;

      // Show sidebar on hover (only when collapsed and not permanently expanded)
      desktopToggle.addEventListener('mouseenter', () => {
        if (window.innerWidth >= 1024) { // Only on desktop
          const isCollapsed = sidebar.classList.contains('lg:-translate-x-full');
          const isHoverSidebar = sidebar.classList.contains('hover-sidebar');
          
          if (isCollapsed && !isPermanentlyExpanded && !isHoverSidebar) {
            isHovering = true;
            this.showSidebarOnHover(sidebar);
          }
        }
      });

      // Hide sidebar when mouse leaves (only if it was shown by hover)
      desktopToggle.addEventListener('mouseleave', () => {
        if (window.innerWidth >= 1024) { // Only on desktop
          const isHoverSidebar = sidebar.classList.contains('hover-sidebar');
          if (isHoverSidebar && isHovering && !isPermanentlyExpanded) {
            isHovering = false;
            hoverTimeout = setTimeout(() => {
              this.hideSidebarOnHover(sidebar);
            }, 300); // 300ms delay before hiding
          }
        }
      });

      // Also add hover to sidebar itself to keep it open
      sidebar.addEventListener('mouseenter', () => {
        if (window.innerWidth >= 1024 && isHovering) {
          clearTimeout(hoverTimeout);
        }
      });

      sidebar.addEventListener('mouseleave', () => {
        if (window.innerWidth >= 1024 && isHovering && !isPermanentlyExpanded) {
          isHovering = false;
          this.hideSidebarOnHover(sidebar);
        }
      });

      // Track when sidebar is permanently expanded/collapsed
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'data-sidebar-state') {
            const state = sidebar.getAttribute('data-sidebar-state');
            isPermanentlyExpanded = (state === 'expanded');
            
            // Clear hover state when permanently toggled
            if (isPermanentlyExpanded) {
              sidebar.classList.remove('hover-sidebar');
              isHovering = false;
              clearTimeout(hoverTimeout);
            }
          }
        });
      });
      
      observer.observe(sidebar, { attributes: true });
    },

    // Show sidebar on hover
    showSidebarOnHover: function(sidebar) {
      sidebar.classList.remove('lg:-translate-x-full');
      sidebar.classList.add('lg:translate-x-0');
      sidebar.classList.add('hover-sidebar');
    },

    // Hide sidebar after hover
    hideSidebarOnHover: function(sidebar) {
      sidebar.classList.add('lg:-translate-x-full');
      sidebar.classList.remove('lg:translate-x-0');
      sidebar.classList.remove('hover-sidebar');
    },

    // Update desktop toggle button icon
    updateDesktopToggleIcon: function(isExpanded) {
      const desktopToggle = document.getElementById('desktopSidebarToggle');
      if (!desktopToggle) return;

      const icon = desktopToggle.querySelector('svg');
      if (!icon) return;

      if (isExpanded) {
        // Show collapse icon (X or close)
        icon.innerHTML = '<path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"/>';
      } else {
        // Show expand icon (hamburger)
        icon.innerHTML = '<path fill-rule="evenodd" d="M3.75 5.25a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5H4.5a.75.75 0 0 1-.75-.75Zm0 6a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5H4.5a.75.75 0 0 1-.75-.75Zm0 6a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5H4.5a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd"/>';
      }
    },

    // Theme toggle functionality
    initThemeToggle: function() {
      const toggle = document.getElementById('themeToggle');
      const root = document.documentElement;
      const storageKey = 'theme';

      if (!toggle) return;

      // Apply theme
      const applyTheme = (theme) => {
        if (theme === 'dark') {
          root.classList.add('dark');
          toggle.textContent = '☀️';
        } else {
          root.classList.remove('dark');
          toggle.textContent = '🌙';
        }
      };

      // Get saved theme or default to system preference
      const getTheme = () => {
        const saved = localStorage.getItem(storageKey);
        if (saved) return saved;
        
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return prefersDark ? 'dark' : 'light';
      };

      // Initialize theme
      const currentTheme = getTheme();
      applyTheme(currentTheme);

      // Toggle theme on click
      toggle.addEventListener('click', () => {
        const currentTheme = getTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem(storageKey, newTheme);
        applyTheme(newTheme);
      });

      // Listen for system theme changes
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem(storageKey)) {
          applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    },

    // Initialize year display
    initYear: function() {
      const yearElement = document.getElementById('year');
      if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
      }
    },

    // Initialize Chart.js
    initChart: function() {
      const ctx = document.getElementById('revenueChart');
      if (!ctx || !window.Chart) return;

      // Chart data
      const chartData = {
        7: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          data: [3200, 4500, 3800, 5200, 6100, 7400, 6900]
        },
        30: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          data: [18500, 22100, 19800, 25600]
        },
        90: {
          labels: ['Jan', 'Feb', 'Mar'],
          data: [85000, 92000, 88000]
        },
        365: {
          labels: ['Q1', 'Q2', 'Q3', 'Q4'],
          data: [265000, 298000, 312000, 345000]
        }
      };

      // Create chart
      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: chartData[7].labels,
          datasets: [{
            label: 'Revenue',
            data: chartData[7].data,
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: '#6366f1',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            intersect: false,
            mode: 'index'
          },
          scales: {
            x: {
              grid: {
                display: false
              },
              ticks: {
                color: '#6b7280'
              }
            },
            y: {
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              },
              ticks: {
                color: '#6b7280',
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleColor: '#ffffff',
              bodyColor: '#ffffff',
              borderColor: '#6366f1',
              borderWidth: 1,
              callbacks: {
                label: function(context) {
                  return 'Revenue: $' + context.parsed.y.toLocaleString();
                }
              }
            }
          }
        }
      });

      // Chart period selector
      const periodSelect = document.getElementById('chartPeriod');
      if (periodSelect) {
        periodSelect.addEventListener('change', (e) => {
          const period = parseInt(e.target.value);
          const data = chartData[period];
          if (data) {
            chart.data.labels = data.labels;
            chart.data.datasets[0].data = data.data;
            chart.update('active');
          }
        });
      }
    },

    // Search functionality
    initSearch: function() {
      const searchInput = document.querySelector('input[placeholder="Search..."]');
      if (!searchInput) return;

      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        // Add search functionality here
        console.log('Searching for:', query);
      });

      // Search on Enter key
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const query = e.target.value;
          if (query.trim()) {
            console.log('Performing search for:', query);
            // Implement search logic here
          }
        }
      });
    },

    // Notifications functionality
    initNotifications: function() {
      const notificationBtn = document.querySelector('button[aria-label="Notifications"]');
      const notificationCard = document.querySelector('.notification-card');
      if (!notificationBtn || !notificationCard) return;

      notificationBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleNotificationCard(notificationCard);
      });

      // Close notification card when clicking outside
      document.addEventListener('click', (e) => {
        if (!notificationBtn.contains(e.target) && !notificationCard.contains(e.target)) {
          this.closeNotificationCard(notificationCard);
        }
      });
    },

    // Toggle notification card
    toggleNotificationCard: function(card) {
      // Close message card if it's open
      const messageCard = document.querySelector('.message-card');
      if (messageCard && !messageCard.classList.contains('opacity-0')) {
        this.closeMessageCard(messageCard);
      }
      
      if (card.classList.contains('opacity-0')) {
        this.showNotificationCard(card);
      } else {
        this.closeNotificationCard(card);
      }
    },

    // Show notification card
    showNotificationCard: function(card) {
      card.classList.remove('opacity-0', 'invisible');
      card.classList.add('opacity-100', 'visible');
    },

    // Close notification card
    closeNotificationCard: function(card) {
      card.classList.remove('opacity-100', 'visible');
      card.classList.add('opacity-0', 'invisible');
    },

    // Messages functionality
    initMessages: function() {
      const messageBtn = document.querySelector('button[aria-label="Messages"]');
      const messageCard = document.querySelector('.message-card');
      if (!messageBtn || !messageCard) return;

      messageBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMessageCard(messageCard);
      });

      // Close message card when clicking outside
      document.addEventListener('click', (e) => {
        if (!messageBtn.contains(e.target) && !messageCard.contains(e.target)) {
          this.closeMessageCard(messageCard);
        }
      });
    },

    // Toggle message card
    toggleMessageCard: function(card) {
      // Close notification card if it's open
      const notificationCard = document.querySelector('.notification-card');
      if (notificationCard && !notificationCard.classList.contains('opacity-0')) {
        this.closeNotificationCard(notificationCard);
      }
      
      if (card.classList.contains('opacity-0')) {
        this.showMessageCard(card);
      } else {
        this.closeMessageCard(card);
      }
    },

    // Show message card
    showMessageCard: function(card) {
      card.classList.remove('opacity-0', 'invisible');
      card.classList.add('opacity-100', 'visible');
    },

    // Close message card
    closeMessageCard: function(card) {
      card.classList.remove('opacity-100', 'visible');
      card.classList.add('opacity-0', 'invisible');
    },

    // Responsive behavior
    initResponsive: function() {
      const handleResize = () => {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        
        if (window.innerWidth >= 1024) { // lg breakpoint - desktop
          // Hide mobile overlay
          if (overlay) {
            overlay.classList.add('hidden');
          }
          document.body.classList.remove('overflow-hidden');
          
          // Apply desktop sidebar state
          if (sidebar) {
            const savedState = localStorage.getItem('sadmin-sidebar-state');
            if (savedState === 'collapsed') {
              this.collapseDesktopSidebar(sidebar);
            } else {
              // Default to expanded state - ensure it's visible
              sidebar.classList.remove('-translate-x-full', 'lg:-translate-x-full');
              sidebar.classList.add('lg:translate-x-0');
              sidebar.setAttribute('data-sidebar-state', 'expanded');
              sidebar.style.transform = 'translateX(0)';
              this.updateMainContentLayout(false);
              this.updateDesktopToggleIcon(true);
            }
          }
        } else { // mobile/tablet
          // Reset to mobile state - ensure sidebar is hidden
          if (sidebar) {
            sidebar.classList.remove('lg:-translate-x-full', 'lg:translate-x-0');
            sidebar.classList.add('-translate-x-full');
            sidebar.classList.remove('translate-x-0');
            sidebar.setAttribute('data-sidebar-state', 'collapsed');
            sidebar.style.transform = 'translateX(-100%)';
            this.updateMainContentLayout(false); // Reset layout for mobile
          }
        }
      };

      window.addEventListener('resize', handleResize);
      handleResize(); // Initial call
    },

    // Smart Menu System
    initSmartMenu: function() {
      console.log('Initializing menu system...');
      
      // Handle only TOP-LEVEL menu items with submenus
      // Prevents double-binding on nested items
      const menuItems = document.querySelectorAll('nav > .menu-item');
      console.log('Found menu items:', menuItems.length);
      
      menuItems.forEach((menuItem, index) => {
        const button = menuItem.querySelector('button');
        const submenu = menuItem.querySelector('.submenu');
        const arrow = menuItem.querySelector('.menu-arrow');
        
        console.log(`Menu ${index + 1}:`, {
          hasButton: !!button,
          hasSubmenu: !!submenu,
          hasArrow: !!arrow
        });
        
        if (button && submenu) {
          button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Menu button clicked:', menuItem.getAttribute('data-menu'));
            this.toggleMenu(menuItem);
          });
        }
        
        // Handle submenu links
        const submenuLinks = menuItem.querySelectorAll('.submenu a');
        submenuLinks.forEach(link => {
          link.addEventListener('click', (e) => {
            // Remove active class from all links
            this.removeActiveFromAllLinks();
            // Add active class to clicked link
            link.classList.add('active');
            
            // Set active parent menu
            this.setActiveParentMenu(menuItem);
          });
        });
        
        // Handle sub-submenu (nested menu items)
        const nestedMenuItems = menuItem.querySelectorAll('.submenu .menu-item');
        nestedMenuItems.forEach(nestedMenuItem => {
          const nestedButton = nestedMenuItem.querySelector('button');
          const nestedSubmenu = nestedMenuItem.querySelector('.submenu');
          
          if (nestedButton && nestedSubmenu) {
            nestedButton.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              
              console.log('Nested menu button clicked');
              this.toggleNestedMenu(nestedMenuItem, nestedSubmenu);
            });
          }
        });
      });
      
      // Handle main menu links (like Dashboard)
      const mainLinks = document.querySelectorAll('nav > a');
      mainLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          // Remove active class from all links and menus
          this.removeActiveFromAllLinks();
          this.removeActiveFromAllMenus();
          // Add active class to clicked link
          link.classList.add('active');
        });
      });
    },

    // Toggle menu function
    toggleMenu: function(menuItem) {
      const submenu = menuItem.querySelector('.submenu');
      const button = menuItem.querySelector('button');
      const arrow = menuItem.querySelector('.menu-arrow');
      
      console.log('Toggle menu clicked:', {
        menuName: menuItem.getAttribute('data-menu'),
        hasSubmenu: !!submenu,
        isOpen: menuItem.classList.contains('open'),
        hasHidden: submenu ? submenu.classList.contains('hidden') : 'no submenu',
        hasShow: submenu ? submenu.classList.contains('show') : 'no submenu'
      });
      
      if (!submenu) {
        console.log('No submenu found for this menu item');
        return;
      }
      
      const isOpen = menuItem.classList.contains('open');
      
      if (isOpen) {
        // Close this menu
        console.log('Closing menu...');
        this.closeMenu(menuItem, submenu, arrow);
      } else {
        // Close other menus first, then open this one
        console.log('Opening menu...');
        this.closeOtherMenus(menuItem);
        this.openMenu(menuItem, submenu, button, arrow);
      }
    },

    // Open menu function
    openMenu: function(menuItem, submenu, button, arrow) {
      console.log('Opening menu...');
      
      // Add visual feedback
      if (button) {
        button.classList.add('clicked');
        setTimeout(() => button.classList.remove('clicked'), 200);
      }
      
      // Add open class to menu item
      menuItem.classList.add('open');
      
      // Remove hidden class and add show class
      submenu.classList.remove('hidden');
      submenu.classList.add('show');
      
      // Rotate arrow
      if (arrow) {
        arrow.style.transform = 'rotate(180deg)';
      }
      
      console.log('Menu opened:', {
        hasOpen: menuItem.classList.contains('open'),
        hasHidden: submenu.classList.contains('hidden'),
        hasShow: submenu.classList.contains('show'),
        display: window.getComputedStyle(submenu).display
      });
    },

    // Close menu function
    closeMenu: function(menuItem, submenu, arrow) {
      console.log('Closing menu...');
      
      // Remove show class and add hidden class
      submenu.classList.remove('show');
      submenu.classList.add('hidden');
      
      // Remove open class from menu item
      menuItem.classList.remove('open');
      
      // Reset arrow rotation
      if (arrow) {
        arrow.style.transform = 'rotate(0deg)';
      }
      
      console.log('Menu closed:', {
        hasOpen: menuItem.classList.contains('open'),
        hasHidden: submenu.classList.contains('hidden'),
        hasShow: submenu.classList.contains('show')
      });
    },

    // Toggle nested submenu (sub-submenu)
    toggleNestedMenu: function(nestedMenuItem, nestedSubmenu) {
      // Determine open state more reliably using both class and visibility flags
      const isOpen = nestedMenuItem.classList.contains('open') ||
        (nestedSubmenu && nestedSubmenu.classList.contains('show') && !nestedSubmenu.classList.contains('hidden'));
      
      if (isOpen) {
        // Close nested submenu
        this.closeNestedMenu(nestedMenuItem, nestedSubmenu);
      } else {
        // Close other nested submenus first
        this.closeOtherNestedMenus(nestedMenuItem);
        // Open this nested submenu
        this.openNestedMenu(nestedMenuItem, nestedSubmenu);
      }
    },

    // Open nested submenu
    openNestedMenu: function(nestedMenuItem, nestedSubmenu) {
      // Add visual feedback
      const button = nestedMenuItem.querySelector('button');
      const arrow = nestedMenuItem.querySelector('.menu-arrow');
      if (button) {
        button.classList.add('clicked');
        setTimeout(() => button.classList.remove('clicked'), 200);
      }
      
      // Open nested menu
      nestedMenuItem.classList.add('open');
      nestedSubmenu.classList.remove('hidden');
      
      // Force reflow
      nestedSubmenu.offsetHeight;
      
      // Trigger animation
      setTimeout(() => {
        nestedSubmenu.classList.add('show');
      }, 10);

      // Rotate arrow if present
      if (arrow) {
        arrow.style.transform = 'rotate(180deg)';
      }
    },

    // Close nested submenu
    closeNestedMenu: function(nestedMenuItem, nestedSubmenu) {
      const arrow = nestedMenuItem.querySelector('.menu-arrow');

      // Mark as closed immediately
      nestedMenuItem.classList.remove('open');

      // Synchronously hide to avoid race with rapid clicks
      nestedSubmenu.classList.remove('show');
      nestedSubmenu.classList.add('hidden');

      // Reset arrow rotation
      if (arrow) {
        arrow.style.transform = 'rotate(0deg)';
      }
    },

    // Close other nested submenus
    closeOtherNestedMenus: function(currentNestedMenuItem) {
      const allNestedMenuItems = document.querySelectorAll('.submenu .menu-item');
      
      allNestedMenuItems.forEach(nestedMenuItem => {
        if (nestedMenuItem !== currentNestedMenuItem) {
          const nestedSubmenu = nestedMenuItem.querySelector('.submenu');
          const arrow = nestedMenuItem.querySelector('.menu-arrow');
          if (nestedSubmenu) {
            nestedMenuItem.classList.remove('open');
            nestedSubmenu.classList.remove('show');
            nestedSubmenu.classList.add('hidden');
            if (arrow) {
              arrow.style.transform = 'rotate(0deg)';
            }
          }
        }
      });
    },

    // Toggle menu open/close (legacy function)
    toggleMenu: function(menuItem) {
      const submenu = menuItem.querySelector('.submenu');
      const arrow = menuItem.querySelector('.menu-arrow');
      const button = menuItem.querySelector('button');
      
      if (submenu) {
        const isOpen = menuItem.classList.contains('open');
        
        if (isOpen) {
          // Close menu with animation
          this.closeMenuWithAnimation(menuItem, submenu);
        } else {
          // Ensure only one menu is open at a time
          this.closeOtherMenus(menuItem);
          // Open menu with animation
          this.openMenuWithAnimation(menuItem, submenu, button);
        }
      }
    },

    // Open menu with enhanced animation
    openMenuWithAnimation: function(menuItem, submenu, button) {
      // Add click animation to button
      this.addClickAnimation(button);
      
      // Open menu
      menuItem.classList.add('open');
      submenu.classList.remove('hidden');
      
      // Force reflow to ensure the element is visible
      submenu.offsetHeight;
      
      // Trigger animation with a small delay
      setTimeout(() => {
        submenu.classList.add('show');
      }, 10);
    },

    // Close menu with enhanced animation
    closeMenuWithAnimation: function(menuItem, submenu) {
      // Remove show class first to trigger close animation
      submenu.classList.remove('show');
      
      // Close menu after animation completes
      setTimeout(() => {
        menuItem.classList.remove('open');
        submenu.classList.add('hidden');
      }, 400); // Slightly longer to ensure animation completes
    },

    // Create ripple effect on button click
    createRippleEffect: function(button) {
      const ripple = document.createElement('span');
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = rect.width / 2 - size / 2;
      const y = rect.height / 2 - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');
      
      button.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    },

    // Close other menus at the same level
    closeOtherMenus: function(currentMenu) {
      const allMenuItems = document.querySelectorAll('.menu-item');
      
      allMenuItems.forEach(menuItem => {
        if (menuItem !== currentMenu) {
          const submenu = menuItem.querySelector('.submenu');
          const arrow = menuItem.querySelector('.menu-arrow');
          
          if (submenu) {
            menuItem.classList.remove('open');
            submenu.classList.remove('show');
            submenu.classList.add('hidden');
            
            // Reset arrow rotation
            if (arrow) {
              arrow.style.transform = 'rotate(0deg)';
            }
          }
        }
      });
    },

    // Remove active class from all menu links
    removeActiveFromAllLinks: function() {
      const allLinks = document.querySelectorAll('nav a, .submenu a');
      allLinks.forEach(link => {
        link.classList.remove('active');
      });
    },

    // Remove active class from all menu items
    removeActiveFromAllMenus: function() {
      const allMenuItems = document.querySelectorAll('.menu-item');
      allMenuItems.forEach(menuItem => {
        menuItem.classList.remove('active');
      });
    },

    // Set active parent menu
    setActiveParentMenu: function(menuItem) {
      // Remove active from all menus
      this.removeActiveFromAllMenus();
      // Add active to current menu
      menuItem.classList.add('active');
    },

    // Open specific menu by data-menu attribute
    openMenu: function(menuName) {
      const menuItem = document.querySelector(`[data-menu="${menuName}"]`);
      if (menuItem) {
        this.toggleMenu(menuItem);
      }
    },

    // Close all menus
    closeAllMenus: function() {
      const allMenuItems = document.querySelectorAll('.menu-item');
      allMenuItems.forEach(menuItem => {
        const submenu = menuItem.querySelector('.submenu');
        if (submenu) {
          menuItem.classList.remove('open');
          submenu.classList.remove('show');
          submenu.classList.add('hidden');
        }
      });
    },

    // Set active menu item by URL or data attribute
    setActiveMenu: function(menuName, submenuName = null) {
      // Remove all active states
      this.removeActiveFromAllLinks();
      this.removeActiveFromAllMenus();
      
      // Find and activate the main menu
      const menuItem = document.querySelector(`[data-menu="${menuName}"]`);
      if (menuItem) {
        menuItem.classList.add('active');
        
        // Open the menu if it has submenu
        const submenu = menuItem.querySelector('.submenu');
        if (submenu) {
          menuItem.classList.add('open');
          submenu.classList.remove('hidden');
          submenu.classList.add('show');
        }
        
        // Activate specific submenu item if provided
        if (submenuName) {
          const submenuLink = menuItem.querySelector(`[href*="${submenuName}"]`);
          if (submenuLink) {
            submenuLink.classList.add('active');
          }
        }
      }
    },

    // Initialize page animations
    initPageAnimations: function() {
      // Add loaded class to sidebar for entrance animation
      const sidebar = document.getElementById('sidebar');
      if (sidebar) {
        setTimeout(() => {
          sidebar.classList.add('loaded');
        }, 100);
      }

      // Animate menu items on load
      const menuItems = document.querySelectorAll('.menu-item');
      menuItems.forEach((item, index) => {
        // Reset initial state
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'all 0.5s ease-out';
        
        // Animate in with stagger
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, 300 + (index * 100));
      });

      // Add hover sound effect (optional)
      this.addHoverSoundEffects();
    },

    // Add hover sound effects (optional enhancement)
    addHoverSoundEffects: function() {
      const menuButtons = document.querySelectorAll('.menu-item button');
      const submenuLinks = document.querySelectorAll('.submenu a');
      
      // Add subtle hover effects
      [...menuButtons, ...submenuLinks].forEach(element => {
        element.addEventListener('mouseenter', () => {
          // Add a subtle vibration effect on supported devices
          if (navigator.vibrate) {
            navigator.vibrate(10);
          }
        });
      });
    },

    // Enhanced menu item click animation
    addClickAnimation: function(element) {
      // Add CSS animation class
      element.classList.add('clicked');
      
      // Remove class after animation completes
      setTimeout(() => {
        element.classList.remove('clicked');
      }, 200);
    },

    // Test animations (for debugging)
    testAnimations: function() {
      console.log('Testing animations...');
      
      // Test sidebar animation
      const sidebar = document.getElementById('sidebar');
      if (sidebar) {
        sidebar.classList.add('loaded');
        console.log('Sidebar animation triggered');
      }
      
      // Test simple menu animation
      const firstMenu = document.querySelector('.menu-item');
      if (firstMenu) {
        console.log('Testing simple menu toggle...');
        this.simpleToggleMenu(firstMenu);
        setTimeout(() => {
          this.simpleToggleMenu(firstMenu);
          console.log('Simple menu animation test completed');
        }, 2000);
      }
    },

    // Debug menu state
    debugMenuState: function() {
      const menuItems = document.querySelectorAll('.menu-item');
      console.log('Menu States:');
      menuItems.forEach((item, index) => {
        const isOpen = item.classList.contains('open');
        const submenu = item.querySelector('.submenu');
        const hasShow = submenu && submenu.classList.contains('show');
        const isHidden = submenu && submenu.classList.contains('hidden');
        console.log(`Menu ${index + 1}: open=${isOpen}, show=${hasShow}, hidden=${isHidden}`);
      });
    },

    // Test submenu opening
    testSubmenu: function() {
      const firstMenu = document.querySelector('.menu-item');
      if (firstMenu) {
        const submenu = firstMenu.querySelector('.submenu');
        const button = firstMenu.querySelector('button');
        
        console.log('Before:', {
          hasOpen: firstMenu.classList.contains('open'),
          hasShow: submenu.classList.contains('show'),
          hasHidden: submenu.classList.contains('hidden')
        });
        
        this.openMenu(firstMenu, submenu, button);
        
        setTimeout(() => {
          console.log('After:', {
            hasOpen: firstMenu.classList.contains('open'),
            hasShow: submenu.classList.contains('show'),
            hasHidden: submenu.classList.contains('hidden')
          });
        }, 100);
      }
    },

    // Force open first menu for testing
    forceOpenMenu: function() {
      const firstMenu = document.querySelector('.menu-item');
      if (firstMenu) {
        const submenu = firstMenu.querySelector('.submenu');
        const button = firstMenu.querySelector('button');
        
        console.log('Force opening menu...');
        console.log('Before:', {
          hasOpen: firstMenu.classList.contains('open'),
          hasHidden: submenu.classList.contains('hidden'),
          hasShow: submenu.classList.contains('show')
        });
        
        this.openMenu(firstMenu, submenu, button);
        
        setTimeout(() => {
          console.log('After:', {
            hasOpen: firstMenu.classList.contains('open'),
            hasHidden: submenu.classList.contains('hidden'),
            hasShow: submenu.classList.contains('show')
          });
        }, 100);
      }
    },

    // Quick test - click first menu
    testClick: function() {
      const firstMenu = document.querySelector('.menu-item');
      if (firstMenu) {
        const button = firstMenu.querySelector('button');
        button.click();
      }
    },

    // Test Products menu specifically
    testProductsMenu: function() {
      const productsMenu = document.querySelector('[data-menu="products"]');
      if (productsMenu) {
        const submenu = productsMenu.querySelector('.submenu');
        const button = productsMenu.querySelector('button');
        
        console.log('Testing Products menu...');
        console.log('Before click:', {
          hasOpen: productsMenu.classList.contains('open'),
          hasHidden: submenu.classList.contains('hidden'),
          hasShow: submenu.classList.contains('show'),
          display: window.getComputedStyle(submenu).display
        });
        
        button.click();
        
        setTimeout(() => {
          console.log('After click:', {
            hasOpen: productsMenu.classList.contains('open'),
            hasHidden: submenu.classList.contains('hidden'),
            hasShow: submenu.classList.contains('show'),
            display: window.getComputedStyle(submenu).display
          });
        }, 500);
      } else {
        console.log('Products menu not found!');
      }
    },

    // Simple test function for debugging
    testMenu: function() {
      console.log('=== MENU DEBUG TEST ===');
      const menuItems = document.querySelectorAll('.menu-item');
      console.log('Found menu items:', menuItems.length);
      
      menuItems.forEach((item, index) => {
        const button = item.querySelector('button');
        const submenu = item.querySelector('.submenu');
        const arrow = item.querySelector('.menu-arrow');
        
        console.log(`Menu ${index + 1}:`, {
          dataMenu: item.getAttribute('data-menu'),
          hasButton: !!button,
          hasSubmenu: !!submenu,
          hasArrow: !!arrow,
          isOpen: item.classList.contains('open'),
          hasHidden: submenu ? submenu.classList.contains('hidden') : 'no submenu',
          hasShow: submenu ? submenu.classList.contains('show') : 'no submenu'
        });
      });
      
      // Test clicking the first menu
      if (menuItems.length > 0) {
        const firstMenu = menuItems[0];
        const button = firstMenu.querySelector('button');
        if (button) {
          console.log('Testing click on first menu...');
          button.click();
        }
      }
    }
  };

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.Dashboard.init();
  });
} else {
  window.Dashboard.init();
}