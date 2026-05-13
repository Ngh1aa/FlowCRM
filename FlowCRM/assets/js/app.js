// FlowCRM - Main Application JavaScript
// UX Optimized Version with LocalStorage Persistence

/**
 * Storage Utility - Single Source of Truth
 */
const Storage = {
  KEYS: {
    DEALS: 'flowcrm_deals',
    CUSTOMERS: 'flowcrm_customers',
    TASKS: 'flowcrm_tasks',
    MESSAGES: 'flowcrm_messages',
    ACTIVITIES: 'flowcrm_activities'
  },

  init() {
    if (!localStorage.getItem(this.KEYS.DEALS)) {
      this.save(this.KEYS.DEALS, [
        { id: '1', title: 'Thiết kế Website E-commerce', customer: 'Cty Alpha', value: 25000000, stage: 'qualification', tag: 'hot', date: '2023-10-25' },
        { id: '2', title: 'Gói SEO Tổng thể', customer: 'Nha khoa Smile', value: 12000000, stage: 'proposal', tag: 'warm', date: '2023-10-24' },
        { id: '3', title: 'Chạy Quảng cáo Facebook', customer: 'Shop Fashionista', value: 8000000, stage: 'negotiation', tag: 'hot', date: '2023-10-23' },
        { id: '4', title: 'Phần mềm Quản lý Kho', customer: 'Logistics Beta', value: 45000000, stage: 'closed', tag: 'won', date: '2023-10-20' },
        { id: '5', title: 'Tư vấn Chuyển đổi số', customer: 'Gỗ Việt', value: 30000000, stage: 'lost', tag: 'lost', date: '2023-10-15' }
      ]);
    }
    if (!localStorage.getItem(this.KEYS.CUSTOMERS)) {
      this.save(this.KEYS.CUSTOMERS, [
        { id: '1', name: 'Nguyễn Văn A', email: 'vanc@example.com', phone: '0901234567', status: 'active', company: 'Cty Alpha' },
        { id: '2', name: 'Trần Thị B', email: 'tranb@example.com', phone: '0912345678', status: 'prospect', company: 'Nha khoa Smile' },
        { id: '3', name: 'Lê Văn C', email: 'levanc@example.com', phone: '0987654321', status: 'inactive', company: 'Shop Fashionista' }
      ]);
    }
    if (!localStorage.getItem(this.KEYS.TASKS)) {
      this.save(this.KEYS.TASKS, [
        { id: '1', title: 'Gọi điện tư vấn khách hàng Alpha', deadline: '2023-10-26', priority: 'high', completed: false },
        { id: '2', title: 'Gửi báo giá cho Nha khoa Smile', deadline: '2023-10-26', priority: 'medium', completed: true }
      ]);
    }
    if (!localStorage.getItem(this.KEYS.ACTIVITIES)) {
      this.save(this.KEYS.ACTIVITIES, [
        { id: '1', type: 'deal', text: 'Bạn đã tạo deal <strong>Thiết kế Website</strong>', time: '10 phút trước' },
        { id: '2', type: 'customer', text: '<strong>Nguyễn Văn A</strong> đã được thêm vào hệ thống', time: '2 giờ trước' },
        { id: '3', type: 'task', text: 'Nhiệm vụ <strong>Gửi báo giá</strong> đã hoàn thành', time: '5 giờ trước' }
      ]);
    }
  },

  get(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  },

  save(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
    // Trigger custom event for reactivity across tabs/modules
    window.dispatchEvent(new CustomEvent('flowcrm_data_changed', { detail: { key, data } }));
  },

  addItem(key, item) {
    const data = this.get(key);
    const newItem = { ...item, id: Date.now().toString() };
    data.unshift(newItem);
    this.save(key, data);
    this.addActivity(key, newItem);
    return newItem;
  },

  updateItem(key, id, updates) {
    let data = this.get(key);
    data = data.map(item => item.id === id ? { ...item, ...updates } : item);
    this.save(key, data);
  },

  deleteItem(key, id) {
    let data = this.get(key);
    data = data.filter(item => item.id !== id);
    this.save(key, data);
  },

  addActivity(key, item) {
    const activities = this.get(this.KEYS.ACTIVITIES);
    let text = '';
    let type = 'info';
    
    if (key === this.KEYS.DEALS) {
      text = `Bạn đã tạo deal <strong>${item.title}</strong>`;
      type = 'deal';
    } else if (key === this.KEYS.CUSTOMERS) {
      text = `Khách hàng <strong>${item.name}</strong> đã được thêm`;
      type = 'customer';
    } else if (key === this.KEYS.TASKS) {
      text = `Nhiệm vụ <strong>${item.title}</strong> đã được tạo`;
      type = 'task';
    }

    activities.unshift({ id: Date.now().toString(), type, text, time: 'Vừa xong' });
    this.save(this.KEYS.ACTIVITIES, activities.slice(0, 20)); // Keep only last 20
  }
};

// Initialize Storage
Storage.init();

// ========================================
// Utility Functions
// ========================================
function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ========================================
// Toast Notification System
// ========================================
const Toast = {
  container: null,

  init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      this.container.innerHTML = `
        <style>
          .toast-container {
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 1000;
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .toast {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 14px 18px;
            background: var(--black);
            color: var(--white);
            border-radius: var(--radius-lg);
            font-size: var(--text-sm);
            font-weight: 500;
            box-shadow: var(--shadow-lg);
            transform: translateX(120%);
            animation: toast-in 0.3s ease forwards;
          }
          .toast.toast-out {
            animation: toast-out 0.2s ease forwards;
          }
          .toast-icon {
            width: 20px;
            height: 20px;
            flex-shrink: 0;
          }
          @keyframes toast-in {
            from { transform: translateX(120%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes toast-out {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(120%); opacity: 0; }
          }
        </style>
      `;
      document.body.appendChild(this.container);
    }
  },

  show(message, duration = 3000) {
    this.init();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20 6L9 17l-5-5"/>
      </svg>
      <span>${message}</span>
    `;
    this.container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-out');
      setTimeout(() => toast.remove(), 200);
    }, duration);
  },

  error(message, duration = 4000) {
    this.init();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.background = '#404040';
    toast.innerHTML = `
      <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
      <span>${message}</span>
    `;
    this.container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-out');
      setTimeout(() => toast.remove(), 200);
    }, duration);
  }
};

// ========================================
// Modal Functions with UX improvements
// ========================================
function openModal(modal) {
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Auto-focus first input
    setTimeout(() => {
      const firstInput = modal.querySelector('input:not([type="hidden"]), textarea, select');
      if (firstInput) firstInput.focus();
    }, 100);

    // Animate in
    modal.style.opacity = '0';
    requestAnimationFrame(() => {
      modal.style.opacity = '1';
    });
  }
}

function closeModal(modal) {
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// ========================================
// DOM Elements
// ========================================
const quickCreateBtn = document.getElementById('quickCreateBtn');
const quickCreateModal = document.getElementById('quickCreateModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelBtn = document.getElementById('cancelBtn');
const createDealBtn = document.getElementById('createDealBtn');
const quickCreateForm = document.getElementById('quickCreateForm');

// Add Customer Modal elements
const addCustomerBtn = document.getElementById('addCustomerBtn');
const addCustomerModal = document.getElementById('addCustomerModal');
const saveCustomerBtn = document.getElementById('saveCustomerBtn');
const addCustomerForm = document.getElementById('addCustomerForm');
const customerTableBody = document.getElementById('customerTableBody');
const tableSearch = document.getElementById('tableSearch');
const selectAllCheckbox = document.getElementById('selectAll');

// Add Task Modal
const addTaskBtn = document.getElementById('addTaskBtn');
const addTaskModal = document.getElementById('addTaskModal');
const saveTaskBtn = document.getElementById('saveTaskBtn');
const addTaskForm = document.getElementById('addTaskForm');

// Add Event Modal
const addEventBtn = document.getElementById('addEventBtn');
const addEventModal = document.getElementById('addEventModal');
const saveEventBtn = document.getElementById('saveEventBtn');
const addEventForm = document.getElementById('addEventForm');

// New Message Modal
const newMessageBtn = document.getElementById('newMessageBtn');
const newMessageModal = document.getElementById('newMessageModal');
const sendMessageBtn = document.getElementById('sendMessageBtn');

// ========================================
// Quick Create Modal (Pipeline)
// ========================================
if (quickCreateBtn) {
  quickCreateBtn.addEventListener('click', () => openModal(quickCreateModal));
}

if (closeModalBtn) {
  closeModalBtn.addEventListener('click', () => closeModal(quickCreateModal));
}

if (cancelBtn) {
  cancelBtn.addEventListener('click', () => closeModal(quickCreateModal));
}

if (quickCreateModal) {
  quickCreateModal.addEventListener('click', (e) => {
    if (e.target === quickCreateModal) closeModal(quickCreateModal);
  });
}

// ========================================
// Add Customer Modal
// ========================================
if (addCustomerBtn) {
  addCustomerBtn.addEventListener('click', () => openModal(addCustomerModal));
}

if (addCustomerModal) {
  const closeBtn = addCustomerModal.querySelector('#closeModalBtn');
  const cancelBtnInModal = addCustomerModal.querySelector('#cancelBtn');

  if (closeBtn) closeBtn.addEventListener('click', () => closeModal(addCustomerModal));
  if (cancelBtnInModal) cancelBtnInModal.addEventListener('click', () => closeModal(addCustomerModal));

  addCustomerModal.addEventListener('click', (e) => {
    if (e.target === addCustomerModal) closeModal(addCustomerModal);
  });
}

// ========================================
// Add Task Modal
// ========================================
if (addTaskBtn) {
  addTaskBtn.addEventListener('click', () => openModal(addTaskModal));
}

if (addTaskModal) {
  const closeBtn = addTaskModal.querySelector('#closeModalBtn');
  const cancelBtnInModal = addTaskModal.querySelector('#cancelBtn');

  if (closeBtn) closeBtn.addEventListener('click', () => closeModal(addTaskModal));
  if (cancelBtnInModal) cancelBtnInModal.addEventListener('click', () => closeModal(addTaskModal));

  addTaskModal.addEventListener('click', (e) => {
    if (e.target === addTaskModal) closeModal(addTaskModal);
  });
}

// ========================================
// Add Event Modal
// ========================================
if (addEventBtn) {
  addEventBtn.addEventListener('click', () => {
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    const eventDateInput = document.getElementById('eventDate');
    if (eventDateInput) eventDateInput.value = today;

    openModal(addEventModal);
  });
}

if (addEventModal) {
  const closeBtn = addEventModal.querySelector('#closeModalBtn');
  const cancelBtnInModal = addEventModal.querySelector('#cancelBtn');

  if (closeBtn) closeBtn.addEventListener('click', () => closeModal(addEventModal));
  if (cancelBtnInModal) cancelBtnInModal.addEventListener('click', () => closeModal(addEventModal));

  addEventModal.addEventListener('click', (e) => {
    if (e.target === addEventModal) closeModal(addEventModal);
  });
}

// ========================================
// New Message Modal
// ========================================
if (newMessageBtn) {
  newMessageBtn.addEventListener('click', () => openModal(newMessageModal));
}

if (newMessageModal) {
  const closeBtn = newMessageModal.querySelector('#closeModalBtn');
  const cancelBtnInModal = newMessageModal.querySelector('#cancelBtn');

  if (closeBtn) closeBtn.addEventListener('click', () => closeModal(newMessageModal));
  if (cancelBtnInModal) cancelBtnInModal.addEventListener('click', () => closeModal(newMessageModal));

  newMessageModal.addEventListener('click', (e) => {
    if (e.target === newMessageModal) closeModal(newMessageModal);
  });
}

// ========================================
// Form Validation with UX
// ========================================
function validateForm(form) {
  let isValid = true;
  const requiredInputs = form.querySelectorAll('[required]');

  requiredInputs.forEach(input => {
    const formGroup = input.closest('.form-group');

    if (!input.value.trim()) {
      formGroup?.classList.add('has-error');
      input.classList.add('error');
      isValid = false;

      // Shake animation for error
      input.style.animation = 'shake 0.3s ease';
      setTimeout(() => input.style.animation = '', 300);
    } else {
      formGroup?.classList.remove('has-error');
      input.classList.remove('error');
    }
  });

  return isValid;
}

// Real-time validation
document.querySelectorAll('.form-input, .form-select').forEach(input => {
  input.addEventListener('blur', function() {
    const formGroup = this.closest('.form-group');

    if (this.hasAttribute('required') && !this.value.trim()) {
      formGroup?.classList.add('has-error');
      this.classList.add('error');
    } else {
      formGroup?.classList.remove('has-error');
      this.classList.remove('error');
    }
  });

  input.addEventListener('input', function() {
    const formGroup = this.closest('.form-group');
    formGroup?.classList.remove('has-error');
    this.classList.remove('error');
  });
});

// ========================================
// Deal Creation with Toast
// ========================================
if (createDealBtn) {
  createDealBtn.addEventListener('click', () => {
    if (validateForm(quickCreateForm)) {
      const formData = new FormData(quickCreateForm);
      const newDeal = {
        title: formData.get('dealTitle'),
        customer: formData.get('customerName'),
        value: parseInt(formData.get('dealValue')) || 0,
        stage: formData.get('dealStage') || 'qualification',
        tag: 'warm',
        date: new Date().toISOString().split('T')[0]
      };

      createDealBtn.disabled = true;
      createDealBtn.textContent = 'Đang tạo...';

      setTimeout(() => {
        Storage.addItem(Storage.KEYS.DEALS, newDeal);
        createDealBtn.disabled = false;
        createDealBtn.textContent = 'Tạo Deal';
        quickCreateForm.reset();
        closeModal(quickCreateModal);
        Toast.show('Deal mới đã được tạo thành công!');
      }, 500);
    }
  });
}

// ========================================
// Customer Creation with Toast
// ========================================
if (saveCustomerBtn) {
  saveCustomerBtn.addEventListener('click', () => {
    if (validateForm(addCustomerForm)) {
      const formData = new FormData(addCustomerForm);
      const newCustomer = {
        name: formData.get('custName'),
        email: formData.get('custEmail'),
        phone: formData.get('custPhone'),
        company: formData.get('custCompany'),
        status: 'active'
      };

      saveCustomerBtn.disabled = true;
      saveCustomerBtn.textContent = 'Đang lưu...';

      setTimeout(() => {
        Storage.addItem(Storage.KEYS.CUSTOMERS, newCustomer);
        saveCustomerBtn.disabled = false;
        saveCustomerBtn.textContent = 'Lưu khách hàng';
        addCustomerForm.reset();
        closeModal(addCustomerModal);
        Toast.show('Khách hàng đã được thêm thành công!');
      }, 500);
    }
  });
}

// ========================================
// Task Creation
// ========================================
if (saveTaskBtn) {
  saveTaskBtn.addEventListener('click', () => {
    if (validateForm(addTaskForm)) {
      const formData = new FormData(addTaskForm);
      const newTask = {
        title: formData.get('taskTitle'),
        deadline: formData.get('taskDeadline'),
        priority: formData.get('taskPriority'),
        completed: false
      };

      saveTaskBtn.disabled = true;
      saveTaskBtn.textContent = 'Đang tạo...';

      setTimeout(() => {
        Storage.addItem(Storage.KEYS.TASKS, newTask);
        saveTaskBtn.disabled = false;
        saveTaskBtn.textContent = 'Tạo nhiệm vụ';
        addTaskForm.reset();
        closeModal(addTaskModal);
        Toast.show('Nhiệm vụ mới đã được tạo!');
      }, 500);
    }
  });
}

// ========================================
// Event Creation
// ========================================
if (saveEventBtn) {
  saveEventBtn.addEventListener('click', () => {
    if (validateForm(addEventForm)) {
      saveEventBtn.disabled = true;
      saveEventBtn.textContent = 'Đang tạo...';

      setTimeout(() => {
        saveEventBtn.disabled = false;
        saveEventBtn.textContent = 'Tạo lịch hẹn';
        addEventForm.reset();
        closeModal(addEventModal);
        Toast.show('Lịch hẹn mới đã được tạo!');
      }, 500);
    }
  });
}

// ========================================
// Kanban Drag and Drop with visual feedback
// ========================================
const kanbanBoard = document.getElementById('kanbanBoard');

if (kanbanBoard) {
  const cards = kanbanBoard.querySelectorAll('.kanban-card');
  const columns = kanbanBoard.querySelectorAll('.kanban-column');

  cards.forEach(card => {
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);
  });

  columns.forEach(column => {
    column.addEventListener('dragover', handleDragOver);
    column.addEventListener('dragenter', handleDragEnter);
    column.addEventListener('dragleave', handleDragLeave);
    column.addEventListener('drop', handleDrop);
  });
}

let draggedCard = null;
let sourceColumn = null;

function handleDragStart(e) {
  draggedCard = this;
  sourceColumn = this.parentElement;
  this.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', this.dataset.id);
}

function handleDragEnd(e) {
  this.classList.remove('dragging');
  document.querySelectorAll('.kanban-column').forEach(col => {
    col.classList.remove('drag-over');
  });
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
}

function handleDragEnter(e) {
  e.preventDefault();
  this.classList.add('drag-over');
}

function handleDragLeave(e) {
  if (!this.contains(e.relatedTarget)) {
    this.classList.remove('drag-over');
  }
}

function handleDrop(e) {
  e.preventDefault();
  this.classList.remove('drag-over');

  if (draggedCard && sourceColumn !== this) {
    const cardsContainer = this.querySelector('.kanban-cards');
    if (cardsContainer) {
      cardsContainer.appendChild(draggedCard);
      updateColumnCounts();
      Toast.show('Deal đã được chuyển sang ' + this.querySelector('.kanban-column-title').textContent.trim());
    }
  }
}

function updateColumnCounts() {
  const columns = document.querySelectorAll('.kanban-column');
  columns.forEach(column => {
    const cards = column.querySelectorAll('.kanban-card');
    const countBadge = column.querySelector('.kanban-count');
    if (countBadge) {
      countBadge.textContent = cards.length;
    }
  });
}

// ========================================
// Task Checkbox with animation
// ========================================
document.querySelectorAll('.task-item').forEach(item => {
  item.addEventListener('click', function(e) {
    if (e.target.closest('.task-checkbox') || e.target.closest('.task-actions')) return;

    const checkbox = this.querySelector('.task-checkbox');
    if (checkbox) {
      checkbox.classList.toggle('checked');
      this.classList.toggle('completed');

      if (this.classList.contains('completed')) {
        Toast.show('Nhiệm vụ đã hoàn thành!');
      }
    }
  });
});

// ========================================
// Todo Checkbox Interaction
// ========================================
document.querySelectorAll('.todo-item').forEach(item => {
  item.addEventListener('click', function(e) {
    if (e.target.closest('.todo-checkbox')) {
      this.classList.toggle('completed');
    }
  });
});

// ========================================
// Customer Table Search with debounce
// ========================================
if (tableSearch) {
  let searchTimeout;
  tableSearch.addEventListener('input', function() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      const searchTerm = this.value.toLowerCase();
      const rows = customerTableBody?.querySelectorAll('tr');

      rows?.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
      });
    }, 200);
  });
}

// ========================================
// Select All Checkbox
// ========================================
if (selectAllCheckbox) {
  selectAllCheckbox.addEventListener('change', function() {
    const checkboxes = customerTableBody?.querySelectorAll('input[type="checkbox"]');
    checkboxes?.forEach(cb => {
      cb.checked = this.checked;
    });
  });
}

// ========================================
// Chart Tabs Interaction
// ========================================
document.querySelectorAll('.chart-tabs').forEach(tabContainer => {
  const tabs = tabContainer.querySelectorAll('.chart-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
    });
  });
});

// ========================================
// Task Filter Buttons
// ========================================
document.querySelectorAll('.task-filter').forEach(filter => {
  filter.addEventListener('click', function() {
    document.querySelectorAll('.task-filter').forEach(f => f.classList.remove('active'));
    this.classList.add('active');

    const filterType = this.dataset.filter;
    const taskItems = document.querySelectorAll('.task-item');

    taskItems.forEach(item => {
      if (filterType === 'all') {
        item.style.display = '';
      } else if (filterType === 'overdue') {
        const isOverdue = item.querySelector('.task-deadline.overdue');
        item.style.display = isOverdue ? '' : 'none';
      } else if (filterType === 'today') {
        const isToday = item.querySelector('.task-deadline:not(.overdue)') &&
                       item.querySelector('.task-deadline').textContent.includes('Hôm nay');
        item.style.display = isToday ? '' : 'none';
      }
    });
  });
});

// ========================================
// Dropdown Menus
// ========================================
document.querySelectorAll('.kanban-card-menu, .action-btn').forEach(menuBtn => {
  menuBtn.addEventListener('click', function(e) {
    e.stopPropagation();

    document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
      if (menu !== this.nextElementSibling) menu.classList.remove('show');
    });

    let dropdown = this.nextElementSibling;
    if (!dropdown || !dropdown.classList.contains('dropdown-menu')) {
      const isDelete = this.innerHTML.includes('trash') || this.title === 'Xóa';

      dropdown = document.createElement('div');
      dropdown.className = 'dropdown-menu show';
      dropdown.innerHTML = `
        <div class="dropdown-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          Xem chi tiết
        </div>
        <div class="dropdown-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Chỉnh sửa
        </div>
        ${isDelete ? `
        <div class="dropdown-item danger">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
          Xóa
        </div>` : ''}
      `;
      this.parentElement.appendChild(dropdown);

      dropdown.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function(e) {
          e.stopPropagation();
          const action = this.textContent.trim();

          if (action === 'Xóa') {
            const card = menuBtn.closest('.kanban-card');
            const row = menuBtn.closest('tr');
            if (card) {
              card.style.animation = 'fade-out 0.3s ease forwards';
              setTimeout(() => {
                card.remove();
                updateColumnCounts();
              }, 300);
            }
            if (row) {
              row.style.animation = 'fade-out 0.3s ease forwards';
              setTimeout(() => row.remove(), 300);
            }
            Toast.show('Đã xóa thành công!');
          } else if (action === 'Chỉnh sửa') {
            Toast.show('Chức năng đang phát triển...');
          } else if (action === 'Xem chi tiết') {
            Toast.show('Chức năng đang phát triển...');
          }
          dropdown.classList.remove('show');
        });
      });
    } else {
      dropdown.classList.toggle('show');
    }
  });
});

// Close dropdowns when clicking outside
document.addEventListener('click', () => {
  document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
    menu.classList.remove('show');
  });
});

// ========================================
// Keyboard Shortcuts
// ========================================
document.addEventListener('keydown', (e) => {
  // Escape to close modals
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(modal => {
      closeModal(modal);
    });
  }

  // Ctrl/Cmd + N to open quick create (on pipeline page)
  if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
    e.preventDefault();
    if (quickCreateModal) openModal(quickCreateModal);
  }

  // Ctrl/Cmd + K to focus search
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    const searchInput = document.querySelector('.search-box input, .table-search input');
    if (searchInput) searchInput.focus();
  }
});

// ========================================
// Conversation item click (Messages)
// ========================================
document.querySelectorAll('.conversation-item').forEach(item => {
  item.addEventListener('click', function() {
    document.querySelectorAll('.conversation-item').forEach(i => i.classList.remove('active'));
    this.classList.add('active');
  });
});

// ========================================
// Message sending
// ========================================
const messageInput = document.getElementById('messageInput');
const chatMessages = document.getElementById('chatMessages');

if (sendMessageBtn && messageInput) {
  sendMessageBtn.addEventListener('click', () => {
    const text = messageInput.value.trim();
    if (text) {
      sendMessage(text);
    }
  });

  messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const text = messageInput.value.trim();
      if (text) {
        sendMessage(text);
      }
    }
  });
}

function sendMessage(text) {
  const now = new Date();
  const time = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

  const messageDiv = document.createElement('div');
  messageDiv.className = 'message sent';
  messageDiv.innerHTML = `
    <div class="message-content">
      <p>${text}</p>
      <span class="message-time">${time}</span>
    </div>
  `;
  chatMessages.appendChild(messageDiv);
  messageInput.value = '';
  chatMessages.scrollTo({
    top: chatMessages.scrollHeight,
    behavior: 'smooth'
  });
}

// ========================================
// Global Search (Cmd/Ctrl + K hint)
// ========================================
document.addEventListener('keyup', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    Toast.show('Nhấn Ctrl+K để tìm kiếm nhanh', 2000);
  }
});

// ========================================
// Module Rendering Functions
// ========================================

const UI = {
  renderDashboard() {
    const deals = Storage.get(Storage.KEYS.DEALS);
    const customers = Storage.get(Storage.KEYS.CUSTOMERS);
    const activities = Storage.get(Storage.KEYS.ACTIVITIES);
    const tasks = Storage.get(Storage.KEYS.TASKS);

    // Update KPI values
    const totalRevenue = deals.filter(d => d.stage === 'closed').reduce((sum, d) => sum + d.value, 0);
    const activeDeals = deals.filter(d => d.stage !== 'closed' && d.stage !== 'lost').length;
    
    const revenueEl = document.getElementById('kpi-revenue');
    const dealsEl = document.getElementById('kpi-deals');
    const customersEl = document.getElementById('kpi-customers');
    const tasksEl = document.getElementById('kpi-tasks');

    if (revenueEl) revenueEl.textContent = formatCurrency(totalRevenue);
    if (dealsEl) dealsEl.textContent = activeDeals;
    if (customersEl) customersEl.textContent = customers.length;
    if (tasksEl) tasksEl.textContent = tasks.filter(t => !t.completed).length;

    // Render Recent Activities
    const activityList = document.querySelector('.activity-list');
    if (activityList) {
      activityList.innerHTML = activities.map(act => `
        <div class="activity-item">
          <div class="activity-icon ${act.type}">
            ${this.getIcon(act.type)}
          </div>
          <div class="activity-content">
            <p class="activity-text">${act.text}</p>
            <span class="activity-time">${act.time}</span>
          </div>
        </div>
      `).join('');
    }
  },

  renderPipeline() {
    const deals = Storage.get(Storage.KEYS.DEALS);
    const stages = ['qualification', 'proposal', 'negotiation', 'closed', 'lost'];
    
    stages.forEach(stage => {
      const stageContainer = document.querySelector(`.kanban-column[data-stage="${stage}"] .kanban-cards`);
      if (stageContainer) {
        const stageDeals = deals.filter(d => d.stage === stage);
        stageContainer.innerHTML = stageDeals.map(deal => `
          <div class="kanban-card" draggable="true" data-id="${deal.id}">
            <div class="kanban-card-header">
              <span class="kanban-card-title">${deal.title}</span>
              <button class="kanban-card-menu">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
              </button>
            </div>
            <div class="kanban-card-customer">${deal.customer}</div>
            <div class="kanban-card-footer">
              <span class="kanban-card-value">${formatCurrency(deal.value)}</span>
              <span class="kanban-card-tag tag-${deal.tag}">${deal.tag.toUpperCase()}</span>
            </div>
          </div>
        `).join('');
      }
    });
    updateColumnCounts();
    this.initDragAndDrop();
  },

  renderCustomers() {
    const customers = Storage.get(Storage.KEYS.CUSTOMERS);
    const tbody = document.getElementById('customerTableBody');
    if (tbody) {
      tbody.innerHTML = customers.map(cust => `
        <tr>
          <td><input type="checkbox" data-id="${cust.id}"></td>
          <td>
            <div class="customer-name-cell">
              <div class="customer-avatar">${cust.name.split(' ').map(n => n[0]).join('')}</div>
              <div>
                <div class="customer-name">${cust.name}</div>
                <div class="customer-email">${cust.email}</div>
              </div>
            </div>
          </td>
          <td>${cust.company}</td>
          <td>${cust.phone}</td>
          <td><span class="status-badge active">${cust.status}</span></td>
          <td>
            <div class="action-btns">
              <button class="action-btn" title="Chỉnh sửa">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button class="action-btn" title="Xóa" data-action="delete" data-id="${cust.id}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          </td>
        </tr>
      `).join('');
    }
  },

  getIcon(type) {
    if (type === 'deal') return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>';
    if (type === 'customer') return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
    if (type === 'task') return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>';
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
  },

  initDragAndDrop() {
    const cards = document.querySelectorAll('.kanban-card');
    const columns = document.querySelectorAll('.kanban-column');

    cards.forEach(card => {
      card.addEventListener('dragstart', handleDragStart);
      card.addEventListener('dragend', handleDragEnd);
    });

    columns.forEach(column => {
      column.addEventListener('dragover', handleDragOver);
      column.addEventListener('dragenter', handleDragEnter);
      column.addEventListener('dragleave', handleDragLeave);
      column.addEventListener('drop', handleDrop);
    });
  }
};

// ========================================
// Initialize App
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('FlowCRM initialized');

  // Sidebar toggle for mobile
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar = document.querySelector('.sidebar');

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 992 &&
          sidebar.classList.contains('open') &&
          !sidebar.contains(e.target) &&
          !sidebarToggle.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
  }

  // Initial render based on page
  UI.renderDashboard();
  UI.renderPipeline();
  UI.renderCustomers();

  // Listen for data changes
  window.addEventListener('flowcrm_data_changed', (e) => {
    UI.renderDashboard();
    UI.renderPipeline();
    UI.renderCustomers();
  });

  // Add smooth transitions & animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
    @keyframes fade-out {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0; transform: translateY(-10px); }
    }
  `;
  document.head.appendChild(style);
});
