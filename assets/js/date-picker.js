/**
 * Professional Custom Date Picker
 * Simple, Clean, and Reliable Implementation
 */

class DatePicker {
  constructor(inputId, options = {}) {
    this.input = document.getElementById(inputId);
    if (!this.input) {
      console.error(`Date picker input "${inputId}" not found`);
      return;
    }
    
    // Configuration options
    this.options = {
      format: 'long', // 'long', 'short', 'numeric', 'dd-mm-yyyy', 'mm-dd-yyyy', 'yyyy-mm-dd'
      placeholder: 'Select date...',
      ...options
    };
    
    // State
    this.currentDate = new Date();
    this.selectedDate = null;
    this.isOpen = false;
    this.isMonthYearModalOpen = false;
    
    // Initialize
    this.createHTML();
    this.attachEvents();
    this.render();
  }
  
  createHTML() {
    // Make parent relative for positioning
    this.input.parentElement.style.position = 'relative';
    
    // Add calendar icon to input
    this.input.style.paddingRight = '2.5rem'; // Make space for icon
    
    // Create calendar icon
    this.icon = document.createElement('div');
    this.icon.className = 'absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none';
    this.icon.innerHTML = `
      <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
      </svg>
    `;
    
    // Add icon to parent
    this.input.parentElement.appendChild(this.icon);
    
    // Create dropdown
    this.dropdown = document.createElement('div');
    this.dropdown.className = 'w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl hidden';
    this.dropdown.style.position = 'absolute';
    this.dropdown.style.top = '100%';
    this.dropdown.style.left = '0';
    this.dropdown.style.zIndex = '50';
    this.dropdown.style.marginTop = '4px';
    
    // Build structure
    this.dropdown.innerHTML = `
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <button id="${this.input.id}-prev" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        <button id="${this.input.id}-month-year" class="px-3 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold">
          <span id="${this.input.id}-month-year-text">January 2024</span>
        </button>
        <button id="${this.input.id}-next" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
      
      <!-- Weekdays -->
      <div class="grid grid-cols-7 gap-1 p-2 bg-gray-50 dark:bg-gray-700">
        <div class="text-center text-xs font-semibold text-gray-600 dark:text-gray-300 py-2">Sun</div>
        <div class="text-center text-xs font-semibold text-gray-600 dark:text-gray-300 py-2">Mon</div>
        <div class="text-center text-xs font-semibold text-gray-600 dark:text-gray-300 py-2">Tue</div>
        <div class="text-center text-xs font-semibold text-gray-600 dark:text-gray-300 py-2">Wed</div>
        <div class="text-center text-xs font-semibold text-gray-600 dark:text-gray-300 py-2">Thu</div>
        <div class="text-center text-xs font-semibold text-gray-600 dark:text-gray-300 py-2">Fri</div>
        <div class="text-center text-xs font-semibold text-gray-600 dark:text-gray-300 py-2">Sat</div>
      </div>
      
      <!-- Days Grid -->
      <div id="${this.input.id}-days" class="grid grid-cols-7 gap-1 p-2"></div>
      
      <!-- Footer -->
      <div class="flex items-center justify-between p-3 border-t border-gray-200 dark:border-gray-700">
        <button id="${this.input.id}-today" class="px-3 py-1 text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 font-medium">
          Today
        </button>
        <div class="flex gap-2">
          <button id="${this.input.id}-clear" class="px-3 py-1 text-sm text-gray-600 dark:text-gray-400">
            Clear
          </button>
          <button id="${this.input.id}-close" class="px-3 py-1 text-sm bg-brand-600 hover:bg-brand-700 text-white rounded-md">
            Close
          </button>
        </div>
      </div>
      
      <!-- Month/Year Modal -->
      <div id="${this.input.id}-modal" class="absolute inset-0 bg-white dark:bg-gray-800 rounded-lg hidden" style="z-index: 60;">
        <div class="h-full flex flex-col p-4">
          <!-- Modal Header -->
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-semibold">Select Month & Year</h3>
            <button id="${this.input.id}-close-modal" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <!-- Year Selection -->
          <div class="mb-4">
            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Year</label>
            <div class="flex items-center gap-2">
              <button id="${this.input.id}-year-prev" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              <input type="number" id="${this.input.id}-year" class="flex-1 text-center border rounded-lg px-3 py-2" min="1900" max="2100">
              <button id="${this.input.id}-year-next" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Month Grid -->
          <div id="${this.input.id}-months" class="grid grid-cols-3 gap-2 flex-1"></div>
        </div>
      </div>
    `;
    
    // Append to parent
    this.input.parentElement.appendChild(this.dropdown);
    
    // Cache elements
    this.elements = {
      dropdown: this.dropdown,
      modal: document.getElementById(`${this.input.id}-modal`),
      monthYearText: document.getElementById(`${this.input.id}-month-year-text`),
      daysGrid: document.getElementById(`${this.input.id}-days`),
      monthYearBtn: document.getElementById(`${this.input.id}-month-year`),
      prevBtn: document.getElementById(`${this.input.id}-prev`),
      nextBtn: document.getElementById(`${this.input.id}-next`),
      todayBtn: document.getElementById(`${this.input.id}-today`),
      clearBtn: document.getElementById(`${this.input.id}-clear`),
      closeBtn: document.getElementById(`${this.input.id}-close`),
      modalClose: document.getElementById(`${this.input.id}-close-modal`),
      yearInput: document.getElementById(`${this.input.id}-year`),
      yearPrev: document.getElementById(`${this.input.id}-year-prev`),
      yearNext: document.getElementById(`${this.input.id}-year-next`),
      monthsGrid: document.getElementById(`${this.input.id}-months`)
    };
  }
  
  attachEvents() {
    // Add cursor pointer to input
    this.input.style.cursor = 'pointer';
    this.input.style.readOnly = true;
    
    // Input click
    this.input.addEventListener('click', () => {
      this.toggle();
    });
    
    // Navigation
    this.elements.prevBtn.addEventListener('click', () => {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
      this.render();
    });
    
    this.elements.nextBtn.addEventListener('click', () => {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
      this.render();
    });
    
    // Month/Year modal
    this.elements.monthYearBtn.addEventListener('click', () => {
      this.openMonthYearModal();
    });
    
    // Footer buttons
    this.elements.todayBtn.addEventListener('click', () => {
      this.currentDate = new Date();
      this.selectedDate = new Date();
      this.render();
      this.updateInput();
      this.close();
    });
    
    this.elements.clearBtn.addEventListener('click', () => {
      this.selectedDate = null;
      this.updateInput();
      this.render();
    });
    
    this.elements.closeBtn.addEventListener('click', () => {
      this.close();
    });
    
    // Modal events
    this.elements.modalClose.addEventListener('click', () => {
      this.closeMonthYearModal();
    });
    
    this.elements.yearInput.addEventListener('input', (e) => {
      this.tempYear = parseInt(e.target.value);
    });
    
    this.elements.yearPrev.addEventListener('click', () => {
      this.tempYear--;
      this.elements.yearInput.value = this.tempYear;
    });
    
    this.elements.yearNext.addEventListener('click', () => {
      this.tempYear++;
      this.elements.yearInput.value = this.tempYear;
    });
    
    // Enhanced outside click to close
    document.addEventListener('click', (e) => {
      // Close main dropdown if clicking outside
      if (this.isOpen && !this.input.contains(e.target) && !this.dropdown.contains(e.target)) {
        this.close();
      }
      
      // Close month/year modal if clicking outside
      if (this.isMonthYearModalOpen && !this.elements.modal.contains(e.target) && !this.elements.monthYearBtn.contains(e.target)) {
        this.closeMonthYearModal();
      }
    });
    
    // Enhanced keyboard support
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.isMonthYearModalOpen) {
          this.closeMonthYearModal();
        } else if (this.isOpen) {
          this.close();
        }
      }
    });
    
    // Close on window blur (when user switches tabs/apps)
    window.addEventListener('blur', () => {
      if (this.isOpen) {
        this.close();
      }
    });
    
    // Close on scroll (optional - uncomment if needed)
    // window.addEventListener('scroll', () => {
    //   if (this.isOpen) {
    //     this.close();
    //   }
    // });
    
    // Handle scroll to reposition dropdown
    window.addEventListener('scroll', () => {
      if (this.isOpen) {
        this.positionDropdown();
      }
    });
    
    // Handle resize to reposition dropdown
    window.addEventListener('resize', () => {
      if (this.isOpen) {
        this.positionDropdown();
      }
    });
  }
  
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
  
  open() {
    this.isOpen = true;
    this.dropdown.classList.remove('hidden');
    this.render();
    this.positionDropdown();
  }
  
  positionDropdown() {
    const inputRect = this.input.getBoundingClientRect();
    const dropdownHeight = 350; // Reduced height for better fit
    const headerHeight = 64;
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      // Mobile: Center on screen
      this.dropdown.style.position = 'fixed';
      this.dropdown.style.top = '50%';
      this.dropdown.style.left = '50%';
      this.dropdown.style.transform = 'translate(-50%, -50%)';
      this.dropdown.style.width = 'calc(100vw - 2rem)';
      this.dropdown.style.maxWidth = '20rem';
      this.dropdown.style.zIndex = '20';
      return;
    }
    
    // Desktop: Simple positioning logic
    this.dropdown.style.position = 'fixed';
    this.dropdown.style.left = `${inputRect.left}px`;
    this.dropdown.style.width = '20rem';
    this.dropdown.style.zIndex = '20';
    this.dropdown.style.transform = 'none';
    
    // Calculate space
    const spaceAbove = inputRect.top;
    const spaceBelow = window.innerHeight - inputRect.bottom;
    
    // Simple logic: prefer below, avoid header overlap
    if (spaceBelow >= dropdownHeight) {
      // Open below
      this.dropdown.style.top = `${inputRect.bottom + 4}px`;
    } else if (spaceAbove >= dropdownHeight + headerHeight) {
      // Open above (only if won't hit header)
      this.dropdown.style.top = `${inputRect.top - dropdownHeight - 4}px`;
    } else {
      // Default to below even if tight
      this.dropdown.style.top = `${inputRect.bottom + 4}px`;
    }
  }
  
  close() {
    this.isOpen = false;
    this.dropdown.classList.add('hidden');
    this.closeMonthYearModal();
    
    // Remove focus from input
    this.input.blur();
  }
  
  render() {
    // Update month/year display
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];
    this.elements.monthYearText.textContent = 
      `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
    
    // Render calendar
    this.renderCalendar();
  }
  
  renderCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    this.elements.daysGrid.innerHTML = '';
    
    // Previous month days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const day = new Date(year, month - 1, 0).getDate() - i;
      this.createDayButton(day, true);
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      this.createDayButton(day, false);
    }
    
    // Next month days
    const totalCells = this.elements.daysGrid.children.length;
    for (let day = 1; day <= 42 - totalCells; day++) {
      this.createDayButton(day, true);
    }
  }
  
  createDayButton(day, isOtherMonth) {
    const button = document.createElement('button');
    button.className = `w-8 h-8 flex items-center justify-center text-sm font-medium rounded-lg transition-colors ${
      isOtherMonth 
        ? 'text-gray-400 dark:text-gray-600' 
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
    }`;
    button.textContent = day;
    button.type = 'button';
    
    // Check if today
    const today = new Date();
    const currentYear = this.currentDate.getFullYear();
    const currentMonth = this.currentDate.getMonth();
    
    if (!isOtherMonth && day === today.getDate() && currentYear === today.getFullYear() && currentMonth === today.getMonth()) {
      button.classList.add('bg-brand-100', 'dark:bg-brand-900', 'text-brand-700', 'dark:text-brand-300', 'font-semibold');
    }
    
    // Check if selected
    if (this.selectedDate && !isOtherMonth && day === this.selectedDate.getDate() && 
        currentYear === this.selectedDate.getFullYear() && currentMonth === this.selectedDate.getMonth()) {
      button.classList.remove('hover:bg-gray-100', 'dark:hover:bg-gray-700');
      button.classList.add('bg-brand-600', 'text-white', 'font-semibold');
    }
    
    // Click handler
    button.addEventListener('click', () => {
      if (!isOtherMonth) {
        this.selectDate(day);
      } else {
        // Navigate to other month
        if (day > 15) {
          this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        } else {
          this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        }
        this.render();
      }
    });
    
    this.elements.daysGrid.appendChild(button);
  }
  
  selectDate(day) {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    this.selectedDate = new Date(year, month, day);
    this.updateInput();
    this.render();
    this.close();
  }
  
  updateInput() {
    if (this.selectedDate) {
      let formattedDate;
      const day = this.selectedDate.getDate();
      const month = this.selectedDate.getMonth() + 1;
      const year = this.selectedDate.getFullYear();
      
      switch (this.options.format) {
        case 'dd-mm-yyyy':
          formattedDate = `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`;
          break;
        case 'mm-dd-yyyy':
          formattedDate = `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}-${year}`;
          break;
        case 'yyyy-mm-dd':
          formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
          break;
        case 'dd/mm/yyyy':
          formattedDate = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
          break;
        case 'mm/dd/yyyy':
          formattedDate = `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;
          break;
        case 'short':
          formattedDate = this.selectedDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          });
          break;
        case 'numeric':
          formattedDate = this.selectedDate.toLocaleDateString('en-US');
          break;
        case 'long':
        default:
          formattedDate = this.selectedDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          });
          break;
      }
      this.input.value = formattedDate;
    } else {
      this.input.value = '';
    }
  }
  
  openMonthYearModal() {
    this.tempMonth = this.currentDate.getMonth();
    this.tempYear = this.currentDate.getFullYear();
    
    // Update year input
    this.elements.yearInput.value = this.tempYear;
    
    // Render month grid
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    this.elements.monthsGrid.innerHTML = '';
    
    monthNames.forEach((name, index) => {
      const btn = document.createElement('button');
      btn.className = `px-3 py-2 rounded-lg text-sm font-medium ${
        index === this.tempMonth
          ? 'bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300'
          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
      }`;
      btn.textContent = name;
      btn.addEventListener('click', () => {
        this.tempMonth = index;
        this.applyMonthYearSelection();
      });
      this.elements.monthsGrid.appendChild(btn);
    });
    
    // Show modal
    this.isMonthYearModalOpen = true;
    this.elements.modal.classList.remove('hidden');
  }
  
  closeMonthYearModal() {
    this.isMonthYearModalOpen = false;
    this.elements.modal.classList.add('hidden');
  }
  
  applyMonthYearSelection() {
    this.currentDate.setMonth(this.tempMonth);
    this.currentDate.setFullYear(this.tempYear);
    this.closeMonthYearModal();
    this.render();
  }
  
  // Public API methods
  destroy() {
    if (this.icon) this.icon.remove();
    if (this.dropdown) this.dropdown.remove();
  }
  
  // Static methods for easy initialization
  static init(selector) {
    const element = typeof selector === 'string' ? document.getElementById(selector) : selector;
    if (element && element.id) {
      return new DatePicker(element.id);
    }
    console.error('DatePicker.init() requires an element with an ID');
    return null;
  }
  
  static initAll(selector = '[data-date-picker]') {
    const elements = document.querySelectorAll(selector);
    const pickers = [];
    elements.forEach(element => {
      if (element.id) {
        pickers.push(new DatePicker(element.id));
      }
    });
    return pickers;
  }
  
  static closeAll() {
    // Close all date pickers by triggering outside click
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    document.body.dispatchEvent(event);
  }
}

/**
 * Professional Date Range Picker Modal
 * Single modal for selecting from and to dates
 */
class DateRangeModal {
  constructor(triggerButtonId, options = {}) {
    this.triggerButton = document.getElementById(triggerButtonId);
    
    if (!this.triggerButton) {
      console.error(`Date range modal trigger button "${triggerButtonId}" not found`);
      return;
    }
    
    // Configuration options
    this.options = {
      format: 'dd-mm-yyyy',
      placeholder: 'Select date range...',
      ...options
    };
    
    // State
    this.currentDate = new Date();
    this.fromDate = new Date(); // Default to today
    this.toDate = null;
    this.isOpen = false;
    this.isMonthYearModalOpen = false;
    this.activeInput = null; // 'from' or 'to'
    this.tempMonth = this.currentDate.getMonth();
    this.tempYear = this.currentDate.getFullYear();
    
    // Initialize
    this.createHTML();
    this.attachEvents();
    this.render();
  }
  
  createHTML() {
    // Create modal overlay
    this.modal = document.createElement('div');
    this.modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 hidden';
    this.modal.innerHTML = `
      <div class="flex items-center justify-center min-h-screen p-4">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-md relative">
          <!-- Header -->
          <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Select Date Range</h3>
            <button id="range-modal-close" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <!-- Range Info -->
          <div class="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">From Date</label>
                <div class="flex items-center gap-2">
                  <input type="text" id="modal-from-input" class="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" placeholder="25-10-2025" readonly>
                  <button id="modal-from-btn" class="px-3 py-2 text-sm bg-brand-600 hover:bg-brand-700 text-white rounded-lg">Select</button>
                </div>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">To Date</label>
                <div class="flex items-center gap-2">
                  <input type="text" id="modal-to-input" class="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" placeholder="30-10-2025" readonly>
                  <button id="modal-to-btn" class="px-3 py-2 text-sm bg-brand-600 hover:bg-brand-700 text-white rounded-lg">Select</button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Calendar -->
          <div class="p-4">
            <!-- Calendar Header -->
            <div class="flex items-center justify-between mb-4">
              <button id="modal-prev" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              <button id="modal-month-year" class="px-3 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold">
                <span id="modal-month-year-text">January 2024</span>
              </button>
              <button id="modal-next" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
            
            <!-- Weekdays -->
            <div class="grid grid-cols-7 gap-1 mb-2">
              <div class="text-center text-xs font-semibold text-gray-600 dark:text-gray-300 py-2">Sun</div>
              <div class="text-center text-xs font-semibold text-gray-600 dark:text-gray-300 py-2">Mon</div>
              <div class="text-center text-xs font-semibold text-gray-600 dark:text-gray-300 py-2">Tue</div>
              <div class="text-center text-xs font-semibold text-gray-600 dark:text-gray-300 py-2">Wed</div>
              <div class="text-center text-xs font-semibold text-gray-600 dark:text-gray-300 py-2">Thu</div>
              <div class="text-center text-xs font-semibold text-gray-600 dark:text-gray-300 py-2">Fri</div>
              <div class="text-center text-xs font-semibold text-gray-600 dark:text-gray-300 py-2">Sat</div>
            </div>
            
            <!-- Days Grid -->
            <div id="modal-days" class="grid grid-cols-7 gap-1"></div>
          </div>
          
          <!-- Footer -->
          <div class="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
            <button id="modal-today" class="px-3 py-1 text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 font-medium">
              Today
            </button>
            <div class="flex gap-2">
              <button id="modal-clear" class="px-3 py-1 text-sm text-gray-600 dark:text-gray-400">
                Clear
              </button>
              <button id="modal-apply" class="px-3 py-1 text-sm bg-brand-600 hover:bg-brand-700 text-white rounded-md">
                Apply
              </button>
            </div>
          </div>

          <!-- Month/Year Modal -->
          <div id="modal-month-year-modal" class="absolute inset-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-3xl border border-white/30 dark:border-gray-700/50 rounded-lg shadow-2xl p-4 hidden z-50">
            <div class="modal-content h-full flex flex-col gap-4">
              <div class="modal-header flex items-center justify-between p-3 bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm rounded-lg border border-white/10 dark:border-gray-700/20">
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Select Month & Year</h3>
                <button id="modal-close-month-year" class="close-btn p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-700/20 rounded-lg">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              <div class="year-section p-3 bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm rounded-lg border border-white/10 dark:border-gray-700/20">
                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Year</label>
                <div class="year-controls flex items-center gap-2">
                  <button id="modal-year-prev" class="year-nav-btn p-1.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/20 dark:hover:bg-gray-700/20 rounded-lg">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                  </button>
                  <input type="number" id="modal-year-input" class="flex-1 text-center bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-lg px-3 py-2 text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:bg-white/30 dark:focus:bg-gray-800/30" min="1900" max="2100">
                  <button id="modal-year-next" class="year-nav-btn p-1.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/20 dark:hover:bg-gray-700/20 rounded-lg">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>
                </div>
              </div>
              <div id="modal-months" class="month-grid grid grid-cols-3 gap-2 p-3 bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm rounded-lg border border-white/10 dark:border-gray-700/20 flex-1">
                <!-- Month buttons will be rendered here -->
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(this.modal);
    
    // Store element references
    this.elements = {
      modal: this.modal,
      closeBtn: document.getElementById('range-modal-close'),
      fromInput: document.getElementById('modal-from-input'),
      toInput: document.getElementById('modal-to-input'),
      fromBtn: document.getElementById('modal-from-btn'),
      toBtn: document.getElementById('modal-to-btn'),
      prevBtn: document.getElementById('modal-prev'),
      nextBtn: document.getElementById('modal-next'),
      monthYearBtn: document.getElementById('modal-month-year'),
      monthYearText: document.getElementById('modal-month-year-text'),
      daysGrid: document.getElementById('modal-days'),
      todayBtn: document.getElementById('modal-today'),
      clearBtn: document.getElementById('modal-clear'),
      applyBtn: document.getElementById('modal-apply'),
      monthYearModal: document.getElementById('modal-month-year-modal'),
      closeMonthYearBtn: document.getElementById('modal-close-month-year'),
      yearPrev: document.getElementById('modal-year-prev'),
      yearInput: document.getElementById('modal-year-input'),
      yearNext: document.getElementById('modal-year-next'),
      monthsGrid: document.getElementById('modal-months')
    };
  }
  
  attachEvents() {
    // Trigger button click
    this.triggerButton.addEventListener('click', () => {
      this.open();
    });
    
    // Modal close events
    this.elements.closeBtn.addEventListener('click', () => {
      this.close();
    });
    
    this.elements.modal.addEventListener('click', (e) => {
      if (e.target === this.elements.modal) {
        this.close();
      }
    });
    
    // From/To button events
    this.elements.fromBtn.addEventListener('click', () => {
      this.activeInput = 'from';
      this.updateButtonStates();
    });
    
    this.elements.toBtn.addEventListener('click', () => {
      // Only allow to date selection if from date is set
      if (this.fromDate) {
        this.activeInput = 'to';
        this.updateButtonStates();
      } else {
        // Show visual feedback that from date must be selected first
        this.showFromDateRequiredMessage();
      }
    });
    
    // Navigation events
    this.elements.prevBtn.addEventListener('click', () => {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
      this.render();
    });
    
    this.elements.nextBtn.addEventListener('click', () => {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
      this.render();
    });
    
    this.elements.monthYearBtn.addEventListener('click', () => {
      this.openMonthYearModal();
    });
    
    this.elements.todayBtn.addEventListener('click', () => {
      const today = new Date();
      if (this.activeInput === 'from') {
        this.fromDate = new Date(today);
        this.toDate = null;
      } else {
        this.toDate = new Date(today);
        if (!this.fromDate) {
          this.fromDate = new Date(today);
        }
      }
      this.updateInputs();
      this.render();
    });
    
    this.elements.clearBtn.addEventListener('click', () => {
      this.fromDate = null; // Reset to null to enforce from date requirement
      this.toDate = null;
      this.activeInput = 'from'; // Switch back to from input
      this.updateInputs();
      this.updateButtonStates();
      this.render();
    });
    
    this.elements.applyBtn.addEventListener('click', () => {
      this.applySelection();
    });
    
    // Month/Year modal events
    this.elements.closeMonthYearBtn.addEventListener('click', () => {
      this.closeMonthYearModal();
    });
    
    this.elements.yearInput.addEventListener('input', (e) => {
      this.tempYear = parseInt(e.target.value);
    });
    
    this.elements.yearPrev.addEventListener('click', () => {
      this.tempYear--;
      this.elements.yearInput.value = this.tempYear;
    });
    
    this.elements.yearNext.addEventListener('click', () => {
      this.tempYear++;
      this.elements.yearInput.value = this.tempYear;
    });
    
    // Keyboard support
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.isMonthYearModalOpen) {
          this.closeMonthYearModal();
        } else if (this.isOpen) {
          this.close();
        }
      }
    });
  }
  
  open() {
    this.isOpen = true;
    this.activeInput = 'from';
    
    // If no from date is set, default to today
    if (!this.fromDate) {
      this.fromDate = new Date();
    }
    
    this.modal.classList.remove('hidden');
    this.updateInputs();
    this.updateButtonStates();
    this.render();
  }
  
  close() {
    this.isOpen = false;
    this.modal.classList.add('hidden');
    this.closeMonthYearModal();
    this.activeInput = null;
  }
  
  updateButtonStates() {
    // Reset button styles
    this.elements.fromBtn.className = 'px-3 py-2 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded-lg';
    
    // Set to button style based on from date availability
    if (this.fromDate) {
      this.elements.toBtn.className = 'px-3 py-2 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded-lg';
    } else {
      this.elements.toBtn.className = 'px-3 py-2 text-sm bg-gray-400 text-gray-200 rounded-lg cursor-not-allowed';
    }
    
    // Highlight active button
    if (this.activeInput === 'from') {
      this.elements.fromBtn.className = 'px-3 py-2 text-sm bg-brand-600 hover:bg-brand-700 text-white rounded-lg';
    } else if (this.activeInput === 'to' && this.fromDate) {
      this.elements.toBtn.className = 'px-3 py-2 text-sm bg-brand-600 hover:bg-brand-700 text-white rounded-lg';
    }
  }
  
  render() {
    this.elements.monthYearText.textContent = `${this.getMonthName(this.currentDate.getMonth())} ${this.currentDate.getFullYear()}`;
    this.renderDays();
  }
  
  renderDays() {
    this.elements.daysGrid.innerHTML = '';
    
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    
    // Render previous month's days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      this.elements.daysGrid.appendChild(this.createDayElement(day, true));
    }
    
    // Render current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      this.elements.daysGrid.appendChild(this.createDayElement(day, false));
    }
    
    // Render next month's days to fill the grid
    const totalCells = this.elements.daysGrid.children.length;
    const remainingCells = 42 - totalCells;
    
    for (let day = 1; day <= remainingCells; day++) {
      this.elements.daysGrid.appendChild(this.createDayElement(day, true));
    }
  }
  
  createDayElement(day, isOtherMonth) {
    const dayElement = document.createElement('button');
    dayElement.className = `w-8 h-8 flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer ${isOtherMonth ? 'text-gray-400 dark:text-gray-600' : ''}`;
    dayElement.textContent = day;
    dayElement.type = 'button';
    
    const today = new Date();
    const currentYear = this.currentDate.getFullYear();
    const currentMonth = this.currentDate.getMonth();
    const currentDate = new Date(currentYear, currentMonth, day);
    
    // Check if this date is today
    if (!isOtherMonth && day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
      dayElement.classList.add('bg-brand-100', 'dark:bg-brand-900', 'text-brand-700', 'dark:text-brand-300', 'font-semibold');
    }
    
    // Check if this date is in range
    if (this.fromDate && this.toDate) {
      if (currentDate >= this.fromDate && currentDate <= this.toDate) {
        dayElement.classList.add('bg-brand-100', 'dark:bg-brand-900', 'text-brand-700', 'dark:text-brand-300');
      }
      if (currentDate.getTime() === this.fromDate.getTime()) {
        dayElement.classList.add('bg-brand-500', 'text-white', 'font-semibold');
      }
      if (currentDate.getTime() === this.toDate.getTime()) {
        dayElement.classList.add('bg-brand-500', 'text-white', 'font-semibold');
      }
    } else if (this.fromDate && currentDate.getTime() === this.fromDate.getTime()) {
      dayElement.classList.add('bg-brand-500', 'text-white', 'font-semibold');
    }
    
    dayElement.addEventListener('click', () => {
      if (!isOtherMonth) {
        if (this.activeInput === 'from') {
          this.fromDate = new Date(currentYear, currentMonth, day);
          this.toDate = null;
          this.activeInput = 'to';
          this.updateButtonStates();
        } else if (this.activeInput === 'to') {
          // Only allow to date selection if from date is set
          if (this.fromDate) {
            this.toDate = new Date(currentYear, currentMonth, day);
            if (this.toDate < this.fromDate) {
              this.fromDate = this.toDate;
            }
          } else {
            this.showFromDateRequiredMessage();
            return; // Don't proceed with selection
          }
        }
        this.updateInputs();
        this.render();
      } else {
        // Navigate to other month
        this.currentDate.setMonth(this.currentDate.getMonth() + (day < 15 ? 1 : -1));
        this.render();
      }
    });
    
    return dayElement;
  }
  
  updateInputs() {
    this.elements.fromInput.value = this.fromDate ? this.formatDate(this.fromDate) : '';
    this.elements.toInput.value = this.toDate ? this.formatDate(this.toDate) : '';
  }
  
  formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    
    switch (this.options.format) {
      case 'dd-mm-yyyy':
        return `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`;
      case 'mm-dd-yyyy':
        return `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}-${year}`;
      case 'yyyy-mm-dd':
        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      case 'dd/mm/yyyy':
        return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
      case 'mm/dd/yyyy':
        return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;
      case 'short':
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      case 'numeric':
        return date.toLocaleDateString('en-US');
      case 'long':
      default:
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }
  }
  
  getMonthName(monthIndex) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return monthNames[monthIndex];
  }
  
  openMonthYearModal() {
    this.isMonthYearModalOpen = true;
    this.tempMonth = this.currentDate.getMonth();
    this.tempYear = this.currentDate.getFullYear();
    
    this.elements.yearInput.value = this.tempYear;
    this.elements.monthsGrid.innerHTML = '';
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    monthNames.forEach((name, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `
        px-2 py-1.5 text-sm font-medium rounded-lg
        ${index === this.tempMonth
          ? 'bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 border border-brand-300 dark:border-brand-400'
          : 'bg-white/20 dark:bg-gray-800/20 text-gray-700 dark:text-gray-300 border border-gray-300/50 dark:border-gray-600/50 hover:bg-brand-10 dark:hover:bg-brand-20 hover:border-brand-400 dark:hover:border-brand-500 hover:text-brand-700 dark:hover:text-brand-300'
        }`;
      btn.textContent = name;
      btn.addEventListener('click', () => {
        this.tempMonth = index;
        this.applyMonthYearSelection();
      });
      this.elements.monthsGrid.appendChild(btn);
    });
    
    this.elements.monthYearModal.classList.remove('hidden');
  }
  
  closeMonthYearModal() {
    this.isMonthYearModalOpen = false;
    this.elements.monthYearModal.classList.add('hidden');
  }
  
  applyMonthYearSelection() {
    this.currentDate.setMonth(this.tempMonth);
    this.currentDate.setFullYear(this.tempYear);
    this.closeMonthYearModal();
    this.render();
  }
  
  showFromDateRequiredMessage() {
    // Create a temporary message element
    const message = document.createElement('div');
    message.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    message.textContent = 'Please select a "From Date" first!';
    
    document.body.appendChild(message);
    
    // Remove message after 3 seconds
    setTimeout(() => {
      if (message.parentNode) {
        message.parentNode.removeChild(message);
      }
    }, 3000);
    
    // Also shake the to button for visual feedback
    this.elements.toBtn.classList.add('animate-pulse');
    setTimeout(() => {
      this.elements.toBtn.classList.remove('animate-pulse');
    }, 1000);
  }
  
  applySelection() {
    // Ensure from date is always set (default to today if not set)
    if (!this.fromDate) {
      this.fromDate = new Date();
    }
    
    // Update the trigger button with the selected range
    if (this.fromDate && this.toDate) {
      this.triggerButton.value = `${this.formatDate(this.fromDate)} - ${this.formatDate(this.toDate)}`;
    } else if (this.fromDate) {
      this.triggerButton.value = this.formatDate(this.fromDate);
    } else {
      this.triggerButton.value = '';
    }
    
    // Trigger change event
    this.triggerButton.dispatchEvent(new Event('change'));
    
    this.close();
  }
  
  // Public API methods
  destroy() {
    if (this.modal) this.modal.remove();
  }
  
  // Static methods for easy initialization
  static init(triggerButtonId, options = {}) {
    return new DateRangeModal(triggerButtonId, options);
  }
}

/**
 * Professional Time Picker (12-Hour Format)
 * Optimized for 12-hour format with AM/PM
 */
class TimePicker {
  constructor(inputId, options = {}) {
    this.input = document.getElementById(inputId);
    if (!this.input) {
      console.error(`Time picker input "${inputId}" not found`);
      return;
    }
    
    // Configuration options (optimized for 12-hour)
    this.options = {
      format: '12', // Always 12-hour format
      placeholder: 'Select time...',
      step: 15, // Minutes step (15, 30, 60)
      ...options
    };
    
    // State
    this.selectedTime = null;
    this.isOpen = false;
    this.hours = 12; // Start with 12 (noon)
    this.minutes = 0;
    this.amPm = 'PM';
    
    // Initialize
    this.createHTML();
    this.attachEvents();
    this.updateDisplay();
    this.updateButtonStates();
  }
  
  createHTML() {
    // Make parent relative for positioning
    this.input.parentElement.style.position = 'relative';
    
    // Add clock icon
    this.addIcon();
    
    // Create dropdown
    this.dropdown = document.createElement('div');
    this.dropdown.className = 'time-picker-dropdown w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl hidden';
    this.dropdown.style.position = 'fixed';
    this.dropdown.style.zIndex = '20';
    
    this.dropdown.innerHTML = `
      <!-- Time Display -->
      <div class="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <div class="text-center">
          <div id="${this.input.id}-time-display" class="text-3xl font-bold text-gray-900 dark:text-white">12:00 PM</div>
        </div>
      </div>
      
      <!-- Time Controls -->
      <div class="p-3 sm:p-4">
        <!-- Hours (1-12) -->
        <div class="mb-3">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Hours</label>
          <div class="grid grid-cols-4 gap-1.5 sm:gap-2">
            ${Array.from({length: 12}, (_, i) => {
              const hour = i + 1; // 1-12
              return `<button class="time-hour-btn px-2 py-1.5 sm:px-3 sm:py-2 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-brand-100 dark:hover:bg-brand-900 hover:text-brand-700 dark:hover:text-brand-300" data-hour="${hour}">${hour.toString().padStart(2, '0')}</button>`;
            }).join('')}
          </div>
        </div>
        
        <!-- Minutes -->
        <div class="mb-3">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Minutes</label>
          <div class="grid grid-cols-4 gap-1.5 sm:gap-2">
            ${Array.from({length: 60 / this.options.step}, (_, i) => {
              const minute = i * this.options.step;
              return `<button class="time-minute-btn px-2 py-1.5 sm:px-3 sm:py-2 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-brand-100 dark:hover:bg-brand-900 hover:text-brand-700 dark:hover:text-brand-300" data-minute="${minute}">${minute.toString().padStart(2, '0')}</button>`;
            }).join('')}
          </div>
        </div>
        
        <!-- AM/PM -->
        <div class="mb-3">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Period</label>
          <div class="grid grid-cols-2 gap-1.5 sm:gap-2">
            <button class="time-ampm-btn px-2 py-1.5 sm:px-3 sm:py-2 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-brand-100 dark:hover:bg-brand-900 hover:text-brand-700 dark:hover:text-brand-300" data-ampm="AM">AM</button>
            <button class="time-ampm-btn px-2 py-1.5 sm:px-3 sm:py-2 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-brand-100 dark:hover:bg-brand-900 hover:text-brand-700 dark:hover:text-brand-300" data-ampm="PM">PM</button>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="flex items-center justify-between p-3 border-t border-gray-200 dark:border-gray-700">
        <button id="${this.input.id}-time-now" class="px-3 py-1 text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 font-medium">
          Now
        </button>
        <div class="flex gap-2">
          <button id="${this.input.id}-time-clear" class="px-3 py-1 text-sm text-gray-600 dark:text-gray-400">
            Clear
          </button>
          <button id="${this.input.id}-time-apply" class="px-3 py-1 text-sm bg-brand-600 hover:bg-brand-700 text-white rounded-md">
            Apply
          </button>
        </div>
      </div>
    `;
    
    this.input.parentElement.appendChild(this.dropdown);
    
    // Store element references
    this.elements = {
      timeDisplay: document.getElementById(`${this.input.id}-time-display`),
      nowBtn: document.getElementById(`${this.input.id}-time-now`),
      clearBtn: document.getElementById(`${this.input.id}-time-clear`),
      applyBtn: document.getElementById(`${this.input.id}-time-apply`),
      hourBtns: this.dropdown.querySelectorAll('.time-hour-btn'),
      minuteBtns: this.dropdown.querySelectorAll('.time-minute-btn'),
      amPmBtns: this.dropdown.querySelectorAll('.time-ampm-btn')
    };
  }
  
  addIcon() {
    this.input.style.paddingRight = '2.5rem';
    this.input.style.cursor = 'pointer';
    this.input.style.readOnly = true;
    
    const icon = document.createElement('div');
    icon.className = 'absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none';
    icon.innerHTML = `
      <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    `;
    this.input.parentElement.appendChild(icon);
  }
  
  attachEvents() {
    // Input click
    this.input.addEventListener('click', () => {
      this.toggle();
    });
    
    // Hour buttons
    this.elements.hourBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.hours = parseInt(btn.dataset.hour); // 1-12
        this.updateDisplay();
        this.updateButtonStates();
      });
    });
    
    // Minute buttons
    this.elements.minuteBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.minutes = parseInt(btn.dataset.minute);
        this.updateDisplay();
        this.updateButtonStates();
      });
    });
    
    // AM/PM buttons
    this.elements.amPmBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.amPm = btn.dataset.ampm;
        this.updateDisplay();
        this.updateButtonStates();
      });
    });
    
    // Footer buttons
    this.elements.nowBtn.addEventListener('click', () => {
      this.setCurrentTime();
    });
    
    this.elements.clearBtn.addEventListener('click', () => {
      this.clear();
    });
    
    this.elements.applyBtn.addEventListener('click', () => {
      this.apply();
    });
    
    // Outside click to close
    document.addEventListener('click', (e) => {
      if (this.isOpen && !this.input.contains(e.target) && !this.dropdown.contains(e.target)) {
        this.close();
      }
    });
    
    // Keyboard support
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
    
    // Handle resize to hide dropdown when switching device views
    let resizeTimeout;
    window.addEventListener('resize', () => {
      if (this.isOpen) {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          // Hide dropdown when switching device views for cleaner UX
          this.close();
        }, 100); // Quick response to device changes
      }
    });
    
    // Handle scroll to reposition dropdown (same as date picker)
    window.addEventListener('scroll', () => {
      if (this.isOpen) {
        this.positionDropdown();
      }
    });
  }
  
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
  
  open() {
    this.isOpen = true;
    this.dropdown.classList.remove('hidden');
    this.updateDisplay();
    this.updateButtonStates();
    this.positionDropdown();
  }
  
  positionDropdown() {
    // Force a complete style reset
    this.dropdown.style.cssText = '';
    
    // Get fresh input position data
    const inputRect = this.input.getBoundingClientRect();
    const dropdownHeight = 350;
    const headerHeight = 64;
    const windowWidth = window.innerWidth;
    
    // Device detection
    const isSmallDevice = windowWidth <= 640;
    const isMediumDevice = windowWidth > 640 && windowWidth <= 1024;
    const isLargeDevice = windowWidth > 1024;
    
    // Set base styles
    this.dropdown.style.position = 'fixed';
    this.dropdown.style.zIndex = '20';
    this.dropdown.style.backgroundColor = '';
    this.dropdown.style.border = '';
    this.dropdown.style.borderRadius = '';
    this.dropdown.style.boxShadow = '';
    
    if (isSmallDevice) {
      // Mobile: Center on screen
      this.dropdown.style.top = '50%';
      this.dropdown.style.left = '50%';
      this.dropdown.style.transform = 'translate(-50%, -50%)';
      this.dropdown.style.width = 'calc(100vw - 1rem)';
      this.dropdown.style.maxWidth = '22rem';
      this.dropdown.style.maxHeight = '90vh';
      this.dropdown.style.overflowY = 'auto';
      return;
    }
    
    if (isMediumDevice) {
      // Tablet: Center with spacing
      this.dropdown.style.top = '50%';
      this.dropdown.style.left = '50%';
      this.dropdown.style.transform = 'translate(-50%, -50%)';
      this.dropdown.style.width = 'calc(100vw - 3rem)';
      this.dropdown.style.maxWidth = '24rem';
      this.dropdown.style.maxHeight = '80vh';
      this.dropdown.style.overflowY = 'auto';
      return;
    }
    
    // Desktop: Position relative to input
    this.dropdown.style.transform = 'none';
    this.dropdown.style.maxHeight = 'none';
    this.dropdown.style.overflowY = 'visible';
    this.dropdown.style.width = '20rem';
    
    // Check if input is visible and get its position
    if (!inputRect || inputRect.width === 0 || inputRect.height === 0) {
      // Fallback: center on screen
      this.dropdown.style.top = '50%';
      this.dropdown.style.left = '50%';
      this.dropdown.style.transform = 'translate(-50%, -50%)';
      return;
    }
    
    // Position relative to input
    this.dropdown.style.left = `${inputRect.left}px`;
    
    // Calculate available space
    const spaceAbove = inputRect.top;
    const spaceBelow = window.innerHeight - inputRect.bottom;
    
    // Position above or below based on available space
    if (spaceBelow >= dropdownHeight) {
      // Open below input
      this.dropdown.style.top = `${inputRect.bottom + 4}px`;
    } else if (spaceAbove >= dropdownHeight + headerHeight) {
      // Open above input (avoiding header)
      this.dropdown.style.top = `${inputRect.top - dropdownHeight - 4}px`;
    } else {
      // Default to below even if tight
      this.dropdown.style.top = `${inputRect.bottom + 4}px`;
    }
  }
  
  close() {
    this.isOpen = false;
    this.dropdown.classList.add('hidden');
    
    // Remove focus from input (same as date picker)
    this.input.blur();
  }
  
  updateDisplay() {
    // Always show 12-hour format with AM/PM in same line
    const displayHours = this.hours === 12 ? 12 : this.hours;
    this.elements.timeDisplay.textContent = `${displayHours.toString().padStart(2, '0')}:${this.minutes.toString().padStart(2, '0')} ${this.amPm}`;
  }
  
  updateButtonStates() {
    // Reset all button styles
    [...this.elements.hourBtns, ...this.elements.minuteBtns, ...this.elements.amPmBtns].forEach(btn => {
      btn.classList.remove('bg-brand-100', 'dark:bg-brand-900', 'text-brand-700', 'dark:text-brand-300');
      btn.classList.add('bg-gray-100', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300');
    });
    
    // Highlight selected hour (1-12)
    const selectedHourBtn = this.dropdown.querySelector(`[data-hour="${this.hours}"]`);
    if (selectedHourBtn) {
      selectedHourBtn.classList.remove('bg-gray-100', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300');
      selectedHourBtn.classList.add('bg-brand-100', 'dark:bg-brand-900', 'text-brand-700', 'dark:text-brand-300');
    }
    
    // Highlight selected minute
    const selectedMinuteBtn = this.dropdown.querySelector(`[data-minute="${this.minutes}"]`);
    if (selectedMinuteBtn) {
      selectedMinuteBtn.classList.remove('bg-gray-100', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300');
      selectedMinuteBtn.classList.add('bg-brand-100', 'dark:bg-brand-900', 'text-brand-700', 'dark:text-brand-300');
    }
    
    // Highlight selected AM/PM
    const selectedAmPmBtn = this.dropdown.querySelector(`[data-ampm="${this.amPm}"]`);
    if (selectedAmPmBtn) {
      selectedAmPmBtn.classList.remove('bg-gray-100', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300');
      selectedAmPmBtn.classList.add('bg-brand-100', 'dark:bg-brand-900', 'text-brand-700', 'dark:text-brand-300');
    }
  }
  
  setCurrentTime() {
    const now = new Date();
    const currentHours = now.getHours();
    this.minutes = Math.round(now.getMinutes() / this.options.step) * this.options.step;
    
    // Convert 24-hour to 12-hour format
    if (currentHours === 0) {
      this.hours = 12;
      this.amPm = 'AM';
    } else if (currentHours < 12) {
      this.hours = currentHours;
      this.amPm = 'AM';
    } else if (currentHours === 12) {
      this.hours = 12;
      this.amPm = 'PM';
    } else {
      this.hours = currentHours - 12;
      this.amPm = 'PM';
    }
    
    this.updateDisplay();
    this.updateButtonStates();
  }
  
  clear() {
    this.hours = 12;
    this.minutes = 0;
    this.amPm = 'PM';
    this.selectedTime = null;
    this.input.value = '';
    this.updateDisplay();
    this.updateButtonStates();
  }
  
  apply() {
    this.selectedTime = new Date();
    
    // Convert 12-hour format to 24-hour for internal storage
    let hour24;
    if (this.hours === 12) {
      hour24 = this.amPm === 'AM' ? 0 : 12;
    } else {
      hour24 = this.amPm === 'AM' ? this.hours : this.hours + 12;
    }
    
    this.selectedTime.setHours(hour24, this.minutes, 0, 0);
    
    this.input.value = this.formatTime(this.selectedTime);
    this.close();
    
    // Trigger change event
    this.input.dispatchEvent(new Event('change'));
  }
  
  formatTime(time) {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    
    // Convert to 12-hour format
    let displayHours;
    let amPm;
    
    if (hours === 0) {
      displayHours = 12;
      amPm = 'AM';
    } else if (hours < 12) {
      displayHours = hours;
      amPm = 'AM';
    } else if (hours === 12) {
      displayHours = 12;
      amPm = 'PM';
    } else {
      displayHours = hours - 12;
      amPm = 'PM';
    }
    
    return `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${amPm}`;
  }
  
  // Public API methods
  destroy() {
    if (this.dropdown) this.dropdown.remove();
  }
  
  // Static methods for easy initialization
  static init(inputId, options = {}) {
    return new TimePicker(inputId, options);
  }
  
  static initAll(selector = '[data-time-picker]') {
    const elements = document.querySelectorAll(selector);
    const pickers = [];
    elements.forEach(element => {
      if (element.id) {
        const format = element.getAttribute('data-time-format') || '24';
        const step = parseInt(element.getAttribute('data-time-step')) || 15;
        pickers.push(new TimePicker(element.id, { format, step }));
      }
    });
    return pickers;
  }
}

// Watch Style Time Picker Class
class WatchStyleTimePicker {
  constructor(input) {
    this.input = input;
    this.isOpen = false;
    this.hours = 12;
    this.minutes = 0;
    this.amPm = 'PM';
    this.isSelectingHours = true;
    
    this.createHTML();
    this.addIcon();
    this.attachEvents();
  }
  
  createHTML() {
    this.dropdown = document.createElement('div');
    this.dropdown.className = 'watch-time-picker-dropdown hidden fixed z-20 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 p-4';
    this.dropdown.style.width = '280px';
    this.dropdown.style.height = '220px';
    
    this.dropdown.innerHTML = `
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <div class="text-center flex-1">
          <div class="text-lg font-semibold text-gray-900 dark:text-white" id="${this.input.id}-watch-time-display">12:00 PM</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">
            <span class="cursor-pointer px-2 py-1 rounded ${this.isSelectingHours ? 'bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300' : 'text-gray-600 dark:text-gray-400'}" id="${this.input.id}-watch-hours-btn">Hours</span>
            <span class="mx-1">•</span>
            <span class="cursor-pointer px-2 py-1 rounded ${!this.isSelectingHours ? 'bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300' : 'text-gray-600 dark:text-gray-400'}" id="${this.input.id}-watch-minutes-btn">Minutes</span>
          </div>
        </div>
      </div>
      
      <!-- Clock Face (Cut Off Design) -->
      <div class="relative mx-auto" style="width: 200px; height: 140px;">
        <svg class="w-full h-full" viewBox="0 0 200 140">
          <!-- Cut Off Clock Arc (showing 9 to 3 o'clock) -->
          <path d="M 50 100 A 90 90 0 0 1 150 100" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-300 dark:text-gray-600"/>
          
          <!-- Hour Markers (9 to 3 o'clock) -->
          <g class="text-gray-600 dark:text-gray-400">
            <!-- 9 -->
            <text x="25" y="105" text-anchor="middle" class="text-sm font-semibold">9</text>
            <!-- 10 -->
            <text x="30" y="70" text-anchor="middle" class="text-xs">10</text>
            <!-- 11 -->
            <text x="50" y="40" text-anchor="middle" class="text-xs">11</text>
            <!-- 12 -->
            <text x="100" y="25" text-anchor="middle" class="text-sm font-semibold">12</text>
            <!-- 1 -->
            <text x="150" y="40" text-anchor="middle" class="text-xs">1</text>
            <!-- 2 -->
            <text x="170" y="70" text-anchor="middle" class="text-xs">2</text>
            <!-- 3 -->
            <text x="175" y="105" text-anchor="middle" class="text-sm font-semibold">3</text>
          </g>
          
          <!-- Minute Markers (partial arc) -->
          <g class="text-gray-400 dark:text-gray-500">
            ${Array.from({length: 30}, (_, i) => {
              const minute = i + 15; // Start from 15 minutes (9:15)
              const angle = (minute * 6) - 90; // Start from top (12 o'clock)
              const x = 100 + 80 * Math.cos(angle * Math.PI / 180);
              const y = 100 + 80 * Math.sin(angle * Math.PI / 180);
              const isHourMarker = minute % 5 === 0;
              const isQuarterMarker = minute % 15 === 0;
              
              if (isHourMarker) {
                return `<circle cx="${x}" cy="${y}" r="2" fill="currentColor" class="text-gray-600 dark:text-gray-400"/>`;
              } else if (isQuarterMarker) {
                return `<circle cx="${x}" cy="${y}" r="1.5" fill="currentColor" class="text-gray-500 dark:text-gray-500"/>`;
              } else {
                return `<circle cx="${x}" cy="${y}" r="1" fill="currentColor" class="text-gray-400 dark:text-gray-600"/>`;
              }
            }).join('')}
          </g>
          
          <!-- Clock Hands -->
          <line x1="100" y1="100" x2="100" y2="65" stroke="currentColor" stroke-width="4" stroke-linecap="round" class="text-gray-900 dark:text-white" id="${this.input.id}-watch-hour-hand"/>
          <line x1="100" y1="100" x2="100" y2="45" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="text-brand-600" id="${this.input.id}-watch-minute-hand"/>
          
          <!-- Center Dot -->
          <circle cx="100" cy="100" r="6" fill="currentColor" class="text-gray-900 dark:text-white"/>
          <circle cx="100" cy="100" r="3" fill="currentColor" class="text-white dark:text-gray-800"/>
          
          <!-- Cut Off Indicators -->
          <circle cx="50" cy="100" r="3" fill="currentColor" class="text-gray-400 dark:text-gray-500"/>
          <circle cx="150" cy="100" r="3" fill="currentColor" class="text-gray-400 dark:text-gray-500"/>
        </svg>
        
        <!-- Clickable Areas -->
        <div class="absolute inset-0 cursor-pointer" id="${this.input.id}-watch-click-area"></div>
      </div>
      
      <!-- AM/PM Toggle -->
      <div class="flex justify-center mt-4">
        <div class="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button class="px-3 py-1 text-sm font-medium rounded-md transition-colors ${this.amPm === 'AM' ? 'bg-white text-gray-900 dark:bg-gray-600 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400'}" id="${this.input.id}-watch-am-btn">AM</button>
          <button class="px-3 py-1 text-sm font-medium rounded-md transition-colors ${this.amPm === 'PM' ? 'bg-white text-gray-900 dark:bg-gray-600 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400'}" id="${this.input.id}-watch-pm-btn">PM</button>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="flex items-center justify-between mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <button id="${this.input.id}-watch-now" class="px-3 py-1 text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 font-medium">
          Now
        </button>
        <div class="flex gap-2">
          <button id="${this.input.id}-watch-clear" class="px-3 py-1 text-sm text-gray-600 dark:text-gray-400">
            Clear
          </button>
          <button id="${this.input.id}-watch-apply" class="px-3 py-1 text-sm bg-brand-600 hover:bg-brand-700 text-white rounded-md">
            Apply
          </button>
        </div>
      </div>
    `;
    
    this.input.parentElement.appendChild(this.dropdown);
    
    // Store element references
    this.elements = {
      timeDisplay: document.getElementById(`${this.input.id}-watch-time-display`),
      hoursBtn: document.getElementById(`${this.input.id}-watch-hours-btn`),
      minutesBtn: document.getElementById(`${this.input.id}-watch-minutes-btn`),
      hourHand: document.getElementById(`${this.input.id}-watch-hour-hand`),
      minuteHand: document.getElementById(`${this.input.id}-watch-minute-hand`),
      clickArea: document.getElementById(`${this.input.id}-watch-click-area`),
      amBtn: document.getElementById(`${this.input.id}-watch-am-btn`),
      pmBtn: document.getElementById(`${this.input.id}-watch-pm-btn`),
      nowBtn: document.getElementById(`${this.input.id}-watch-now`),
      clearBtn: document.getElementById(`${this.input.id}-watch-clear`),
      applyBtn: document.getElementById(`${this.input.id}-watch-apply`)
    };
  }
  
  addIcon() {
    this.input.style.paddingRight = '2.5rem';
    this.input.style.cursor = 'pointer';
    this.input.style.readOnly = true;
    
    const icon = document.createElement('div');
    icon.className = 'absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none';
    icon.innerHTML = `
      <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    `;
    this.input.parentElement.appendChild(icon);
  }
  
  attachEvents() {
    // Input click
    this.input.addEventListener('click', () => {
      this.toggle();
    });
    
    // Hours/Minutes toggle
    this.elements.hoursBtn.addEventListener('click', () => {
      this.isSelectingHours = true;
      this.updateSelectionMode();
    });
    
    this.elements.minutesBtn.addEventListener('click', () => {
      this.isSelectingHours = false;
      this.updateSelectionMode();
    });
    
    // Clock face clicks
    this.elements.clickArea.addEventListener('click', (e) => {
      this.handleClockClick(e);
    });
    
    // Clock face hover for preview
    this.elements.clickArea.addEventListener('mousemove', (e) => {
      this.handleClockHover(e);
    });
    
    this.elements.clickArea.addEventListener('mouseleave', () => {
      this.clearHoverPreview();
    });
    
    // AM/PM buttons
    this.elements.amBtn.addEventListener('click', () => {
      this.amPm = 'AM';
      this.updateAmPmButtons();
      this.updateDisplay();
      this.updateHands();
    });
    
    this.elements.pmBtn.addEventListener('click', () => {
      this.amPm = 'PM';
      this.updateAmPmButtons();
      this.updateDisplay();
      this.updateHands();
    });
    
    // Footer buttons
    this.elements.nowBtn.addEventListener('click', () => {
      this.setCurrentTime();
    });
    
    this.elements.clearBtn.addEventListener('click', () => {
      this.clear();
    });
    
    this.elements.applyBtn.addEventListener('click', () => {
      this.apply();
    });
    
    // Outside click to close
    document.addEventListener('click', (e) => {
      if (this.isOpen && !this.input.contains(e.target) && !this.dropdown.contains(e.target)) {
        this.close();
      }
    });
    
    // Keyboard support
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
    
    // Handle resize to hide dropdown when switching device views
    let resizeTimeout;
    window.addEventListener('resize', () => {
      if (this.isOpen) {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          this.close();
        }, 100);
      }
    });
  }
  
  handleClockClick(e) {
    const rect = this.elements.clickArea.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const clickX = e.clientX - rect.left - centerX;
    const clickY = e.clientY - rect.top - centerY;
    
    // Calculate distance from center to ensure click is within clock face
    const distance = Math.sqrt(clickX * clickX + clickY * clickY);
    const clockRadius = rect.width / 2;
    
    // Only process clicks within the clock face (not too close to center)
    if (distance < 20 || distance > clockRadius - 10) {
      return; // Click too close to center or outside clock
    }
    
    // Calculate angle from top (12 o'clock position)
    const angle = Math.atan2(clickY, clickX) * (180 / Math.PI);
    const normalizedAngle = (angle + 90 + 360) % 360;
    
    if (this.isSelectingHours) {
      // Select hour (1-12) - more precise calculation
      let hour = Math.round(normalizedAngle / 30);
      if (hour === 0) hour = 12;
      if (hour > 12) hour = hour - 12;
      this.hours = hour;
    } else {
      // Select minute (0-59) - more precise calculation
      let minute = Math.round(normalizedAngle / 6);
      if (minute === 60) minute = 0;
      this.minutes = minute;
    }
    
    this.updateDisplay();
    this.updateHands();
  }
  
  handleClockHover(e) {
    const rect = this.elements.clickArea.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const hoverX = e.clientX - rect.left - centerX;
    const hoverY = e.clientY - rect.top - centerY;
    
    // Calculate distance from center
    const distance = Math.sqrt(hoverX * hoverX + hoverY * hoverY);
    const clockRadius = rect.width / 2;
    
    // Only show preview for valid positions
    if (distance < 20 || distance > clockRadius - 10) {
      this.clearHoverPreview();
      return;
    }
    
    // Calculate angle and preview time
    const angle = Math.atan2(hoverY, hoverX) * (180 / Math.PI);
    const normalizedAngle = (angle + 90 + 360) % 360;
    
    let previewValue;
    if (this.isSelectingHours) {
      let hour = Math.round(normalizedAngle / 30);
      if (hour === 0) hour = 12;
      if (hour > 12) hour = hour - 12;
      previewValue = hour;
    } else {
      let minute = Math.round(normalizedAngle / 6);
      if (minute === 60) minute = 0;
      previewValue = minute;
    }
    
    // Show preview in time display
    this.showHoverPreview(previewValue);
  }
  
  showHoverPreview(value) {
    if (this.isSelectingHours) {
      const displayHours = value === 0 ? 12 : value;
      this.elements.timeDisplay.textContent = `${displayHours}:${this.minutes.toString().padStart(2, '0')} ${this.amPm}`;
    } else {
      const displayHours = this.hours === 0 ? 12 : this.hours;
      this.elements.timeDisplay.textContent = `${displayHours}:${value.toString().padStart(2, '0')} ${this.amPm}`;
    }
  }
  
  clearHoverPreview() {
    this.updateDisplay();
  }
  
  updateSelectionMode() {
    this.elements.hoursBtn.className = `cursor-pointer px-2 py-1 rounded ${this.isSelectingHours ? 'bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300' : 'text-gray-600 dark:text-gray-400'}`;
    this.elements.minutesBtn.className = `cursor-pointer px-2 py-1 rounded ${!this.isSelectingHours ? 'bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300' : 'text-gray-600 dark:text-gray-400'}`;
  }
  
  updateHands() {
    const hourAngle = (this.hours % 12) * 30 - 90;
    const minuteAngle = this.minutes * 6 - 90;
    
    this.elements.hourHand.style.transform = `rotate(${hourAngle}deg)`;
    this.elements.hourHand.style.transformOrigin = '100px 100px';
    
    this.elements.minuteHand.style.transform = `rotate(${minuteAngle}deg)`;
    this.elements.minuteHand.style.transformOrigin = '100px 100px';
  }
  
  updateDisplay() {
    const displayHours = this.hours === 0 ? 12 : this.hours;
    this.elements.timeDisplay.textContent = `${displayHours}:${this.minutes.toString().padStart(2, '0')} ${this.amPm}`;
  }
  
  updateAmPmButtons() {
    this.elements.amBtn.className = `px-3 py-1 text-sm font-medium rounded-md transition-colors ${this.amPm === 'AM' ? 'bg-white text-gray-900 dark:bg-gray-600 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400'}`;
    this.elements.pmBtn.className = `px-3 py-1 text-sm font-medium rounded-md transition-colors ${this.amPm === 'PM' ? 'bg-white text-gray-900 dark:bg-gray-600 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400'}`;
  }
  
  setCurrentTime() {
    const now = new Date();
    const currentHours = now.getHours();
    this.minutes = Math.round(now.getMinutes() / 5) * 5;
    
    // Convert 24-hour to 12-hour format
    if (currentHours === 0) {
      this.hours = 12;
      this.amPm = 'AM';
    } else if (currentHours < 12) {
      this.hours = currentHours;
      this.amPm = 'AM';
    } else if (currentHours === 12) {
      this.hours = 12;
      this.amPm = 'PM';
    } else {
      this.hours = currentHours - 12;
      this.amPm = 'PM';
    }
    
    this.updateDisplay();
    this.updateHands();
    this.updateAmPmButtons();
    this.apply();
  }
  
  clear() {
    this.hours = 12;
    this.minutes = 0;
    this.amPm = 'PM';
    this.updateDisplay();
    this.updateHands();
    this.updateAmPmButtons();
  }
  
  apply() {
    const displayHours = this.hours === 0 ? 12 : this.hours;
    this.input.value = `${displayHours}:${this.minutes.toString().padStart(2, '0')} ${this.amPm}`;
    this.close();
  }
  
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
  
  open() {
    this.isOpen = true;
    this.dropdown.classList.remove('hidden');
    this.positionDropdown();
  }
  
  close() {
    this.isOpen = false;
    this.dropdown.classList.add('hidden');
  }
  
  positionDropdown() {
    const inputRect = this.input.getBoundingClientRect();
    const dropdownHeight = 220; // Updated height for cut-off design
    const headerHeight = 64;
    
    // Set position
    this.dropdown.style.position = 'fixed';
    this.dropdown.style.zIndex = '20';
    this.dropdown.style.left = `${inputRect.left}px`;
    
    // Calculate available space
    const spaceAbove = inputRect.top;
    const spaceBelow = window.innerHeight - inputRect.bottom;
    
    // Position above or below based on available space
    if (spaceBelow >= dropdownHeight) {
      this.dropdown.style.top = `${inputRect.bottom + 4}px`;
    } else if (spaceAbove >= dropdownHeight + headerHeight) {
      this.dropdown.style.top = `${inputRect.top - dropdownHeight - 4}px`;
    } else {
      this.dropdown.style.top = `${inputRect.bottom + 4}px`;
    }
  }
  
  // Static methods for initialization
  static init(selector) {
    const input = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (input) {
      return new WatchStyleTimePicker(input);
    }
    return null;
  }
  
  static initAll(selector = '[data-time-picker-watch]') {
    const inputs = document.querySelectorAll(selector);
    return Array.from(inputs).map(input => new WatchStyleTimePicker(input));
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  // Initialize the existing custom date picker (if it exists)
  if (document.getElementById('customDatePicker')) {
    window.customDatePicker = new DatePicker('customDatePicker');
  }
  
  // Initialize date range modal
  if (document.getElementById('dateRangeModalTrigger')) {
    window.dateRangeModal = new DateRangeModal('dateRangeModalTrigger', {
      format: 'dd-mm-yyyy'
    });
  }
  
  // Auto-initialize all time pickers
  TimePicker.initAll();
  
  // Auto-initialize all watch style time pickers
  WatchStyleTimePicker.initAll();
  
  // Auto-initialize all inputs with data-date-picker attribute
  const datePickerInputs = document.querySelectorAll('[data-date-picker]');
  datePickerInputs.forEach(input => {
    if (input.id) {
      // Get format from data attribute
      const format = input.getAttribute('data-date-format') || 'long';
      new DatePicker(input.id, { format: format });
    } else {
      console.warn('Date picker input must have an ID:', input);
    }
  });
  
  // Auto-initialize all inputs with class 'date-picker'
  const datePickerClassInputs = document.querySelectorAll('.date-picker');
  datePickerClassInputs.forEach(input => {
    if (input.id) {
      // Get format from data attribute
      const format = input.getAttribute('data-date-format') || 'long';
      new DatePicker(input.id, { format: format });
    } else {
      console.warn('Date picker input must have an ID:', input);
    }
  });
});
