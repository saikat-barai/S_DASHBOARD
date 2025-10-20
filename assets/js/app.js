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
      this.initModal();
      this.initFormElements();
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

      // Apply theme with instant switch (disable transitions briefly)
      const applyTheme = (theme) => {
        // Disable transitions for instant swap
        document.documentElement.classList.add('no-theme-transition');

        if (theme === 'dark') {
          root.classList.add('dark');
          toggle.textContent = '☀️';
        } else {
          root.classList.remove('dark');
          toggle.textContent = '🌙';
        }

        // Re-enable transitions on the next animation frame to avoid jank
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            document.documentElement.classList.remove('no-theme-transition');
          });
        });
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

    // Modal functionality
    initModal: function() {
      const backdrop = document.getElementById('modalBackdrop');
      const openButtons = document.querySelectorAll('[data-modal-open]');
      const closeButtons = document.querySelectorAll('[data-modal-close]');

      if (!backdrop) return;

      const openModal = (targetSelector) => {
        const target = targetSelector ? document.querySelector(targetSelector) : document.querySelector('.sadmin-modal');
        if (!target) return;
        backdrop.classList.add('show');
        backdrop.classList.remove('hidden');
        target.classList.remove('closing');
        target.classList.add('show');
        target.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
        // focus first focusable
        const firstFocusable = target.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) firstFocusable.focus();
      };

      const closeModal = (target) => {
        const active = target || document.querySelector('.sadmin-modal.show');
        if (!active) return;
        active.classList.add('closing');
        backdrop.classList.remove('show');
        setTimeout(() => {
          active.classList.remove('show', 'closing');
          active.classList.add('hidden');
          backdrop.classList.add('hidden');
          document.body.classList.remove('overflow-hidden');
        }, 300);
      };

      openButtons.forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const targetSelector = btn.getAttribute('data-modal-open');
          openModal(targetSelector);
        });
      });

      closeButtons.forEach((btn) => {
        btn.addEventListener('click', () => closeModal());
      });

      backdrop.addEventListener('click', () => closeModal());

      // Close when clicking outside the dialog (on the modal overlay itself)
      const modalOverlays = document.querySelectorAll('.sadmin-modal');
      modalOverlays.forEach((overlay) => {
        overlay.addEventListener('click', (e) => {
          // If the click is directly on the overlay (not inside the dialog), close it
          if (e.target === overlay) {
            closeModal(overlay);
          }
        });
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
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
    },

    // ========================================
    // FORM ELEMENTS FUNCTIONALITY
    // ========================================

    // Initialize form elements
    initFormElements: function() {
      this.initPasswordToggle();
      this.initCharacterCounter();
      this.initRangeSlider();
      this.initDragDrop();
      this.initFormValidation();
      this.initSelect2Dropdown();
      this.initMultiSelect();
    },

    // Password toggle functionality
    initPasswordToggle: function() {
      window.togglePassword = function() {
        const passwordInput = document.getElementById('passwordInput');
        const passwordToggle = document.getElementById('passwordToggle');
        
        if (passwordInput && passwordToggle) {
          if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            passwordToggle.textContent = '🙈';
          } else {
            passwordInput.type = 'password';
            passwordToggle.textContent = '👁️';
          }
        }
      };
    },

    // Character counter for textarea
    initCharacterCounter: function() {
      const charCounter = document.getElementById('charCounter');
      const charCount = document.getElementById('charCount');
      
      if (charCounter && charCount) {
        charCounter.addEventListener('input', function() {
          const currentLength = this.value.length;
          const maxLength = this.getAttribute('maxlength');
          
          charCount.textContent = currentLength;
          
          if (currentLength > maxLength * 0.9) {
            charCount.style.color = 'var(--red-500)';
          } else if (currentLength > maxLength * 0.7) {
            charCount.style.color = 'var(--yellow-500)';
          } else {
            charCount.style.color = 'var(--gray-500)';
          }
        });
      }
    },

    // Range slider value display
    initRangeSlider: function() {
      const rangeWithValue = document.getElementById('rangeWithValue');
      const rangeValue = document.getElementById('rangeValue');
      
      if (rangeWithValue && rangeValue) {
        rangeWithValue.addEventListener('input', function() {
          rangeValue.textContent = this.value;
        });
      }
    },

    // Drag and drop functionality
    initDragDrop: function() {
      const dropzone = document.getElementById('dropzone');
      
      if (dropzone) {
        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
          dropzone.addEventListener(eventName, this.preventDefaults, false);
          document.body.addEventListener(eventName, this.preventDefaults, false);
        });

        // Highlight drop zone when item is dragged over it
        ['dragenter', 'dragover'].forEach(eventName => {
          dropzone.addEventListener(eventName, () => this.highlightDropzone(dropzone), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
          dropzone.addEventListener(eventName, () => this.unhighlightDropzone(dropzone), false);
        });

        // Handle dropped files
        dropzone.addEventListener('drop', (e) => this.handleDrop(e), false);
      }
    },

    preventDefaults: function(e) {
      e.preventDefault();
      e.stopPropagation();
    },

    highlightDropzone: function(dropzone) {
      dropzone.classList.add('dragover');
    },

    unhighlightDropzone: function(dropzone) {
      dropzone.classList.remove('dragover');
    },

    handleDrop: function(e) {
      const dt = e.dataTransfer;
      const files = dt.files;
      
      if (files.length > 0) {
        console.log('Files dropped:', files);
        this.showNotification('Files uploaded successfully!', 'success');
      }
    },

    // Form validation
    initFormValidation: function() {
      const validationForm = document.getElementById('validationForm');
      
      if (validationForm) {
        validationForm.addEventListener('submit', (e) => {
          e.preventDefault();
          
          // Clear previous errors
          this.clearFormErrors();
          
          let isValid = true;
          
          // Validate required fields
          const requiredFields = validationForm.querySelectorAll('[required]');
          requiredFields.forEach(field => {
            if (!field.value.trim()) {
              this.showFieldError(field, 'This field is required');
              isValid = false;
            }
          });
          
          // Validate email
          const emailField = validationForm.querySelector('input[type="email"]');
          if (emailField && emailField.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value)) {
              this.showFieldError(emailField, 'Please enter a valid email address');
              isValid = false;
            }
          }
          
          // Validate phone number
          const phoneField = validationForm.querySelector('input[type="tel"]');
          if (phoneField && phoneField.value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(phoneField.value.replace(/\s/g, ''))) {
              this.showFieldError(phoneField, 'Please enter a valid phone number');
              isValid = false;
            }
          }
          
          if (isValid) {
            this.showNotification('Form submitted successfully!', 'success');
            // You can add form submission logic here
          } else {
            this.showNotification('Please fix the errors and try again', 'error');
          }
        });
      }
    },

    clearFormErrors: function() {
      const errorElements = document.querySelectorAll('.form-error');
      errorElements.forEach(error => {
        error.classList.remove('show');
        error.textContent = '';
      });
      
      const errorFields = document.querySelectorAll('.form-input.error, .form-textarea.error, .form-select.error');
      errorFields.forEach(field => {
        field.classList.remove('error');
      });
    },

    showFieldError: function(field, message) {
      field.classList.add('error');
      const errorElement = document.getElementById(field.name + 'Error');
      if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
      }
    },

    showNotification: function(message, type = 'info') {
      // Create notification element
      const notification = document.createElement('div');
      notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full`;
      
      // Set colors based on type
      const colors = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        warning: 'bg-yellow-500 text-white',
        info: 'bg-blue-500 text-white'
      };
      
      notification.className += ` ${colors[type] || colors.info}`;
      notification.textContent = message;
      
      document.body.appendChild(notification);
      
      // Animate in
      setTimeout(() => {
        notification.classList.remove('translate-x-full');
      }, 100);
      
      // Remove after 3 seconds
      setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 300);
      }, 3000);
    },

    // Select2-style dropdown functionality
    initSelect2Dropdown: function() {
      const formSelects = document.querySelectorAll('.form-select');
      
      formSelects.forEach(select => {
        // Auto-create Select2 wrapper
        this.createSelect2Wrapper(select);
        
        const wrapper = select.parentElement;
        const selection = wrapper.querySelector('.select2-selection');
        const rendered = wrapper.querySelector('.select2-selection__rendered');
        const dropdown = wrapper.querySelector('.select2-dropdown');
        const searchField = wrapper.querySelector('.select2-search__field');
        const options = wrapper.querySelectorAll('.select2-results__option');
        
        // Update display when native select changes
        select.addEventListener('change', () => {
          const selectedOption = select.options[select.selectedIndex];
          const selectedText = selectedOption.textContent;
          const selectedValue = selectedOption.value;
          
          // Update custom display
          if (selectedValue) {
            const flag = selectedText.split(' ')[0];
            const text = selectedText.split(' ').slice(1).join(' ');
            rendered.innerHTML = `<span class="option-flag">${flag}</span><span class="option-text">${text}</span>`;
          } else {
            rendered.innerHTML = '<span class="select2-selection__placeholder">Choose your country</span>';
          }
          
          // Update options visual state
          options.forEach(option => {
            option.classList.remove('select2-results__option--selected');
            if (option.getAttribute('data-value') === selectedValue) {
              option.classList.add('select2-results__option--selected');
            }
          });
        });
        
        // Handle option clicks
        options.forEach(option => {
          option.addEventListener('click', (e) => {
            e.stopPropagation();
            const value = option.getAttribute('data-value');
            
            // Update native select
            select.value = value;
            
            // Trigger change event
            select.dispatchEvent(new Event('change'));
            
            // Close dropdown
            wrapper.classList.remove('form-select-container--open');
          });
        });
        
        // Toggle dropdown
        selection.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleSelect2Dropdown(wrapper);
        });
        
        // Search functionality (only if search field exists)
        if (searchField) {
          searchField.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            this.filterSelect2Options(options, searchTerm);
          });
        }
        
        // Keyboard navigation
        wrapper.addEventListener('keydown', (e) => {
          this.handleSelect2Keyboard(e, wrapper, options);
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
          if (!wrapper.contains(e.target)) {
            wrapper.classList.remove('form-select-container--open');
          }
        });
      });
    },

    createSelect2Wrapper: function(select) {
      // Wrap the select in a container
      const wrapper = document.createElement('div');
      wrapper.className = 'form-select-container';
      
      // Insert wrapper before select
      select.parentNode.insertBefore(wrapper, select);
      
      // Move select into wrapper
      wrapper.appendChild(select);
      
      // Check if this is a no-search variant
      const isNoSearch = select.classList.contains('form-select-no-search');
      
      // Create Select2 structure
      const select2HTML = `
        <div class="select2-selection">
          <div class="select2-selection__rendered">
            <span class="select2-selection__placeholder">Choose your option</span>
          </div>
          <div class="select2-selection__arrow">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M6 8L10 12L14 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        <div class="select2-dropdown">
          ${isNoSearch ? '' : `
          <div class="select2-search">
            <input type="text" class="select2-search__field" placeholder="Search..." />
          </div>
          `}
          <div class="select2-results">
            <ul class="select2-results__options">
              ${Array.from(select.options).map(option => {
                if (option.value === '') return '';
                const flag = option.textContent.split(' ')[0];
                const text = option.textContent.split(' ').slice(1).join(' ');
                return `
                  <li class="select2-results__option" data-value="${option.value}">
                    <div class="select2-results__option__text">
                      <span class="option-flag">${flag}</span>
                      <span class="option-text">${text}</span>
                    </div>
                  </li>
                `;
              }).join('')}
            </ul>
          </div>
        </div>
      `;
      
      wrapper.insertAdjacentHTML('beforeend', select2HTML);
    },

    toggleSelect2Dropdown: function(wrapper) {
      const isOpen = wrapper.classList.contains('form-select-container--open');
      
      // Close all other dropdowns (both single and multiple selects)
      document.querySelectorAll('.form-select-container--open, .multi-select-wrapper--open').forEach(w => {
        if (w !== wrapper) {
          w.classList.remove('form-select-container--open', 'multi-select-wrapper--open');
        }
      });
      
      if (isOpen) {
        wrapper.classList.remove('form-select-container--open');
      } else {
        wrapper.classList.add('form-select-container--open');
        
        // Auto-position dropdown based on available space
        this.positionSelect2Dropdown(wrapper);
        
        // Clear search field and focus when opening (only if search exists)
        const searchField = wrapper.querySelector('.select2-search__field');
        if (searchField) {
          searchField.value = '';
          // Reset all options to visible
          const options = wrapper.querySelectorAll('.select2-results__option');
          options.forEach(option => {
            option.style.display = 'flex';
          });
          setTimeout(() => searchField.focus(), 100);
        } else {
          // For no-search variant, just reset all options to visible
          const options = wrapper.querySelectorAll('.select2-results__option');
          options.forEach(option => {
            option.style.display = 'flex';
          });
        }
      }
    },

    positionSelect2Dropdown: function(wrapper) {
      const dropdown = wrapper.querySelector('.select2-dropdown');
      const selection = wrapper.querySelector('.select2-selection');
      
      if (!dropdown || !selection) return;
      
      // Get positions and dimensions
      const selectionRect = selection.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownHeight = 200; // Estimated max height
      
      // Calculate space below and above
      const spaceBelow = viewportHeight - selectionRect.bottom;
      const spaceAbove = selectionRect.top;
      
      // Reset any previous positioning
      dropdown.style.top = '';
      dropdown.style.bottom = '';
      dropdown.style.transform = '';
      
      // Position dropdown based on available space
      if (spaceBelow >= dropdownHeight || spaceBelow >= spaceAbove) {
        // Open downward (default)
        dropdown.style.top = '100%';
        dropdown.style.marginTop = '0.25rem';
        wrapper.classList.remove('select2-dropdown--upward');
      } else {
        // Open upward
        dropdown.style.bottom = '100%';
        dropdown.style.marginBottom = '0.25rem';
        dropdown.style.marginTop = '';
        wrapper.classList.add('select2-dropdown--upward');
      }
    },

    filterSelect2Options: function(options, searchTerm) {
      options.forEach(option => {
        const text = option.textContent.toLowerCase();
        const isVisible = text.includes(searchTerm);
        option.style.display = isVisible ? 'flex' : 'none';
      });
    },

    handleSelect2Keyboard: function(e, wrapper, options) {
      const isOpen = wrapper.classList.contains('form-select-container--open');
      const visibleOptions = Array.from(options).filter(option => option.style.display !== 'none');
      
      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (!isOpen) {
            wrapper.classList.add('form-select-container--open');
          } else {
            const highlighted = wrapper.querySelector('.select2-results__option--highlighted');
            if (highlighted) {
              highlighted.click();
            }
          }
          break;
          
        case 'Escape':
          wrapper.classList.remove('form-select-container--open');
          break;
          
        case 'ArrowDown':
          e.preventDefault();
          if (!isOpen) {
            wrapper.classList.add('form-select-container--open');
          } else {
            this.navigateSelect2Options(visibleOptions, 1);
          }
          break;
          
        case 'ArrowUp':
          e.preventDefault();
          if (!isOpen) {
            wrapper.classList.add('form-select-container--open');
          } else {
            this.navigateSelect2Options(visibleOptions, -1);
          }
          break;
      }
    },

    navigateSelect2Options: function(options, direction) {
      const currentHighlighted = document.querySelector('.select2-results__option--highlighted');
      let currentIndex = Array.from(options).indexOf(currentHighlighted);
      
      // Remove current highlight
      if (currentHighlighted) {
        currentHighlighted.classList.remove('select2-results__option--highlighted');
      }
      
      // Calculate new index
      if (direction === 1) {
        currentIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
      } else {
        currentIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
      }
      
      // Add highlight to new option
      if (options[currentIndex]) {
        options[currentIndex].classList.add('select2-results__option--highlighted');
        options[currentIndex].scrollIntoView({ block: 'nearest' });
      }
    },

    // Multiple select functionality
    initMultiSelect: function() {
      const multiSelects = document.querySelectorAll('.form-select-multi');
      
      multiSelects.forEach(select => {
        // Auto-create wrapper structure
        this.createMultiSelectWrapper(select);
        
        const wrapper = select.parentElement;
        const display = wrapper.querySelector('.multi-select-display');
        const choices = wrapper.querySelector('.multi-select-choices');
        const dropdown = wrapper.querySelector('.multi-select-dropdown');
        const searchField = wrapper.querySelector('.multi-select-search-field');
        const options = wrapper.querySelectorAll('.multi-select-option');
        
        // Update display when native select changes
        const updateDisplay = () => {
          const selectedValues = Array.from(select.selectedOptions).map(option => option.value);
          const selectedTexts = Array.from(select.selectedOptions).map(option => option.textContent);
          
          // Clear choices
          choices.innerHTML = '';
          
          if (selectedValues.length === 0) {
            choices.innerHTML = '<span class="multi-select-placeholder">Choose multiple options</span>';
          } else {
            selectedValues.forEach((value, index) => {
              const text = selectedTexts[index];
              const icon = text.split(' ')[0];
              const optionText = text.split(' ').slice(1).join(' ');
              
              const choice = document.createElement('div');
              choice.className = 'multi-select-choice';
              choice.innerHTML = `
                <span class="option-icon">${icon}</span>
                <span class="option-text">${optionText}</span>
                <span class="multi-select-choice-remove" data-value="${value}">×</span>
              `;
              choices.appendChild(choice);
            });
          }
          
          // Update options visual state
          options.forEach(option => {
            option.classList.remove('multi-select-option--selected');
            if (selectedValues.includes(option.getAttribute('data-value'))) {
              option.classList.add('multi-select-option--selected');
            }
          });
        };
        
        select.addEventListener('change', updateDisplay);
        
        // Handle option clicks
        options.forEach(option => {
          option.addEventListener('click', (e) => {
            e.stopPropagation();
            const value = option.getAttribute('data-value');
            const optionElement = select.querySelector(`option[value="${value}"]`);
            
            if (optionElement) {
              optionElement.selected = !optionElement.selected;
              select.dispatchEvent(new Event('change'));
            }
          });
        });
        
        // Handle choice removal
        choices.addEventListener('click', (e) => {
          if (e.target.classList.contains('multi-select-choice-remove')) {
            e.stopPropagation();
            const value = e.target.getAttribute('data-value');
            const optionElement = select.querySelector(`option[value="${value}"]`);
            
            if (optionElement) {
              optionElement.selected = false;
              select.dispatchEvent(new Event('change'));
            }
          }
        });
        
        // Toggle dropdown
        display.addEventListener('click', (e) => {
          e.stopPropagation();
          const isOpen = wrapper.classList.contains('multi-select-wrapper--open');
          
          // Close all other dropdowns (both single and multiple selects)
          document.querySelectorAll('.form-select-container--open, .multi-select-wrapper--open').forEach(w => {
            if (w !== wrapper) {
              w.classList.remove('form-select-container--open', 'multi-select-wrapper--open');
            }
          });
          
          if (isOpen) {
            wrapper.classList.remove('multi-select-wrapper--open');
          } else {
            wrapper.classList.add('multi-select-wrapper--open');
            
            // Auto-position dropdown based on available space
            this.positionMultiSelectDropdown(wrapper);
            
            // Clear search field and focus when opening
            if (searchField) {
              searchField.value = '';
              // Reset all options to visible
              options.forEach(option => {
                option.style.display = 'flex';
              });
              setTimeout(() => searchField.focus(), 100);
            }
          }
        });
        
        // Search functionality
        if (searchField) {
          searchField.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            options.forEach(option => {
              const text = option.textContent.toLowerCase();
              const isVisible = text.includes(searchTerm);
              option.style.display = isVisible ? 'flex' : 'none';
            });
          });
        }
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
          if (!wrapper.contains(e.target)) {
            wrapper.classList.remove('multi-select-wrapper--open');
          }
        });
        
        // Initialize display
        updateDisplay();
      });
    },

    positionMultiSelectDropdown: function(wrapper) {
      const dropdown = wrapper.querySelector('.multi-select-dropdown');
      const display = wrapper.querySelector('.multi-select-display');
      
      if (!dropdown || !display) return;
      
      // Get positions and dimensions
      const displayRect = display.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownHeight = 200; // Estimated max height
      
      // Calculate space below and above
      const spaceBelow = viewportHeight - displayRect.bottom;
      const spaceAbove = displayRect.top;
      
      // Reset any previous positioning
      dropdown.style.top = '';
      dropdown.style.bottom = '';
      dropdown.style.transform = '';
      
      // Position dropdown based on available space
      if (spaceBelow >= dropdownHeight || spaceBelow >= spaceAbove) {
        // Open downward (default)
        dropdown.style.top = '100%';
        dropdown.style.marginTop = '0.25rem';
        wrapper.classList.remove('multi-select-dropdown--upward');
      } else {
        // Open upward
        dropdown.style.bottom = '100%';
        dropdown.style.marginBottom = '0.25rem';
        dropdown.style.marginTop = '';
        wrapper.classList.add('multi-select-dropdown--upward');
      }
    },

    createMultiSelectWrapper: function(select) {
      // Wrap the select in a container
      const wrapper = document.createElement('div');
      wrapper.className = 'multi-select-wrapper';
      
      // Insert wrapper before select
      select.parentNode.insertBefore(wrapper, select);
      
      // Move select into wrapper
      wrapper.appendChild(select);
      
      // Create multi-select structure
      const multiSelectHTML = `
        <div class="multi-select-display">
          <div class="multi-select-choices">
            <span class="multi-select-placeholder">Choose multiple options</span>
          </div>
          <div class="multi-select-arrow">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M6 8L10 12L14 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        <div class="multi-select-dropdown">
          <div class="multi-select-search">
            <input type="text" class="multi-select-search-field" placeholder="Search options..." />
          </div>
          <div class="multi-select-options">
            ${Array.from(select.options).map(option => {
              const icon = option.textContent.split(' ')[0];
              const text = option.textContent.split(' ').slice(1).join(' ');
              return `
                <div class="multi-select-option" data-value="${option.value}">
                  <span class="option-icon">${icon}</span>
                  <span class="option-text">${text}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
      
      wrapper.insertAdjacentHTML('beforeend', multiSelectHTML);
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