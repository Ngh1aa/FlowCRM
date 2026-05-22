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
    EVENTS: 'flowcrm_events',
    MESSAGES: 'flowcrm_messages',
    ACTIVITIES: 'flowcrm_activities'
  },

  init() {
    if (!localStorage.getItem(this.KEYS.DEALS)) {
      this.save(this.KEYS.DEALS, [
        { id: '1', title: 'Thiết kế website thương mại điện tử', customer: 'Cty Alpha', value: 25000000, stage: 'qualification', tag: 'hot', date: '2023-10-25' },
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

function hydrateDemoData() {
  const deals = Storage.get(Storage.KEYS.DEALS);
  const customers = Storage.get(Storage.KEYS.CUSTOMERS);
  const tasks = Storage.get(Storage.KEYS.TASKS);

  if (deals.length < 6) {
    Storage.save(Storage.KEYS.DEALS, [
      { id: '1', title: 'Website Redesign', customer: 'Công ty ABC', value: 150000000, stage: 'qualification', tag: 'warm', date: '2026-05-14', owner: 'An Nguyen', nextAction: 'Xác nhận phạm vi' },
      { id: '2', title: 'Mobile App Development', customer: 'Tech Solutions', value: 320000000, stage: 'qualification', tag: 'hot', date: '2026-05-14', owner: 'Linh Pham', nextAction: 'Chốt ngân sách' },
      { id: '3', title: 'CRM Integration', customer: 'Design Co', value: 85000000, stage: 'qualification', tag: 'cold', date: '2026-05-15', owner: 'Bao Le', nextAction: 'Xác minh nhu cầu' },
      { id: '4', title: 'E-commerce Platform', customer: 'Fashion Store', value: 125000000, stage: 'qualification', tag: 'warm', date: '2026-05-16', owner: 'An Nguyen', nextAction: 'Gửi proposal mẫu' },
      { id: '5', title: 'Cloud Migration', customer: 'Alpha Corp', value: 480000000, stage: 'proposal', tag: 'hot', date: '2026-05-15', owner: 'Minh Tran', nextAction: 'Gửi báo giá' },
      { id: '6', title: 'Security Audit', customer: 'Beta Industries', value: 95000000, stage: 'proposal', tag: 'warm', date: '2026-05-16', owner: 'Minh Tran', nextAction: 'Xác nhận lịch audit' },
      { id: '7', title: 'Data Analytics Suite', customer: 'Gamma Ltd', value: 210000000, stage: 'proposal', tag: 'warm', date: '2026-05-17', owner: 'An Nguyen', nextAction: 'Review proposal' },
      { id: '8', title: 'Marketing Automation', customer: 'Delta Inc', value: 180000000, stage: 'negotiation', tag: 'hot', date: '2026-05-15', owner: 'Minh Tran', nextAction: 'Chốt điều khoản' },
      { id: '9', title: 'Inventory System', customer: 'Epsilon Co', value: 120000000, stage: 'negotiation', tag: 'warm', date: '2026-05-18', owner: 'Linh Pham', nextAction: 'Demo sản phẩm' },
      { id: '10', title: 'SEO Optimization', customer: 'Zeta Group', value: 75000000, stage: 'closed', tag: 'won', date: '2026-05-10', owner: 'Bao Le', nextAction: 'Bàn giao dự án' },
      { id: '11', title: 'UI/UX Design System', customer: 'Eta Corp', value: 95000000, stage: 'closed', tag: 'won', date: '2026-05-11', owner: 'Linh Pham', nextAction: 'Gửi invoice' },
      { id: '12', title: 'Social Media Campaign', customer: 'Theta Ltd', value: 45000000, stage: 'lost', tag: 'lost', date: '2026-05-09', owner: 'Bao Le', nextAction: 'Ghi nhận lý do' }
    ]);
  }

  if (customers.length < 6) {
    Storage.save(Storage.KEYS.CUSTOMERS, [
      { id: '1', name: 'Nguyễn Văn An', email: 'an@alpha.vn', phone: '0901234567', status: 'active', company: 'Alpha Corp', latestDeal: 'Cloud Migration' },
      { id: '2', name: 'Trần Minh', email: 'minh@techsolutions.vn', phone: '0912345678', status: 'active', company: 'Tech Solutions', latestDeal: 'Mobile App Development' },
      { id: '3', name: 'Lê Mai Linh', email: 'linh@designco.vn', phone: '0987654321', status: 'prospect', company: 'Design Co', latestDeal: 'CRM Integration' },
      { id: '4', name: 'Phạm Hoàng Diệp', email: 'diep@gamma.vn', phone: '0934567890', status: 'prospect', company: 'Gamma Ltd', latestDeal: 'Data Analytics Suite' },
      { id: '5', name: 'Vũ Nam', email: 'nam@beta.vn', phone: '0976543210', status: 'active', company: 'Beta Industries', latestDeal: 'Security Audit' },
      { id: '6', name: 'Đặng Bảo', email: 'bao@delta.vn', phone: '0966123456', status: 'active', company: 'Delta Inc', latestDeal: 'Marketing Automation' },
      { id: '7', name: 'Ngô Khánh', email: 'khanh@epsilon.vn', phone: '0955123456', status: 'inactive', company: 'Epsilon Co', latestDeal: 'Inventory System' },
      { id: '8', name: 'Hoàng My', email: 'my@zeta.vn', phone: '0944123456', status: 'active', company: 'Zeta Group', latestDeal: 'SEO Optimization' }
    ]);
  }

  if (tasks.length < 5) {
    Storage.save(Storage.KEYS.TASKS, [
      { id: '1', title: 'Gọi điện cho Alpha Corp', deadline: '2026-05-10', dueLabel: 'Đã hạn: 10/05/2026', category: 'overdue', deal: 'Cloud Migration', customer: 'Alpha Corp', owner: 'An', priority: 'hot', completed: false },
      { id: '2', title: 'Gửi báo giá cho Beta Industries', deadline: '2026-05-11', dueLabel: 'Đã hạn: 11/05/2026', category: 'overdue', deal: 'Security Audit', customer: 'Beta Industries', owner: 'Minh', priority: 'hot', completed: false },
      { id: '3', title: 'Họp team về pipeline Q2', deadline: '2026-05-14', dueLabel: 'Hôm nay, 14:00', category: 'today', deal: 'Nội bộ', customer: 'Sales team', owner: 'An', priority: 'warm', completed: false },
      { id: '4', title: 'Gửi báo giá cho Tech Solutions', deadline: '2026-05-14', dueLabel: 'Hôm nay, 10:30', category: 'today', deal: 'Mobile App Development', customer: 'Tech Solutions', owner: 'Linh', priority: 'warm', completed: true },
      { id: '5', title: 'Follow up deal với Design Co', deadline: '2026-05-14', dueLabel: 'Hôm nay, 16:30', category: 'today', deal: 'CRM Integration', customer: 'Design Co', owner: 'Bao', priority: 'hot', completed: false },
      { id: '6', title: 'Gửi hợp đồng cho Delta Inc', deadline: '2026-05-15', dueLabel: '15/05/2026', category: 'upcoming', deal: 'Marketing Automation', customer: 'Delta Inc', owner: 'Minh', priority: 'warm', completed: false },
      { id: '7', title: 'Demo sản phẩm cho Epsilon Co', deadline: '2026-05-18', dueLabel: '18/05/2026', category: 'upcoming', deal: 'Inventory System', customer: 'Epsilon Co', owner: 'Linh', priority: 'cold', completed: false },
      { id: '8', title: 'Review proposal với Gamma Ltd', deadline: '2026-05-20', dueLabel: '20/05/2026', category: 'upcoming', deal: 'Data Analytics Suite', customer: 'Gamma Ltd', owner: 'An', priority: 'warm', completed: false },
      { id: '9', title: 'Chốt deal với Zeta Group', deadline: '2026-05-25', dueLabel: '25/05/2026', category: 'upcoming', deal: 'SEO Optimization', customer: 'Zeta Group', owner: 'Bao', priority: 'hot', completed: false }
    ]);
  }

  if (!localStorage.getItem(Storage.KEYS.EVENTS)) {
    Storage.save(Storage.KEYS.EVENTS, []);
  }
}

hydrateDemoData();

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

const PIPELINE_STAGE_CONFIG = {
  qualification: {
    selector: 'qualification',
    probability: 28,
    nextAction: 'Xác nhận ngân sách'
  },
  proposal: {
    selector: 'proposal',
    probability: 52,
    nextAction: 'Gửi đề xuất'
  },
  negotiation: {
    selector: 'negotiation',
    probability: 68,
    nextAction: 'Chốt điều khoản'
  },
  closed: {
    selector: 'closed-won',
    probability: 100,
    nextAction: 'Bàn giao dự án'
  },
  lost: {
    selector: 'closed-lost',
    probability: 0,
    nextAction: 'Ghi nhận lý do'
  }
};

const PIPELINE_OWNERS = ['An Nguyen', 'Minh Tran', 'Linh Pham', 'Bao Le'];

function formatShortDate(value) {
  if (!value) return 'Chưa có ngày';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit'
  });
}

function getPipelineColumn(stage) {
  const config = PIPELINE_STAGE_CONFIG[stage] || {};
  return document.querySelector(
    `.kanban-column[data-stage="${stage}"], .kanban-column[data-stage="${config.selector}"]`
  );
}

function normalizePipelineStage(stage) {
  if (PIPELINE_STAGE_CONFIG[stage]) return stage;
  return 'proposal';
}

function getDealPipelineMeta(deal, index, stage) {
  const config = PIPELINE_STAGE_CONFIG[stage] || PIPELINE_STAGE_CONFIG.qualification;

  return {
    owner: deal.owner || PIPELINE_OWNERS[index % PIPELINE_OWNERS.length],
    followUp: deal.followUp || deal.date,
    probability: Number.isFinite(deal.probability) ? deal.probability : config.probability,
    nextAction: deal.nextAction || config.nextAction
  };
}

function parseCardValue(card) {
  const rawValue = card.dataset.value || card.querySelector('.kanban-card-value')?.textContent || '0';
  return Number(String(rawValue).replace(/[^\d]/g, '')) || 0;
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
const tableSearch = document.getElementById('tableSearch') || document.getElementById('searchInput');
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

function getFieldValue(formData, name, id, fallback = '') {
  const value = formData.get(name);
  return value || document.getElementById(id)?.value || fallback;
}

// ========================================
// Hộp tạo nhanh (Quy trình bán hàng)
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
// Cơ hội Creation with Toast
// ========================================
if (createDealBtn) {
  createDealBtn.addEventListener('click', () => {
    if (validateForm(quickCreateForm)) {
      const formData = new FormData(quickCreateForm);
      const rawDealValue = formData.get('opportunityValue') || document.getElementById('opportunityValue')?.value;
      const newDeal = {
        title: formData.get('opportunityTitle') || document.getElementById('opportunityName')?.value || 'Cơ hội chưa đặt tên',
        customer: formData.get('customerName') || document.getElementById('opportunityCustomer')?.selectedOptions[0]?.textContent || 'Tiềm năng',
        value: Number(String(rawDealValue || '').replace(/[^\d]/g, '')) || 0,
        stage: normalizePipelineStage(formData.get('opportunityStage') || document.getElementById('opportunityStage')?.value || 'qualification'),
        tag: formData.get('opportunityPriority') || document.getElementById('opportunityPriority')?.value || 'warm',
        date: new Date().toISOString().split('T')[0]
      };

      createDealBtn.disabled = true;
      createDealBtn.textContent = 'Đang tạo...';

      setTimeout(() => {
        Storage.addItem(Storage.KEYS.DEALS, newDeal);
        createDealBtn.disabled = false;
        createDealBtn.textContent = 'Tạo cơ hội';
        quickCreateForm.reset();
        closeModal(quickCreateModal);
        Toast.show('Cơ hội mới đã được tạo thành công!');
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
      const firstName = getFieldValue(formData, 'customerFirstName', 'customerFirstName');
      const lastName = getFieldValue(formData, 'customerLastName', 'customerLastName');
      const newCustomer = {
        name: `${firstName} ${lastName}`.trim() || getFieldValue(formData, 'custName', 'customerFirstName', 'Khách hàng mới'),
        email: getFieldValue(formData, 'customerEmail', 'customerEmail') || formData.get('custEmail') || '',
        phone: getFieldValue(formData, 'customerPhone', 'customerPhone') || formData.get('custPhone') || '',
        company: getFieldValue(formData, 'customerCompany', 'customerCompany') || formData.get('custCompany') || '',
        status: getFieldValue(formData, 'customerStatus', 'customerStatus', 'active'),
        latestDeal: 'Chưa có cơ hội'
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
      const deadline = getFieldValue(formData, 'taskDeadline', 'taskDeadline');
      const time = getFieldValue(formData, 'taskTime', 'taskTime');
      const dealSelect = document.getElementById('taskDeal');
      const selectedDeal = dealSelect?.selectedOptions[0]?.textContent || '';
      const newTask = {
        title: getFieldValue(formData, 'taskTitle', 'taskTitle', 'Nhiệm vụ mới'),
        deadline,
        dueLabel: deadline ? `${formatShortDate(deadline)}${time ? `, ${time}` : ''}` : 'Chưa có hạn',
        category: deadline === '2026-05-14' ? 'today' : 'upcoming',
        deal: selectedDeal && !selectedDeal.includes('Chọn') ? selectedDeal : 'Chưa liên kết',
        customer: selectedDeal.includes('-') ? selectedDeal.split('-').pop().trim() : 'Chưa gán',
        owner: 'An',
        priority: getFieldValue(formData, 'taskPriority', 'taskPriority', 'warm'),
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

if (saveEventBtn && addEventForm) {
  saveEventBtn.addEventListener('click', (eventClick) => {
    eventClick.preventDefault();
    eventClick.stopImmediatePropagation();

    if (!validateForm(addEventForm)) return;

    const formData = new FormData(addEventForm);
    const event = {
      id: Date.now().toString(),
      title: getFieldValue(formData, 'eventTitle', 'eventTitle', 'Lịch hẹn mới'),
      date: getFieldValue(formData, 'eventDate', 'eventDate'),
      startTime: getFieldValue(formData, 'eventStartTime', 'eventStartTime'),
      endTime: getFieldValue(formData, 'eventEndTime', 'eventEndTime'),
      customer: document.getElementById('eventCustomer')?.selectedOptions[0]?.textContent || '',
      location: getFieldValue(formData, 'eventLocation', 'eventLocation'),
      notes: getFieldValue(formData, 'eventNotes', 'eventNotes')
    };

    saveEventBtn.disabled = true;
    saveEventBtn.textContent = 'Đang tạo...';

    setTimeout(() => {
      const events = Storage.get(Storage.KEYS.EVENTS);
      Storage.save(Storage.KEYS.EVENTS, [event, ...events]);
      saveEventBtn.disabled = false;
      saveEventBtn.textContent = 'Tạo lịch hẹn';
      addEventForm.reset();
      closeModal(addEventModal);
      window.dispatchEvent(new CustomEvent('flowcrm_event_created', { detail: event }));
      Toast.show('Lịch hẹn mới đã được tạo!');
    }, 500);
  }, true);
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
      Toast.show('Cơ hội đã được chuyển sang ' + this.querySelector('.kanban-column-title').textContent.trim());
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

    const cardList = column.querySelector('.kanban-cards');
    let emptyState = column.querySelector('.kanban-empty-state');
    if (!cards.length && cardList) {
      if (!emptyState) {
        emptyState = document.createElement('div');
        emptyState.className = 'kanban-empty-state';
        cardList.appendChild(emptyState);
      }
      emptyState.textContent = 'Chưa có cơ hội ở giai đoạn này';
    } else if (emptyState) {
      emptyState.remove();
    }

    const totalValue = Array.from(cards).reduce((sum, card) => sum + parseCardValue(card), 0);
    const probabilities = Array.from(cards)
      .map(card => Number(card.dataset.probability))
      .filter(Number.isFinite);
    const avgProbability = probabilities.length
      ? Math.round(probabilities.reduce((sum, value) => sum + value, 0) / probabilities.length)
      : 0;
    let summary = column.querySelector('.kanban-column-summary');

    if (!summary) {
      summary = document.createElement('div');
      summary.className = 'kanban-column-summary';
      column.appendChild(summary);
    }

    summary.innerHTML = `
      <div class="kanban-summary-row">
        <span>Tổng giá trị</span>
        <strong>${formatCurrency(totalValue)}</strong>
      </div>
      <div class="kanban-summary-row">
        <span>Xác suất TB</span>
        <strong>${avgProbability}%</strong>
      </div>
    `;
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

document.addEventListener('click', (e) => {
  const taskItem = e.target.closest('.tasks-page .task-item');
  if (!taskItem || e.target.closest('.task-actions')) return;

  const checkbox = taskItem.querySelector('.task-checkbox');
  const isCompleted = !taskItem.classList.contains('completed');
  taskItem.classList.toggle('completed', isCompleted);
  checkbox?.classList.toggle('checked', isCompleted);

  const tasks = Storage.get(Storage.KEYS.TASKS).map(task =>
    task.id === taskItem.dataset.id ? { ...task, completed: isCompleted } : task
  );
  Storage.save(Storage.KEYS.TASKS, tasks);

  if (isCompleted) Toast.show('Nhiệm vụ đã hoàn thành!');
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
      applyCustomerTableState();
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

function getCustomerStatusLabel(status = 'active') {
  const labels = {
    active: 'Đang hoạt động',
    prospect: 'Tiềm năng',
    inactive: 'Ngừng chăm sóc'
  };
  return labels[status] || status;
}

function applyCustomerTableState() {
  const rows = customerTableBody?.querySelectorAll('tr');
  if (!rows) return;

  const searchTerm = (tableSearch?.value || '').toLowerCase();
  const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';

  rows.forEach(row => {
    const matchesSearch = row.textContent.toLowerCase().includes(searchTerm);
    const matchesFilter = activeFilter === 'all' || row.dataset.status === activeFilter;
    row.style.display = matchesSearch && matchesFilter ? '' : 'none';
  });
}

document.querySelectorAll('.filter-btn').forEach(button => {
  button.addEventListener('click', function() {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    this.classList.add('active');
    applyCustomerTableState();
  });
});

document.querySelectorAll('.customer-table th.sortable').forEach(header => {
  header.addEventListener('click', function() {
    if (!customerTableBody) return;

    const index = Array.from(this.parentElement.children).indexOf(this);
    const direction = this.classList.contains('asc') ? 'desc' : 'asc';
    const rows = Array.from(customerTableBody.querySelectorAll('tr'));

    document.querySelectorAll('.customer-table th.sortable').forEach(th => th.classList.remove('sorted', 'asc', 'desc'));
    this.classList.add('sorted', direction);

    rows.sort((a, b) => {
      const aText = a.children[index]?.textContent.trim().toLowerCase() || '';
      const bText = b.children[index]?.textContent.trim().toLowerCase() || '';
      return direction === 'asc' ? aText.localeCompare(bText) : bText.localeCompare(aText);
    });

    rows.forEach(row => customerTableBody.appendChild(row));
    applyCustomerTableState();
  });
});

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
    const taskList = document.querySelector('.tasks-list');

    if (taskList) taskList.dataset.filter = filterType;

    taskItems.forEach(item => {
      const deadline = item.querySelector('.task-deadline');
      const deadlineText = deadline?.textContent || '';
      const isOverdue = item.querySelector('.task-deadline.overdue');
      const isTodayText = deadlineText.includes('Hôm nay') || deadlineText.includes('HÃ´m nay');
      const isOverdueTask = item.classList.contains('task-overdue') || isOverdue;
      const isTodayTask = item.classList.contains('task-today') || (!isOverdueTask && isTodayText);
      const isUpcomingTask = item.classList.contains('task-upcoming') || (!isOverdueTask && !isTodayTask);

      if (filterType === 'all') {
        item.style.display = '';
      } else if (filterType === 'overdue') {
        item.style.display = isOverdueTask ? '' : 'none';
      } else if (filterType === 'today') {
        const isToday = item.querySelector('.task-deadline:not(.overdue)') &&
                       item.querySelector('.task-deadline').textContent.includes('Hôm nay');
        item.style.display = isTodayTask ? '' : 'none';
      } else if (filterType === 'upcoming') {
        item.style.display = isUpcomingTask ? '' : 'none';
      }
    });

    document.querySelectorAll('.task-section').forEach(section => {
      const hasVisibleTasks = Array.from(section.querySelectorAll('.task-item'))
        .some(item => item.style.display !== 'none');
      section.style.display = hasVisibleTasks ? '' : 'none';
    });
  });
});

// ========================================
// Dropdown Menus
// ========================================
function initActionMenus() {
  document.querySelectorAll('.kanban-card-menu, .action-btn').forEach(menuBtn => {
    if (menuBtn.dataset.menuBound === 'true') return;
    menuBtn.dataset.menuBound = 'true';

    menuBtn.addEventListener('click', function(e) {
      e.stopPropagation();

      document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
        if (menu !== this.nextElementSibling) menu.classList.remove('show');
      });

      let dropdown = this.nextElementSibling;
      if (!dropdown || !dropdown.classList.contains('dropdown-menu')) {
        const canDelete = this.title === 'Xóa' || this.dataset.action === 'delete';

        dropdown = document.createElement('div');
        dropdown.className = 'dropdown-menu show';
        dropdown.innerHTML = `
          <div class="dropdown-item">Xem chi tiết</div>
          <div class="dropdown-item">Chỉnh sửa</div>
          ${canDelete ? '<div class="dropdown-item danger">Xóa</div>' : ''}
        `;
        this.parentElement.appendChild(dropdown);

        dropdown.querySelectorAll('.dropdown-item').forEach(item => {
          item.addEventListener('click', (event) => {
            event.stopPropagation();
            const action = item.textContent.trim();

            if (action === 'Xóa') {
              const card = menuBtn.closest('.kanban-card');
              const row = menuBtn.closest('tr');
              const task = menuBtn.closest('.task-item');

              if (card) {
                card.style.animation = 'fade-out 0.3s ease forwards';
                setTimeout(() => {
                  card.remove();
                  updateColumnCounts();
                }, 300);
              } else if (row) {
                row.style.animation = 'fade-out 0.3s ease forwards';
                setTimeout(() => {
                  row.remove();
                  applyCustomerTableState();
                }, 300);
              } else if (task) {
                const tasks = Storage.get(Storage.KEYS.TASKS).filter(item => item.id !== task.dataset.id);
                Storage.save(Storage.KEYS.TASKS, tasks);
              }
              Toast.show('Đã xóa thành công!');
            } else {
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
}

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

  // Ctrl/Cmd + N to open quick create on the pipeline page
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
      <button class="message-reaction-btn" type="button" aria-label="Thả tim tin nhắn" aria-pressed="false" title="Thả tim">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>
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
    const stages = Object.keys(PIPELINE_STAGE_CONFIG);
    
    stages.forEach(stage => {
      const column = getPipelineColumn(stage);
      const stageContainer = column?.querySelector('.kanban-cards');
      if (stageContainer) {
        const stageDeals = deals.filter(d => d.stage === stage);
        stageContainer.innerHTML = stageDeals.map((deal, index) => {
          const meta = getDealPipelineMeta(deal, index, stage);
          const tag = deal.tag || 'warm';

          return `
          <div class="kanban-card" draggable="true" data-id="${deal.id}" data-value="${deal.value || 0}" data-probability="${meta.probability}">
            <div class="kanban-card-header">
              <span class="kanban-card-title">${deal.title}</span>
              <button class="kanban-card-menu">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
              </button>
            </div>
            <div class="kanban-card-customer">${deal.customer}</div>
            <div class="kanban-card-meta">
              <span>Phụ trách: ${meta.owner}</span>
              <span>Theo dõi: ${formatShortDate(meta.followUp)}</span>
            </div>
            <div class="kanban-card-next">
              <span>Việc tiếp theo</span>
              <strong>${meta.nextAction}</strong>
            </div>
            <div class="kanban-card-footer">
              <span class="kanban-card-value">${formatCurrency(deal.value || 0)}</span>
              <span class="kanban-card-probability">${meta.probability}%</span>
              <span class="kanban-card-tag tag-${tag}">${tag.toUpperCase()}</span>
            </div>
          </div>
        `;
        }).join('');
      }
    });
    updateColumnCounts();
    this.initDragAndDrop();
    initActionMenus();
  },

  renderCustomers() {
    const customers = Storage.get(Storage.KEYS.CUSTOMERS);
    const tbody = document.getElementById('customerTableBody');
    if (tbody) {
      tbody.innerHTML = customers.map(cust => `
        <tr data-status="${cust.status || 'active'}">
          <td><input type="checkbox" data-id="${cust.id}"></td>
          <td>
            <div class="customer-name-cell">
              <div class="customer-avatar">${(cust.name || 'KH').split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
              <div>
                <div class="customer-name">${cust.name || 'Khách hàng mới'}</div>
                <div class="customer-email">${cust.email}</div>
              </div>
            </div>
          </td>
          <td>${cust.company}</td>
          <td>${cust.email || ''}</td>
          <td>${cust.phone || ''}</td>
          <td><span class="status-badge ${cust.status || 'active'}">${getCustomerStatusLabel(cust.status)}</span></td>
          <td>${cust.latestDeal || 'Chưa có cơ hội'}</td>
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
      applyCustomerTableState();
      initActionMenus();
    }
  },

  renderTasks() {
    const taskList = document.getElementById('tasksList');
    if (!taskList) return;

    const tasks = Storage.get(Storage.KEYS.TASKS);
    const groups = [
      { key: 'overdue', title: 'Quá hạn' },
      { key: 'today', title: 'Hôm nay' },
      { key: 'upcoming', title: 'Sắp tới' }
    ];
    const priorityLabel = { hot: 'High', warm: 'Medium', cold: 'Low', high: 'High', medium: 'Medium', low: 'Low' };

    taskList.innerHTML = groups.map(group => {
      const groupTasks = tasks.filter(task => (task.category || 'upcoming') === group.key);
      return `
        <div class="task-section task-section-${group.key}">
          <div class="task-section-header">
            <span class="task-section-title">${group.title}</span>
            <span class="task-count">${groupTasks.length}</span>
          </div>
          ${groupTasks.map(task => `
            <div class="task-item task-${group.key} ${task.completed ? 'completed' : ''}" data-id="${task.id}">
              <div class="task-checkbox ${task.completed ? 'checked' : ''}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </div>
              <div class="task-content">
                <span class="task-title">${task.title || 'Nhiệm vụ mới'}</span>
                <div class="task-meta">
                  <span class="task-deadline ${group.key === 'overdue' ? 'overdue' : ''}">${task.dueLabel || formatShortDate(task.deadline)}</span>
                  <span class="task-deal">${task.deal || 'Chưa liên kết'}</span>
                  <span class="task-customer">${task.customer || 'Chưa gán'}</span>
                  <span class="task-owner">Owner: ${task.owner || 'An'}</span>
                  <span class="task-priority ${task.priority || 'warm'}">${priorityLabel[task.priority] || 'Medium'}</span>
                </div>
              </div>
              <div class="task-actions">
                <button class="action-btn" title="Chỉnh sửa">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button class="action-btn" title="Xóa">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }).join('');

    const overdue = tasks.filter(task => (task.category || 'upcoming') === 'overdue').length;
    const today = tasks.filter(task => (task.category || 'upcoming') === 'today').length;
    const completed = tasks.filter(task => task.completed).length;
    const values = document.querySelectorAll('.tasks-page .kpi-value');
    const subtitles = document.querySelectorAll('.tasks-page .kpi-subtitle');

    if (values[0]) values[0].textContent = overdue;
    if (values[1]) values[1].textContent = today;
    if (values[2]) values[2].textContent = `${tasks.length ? Math.round((completed / tasks.length) * 100) : 0}%`;
    if (subtitles[2]) subtitles[2].textContent = `${completed}/${tasks.length} nhiệm vụ`;

    initActionMenus();
    document.querySelector('.task-filter.active')?.dispatchEvent(new Event('click'));
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

  // Sidebar collapse toggle
  const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
  if (sidebarToggleBtn && sidebar) {
    const syncSidebarExpandedState = () => {
      sidebarToggleBtn.setAttribute('aria-expanded', String(!sidebar.classList.contains('collapsed')));
    };

    sidebarToggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      syncSidebarExpandedState();
      // Save state to localStorage
      localStorage.setItem('flowcrm_sidebar_collapsed', sidebar.classList.contains('collapsed'));
    });

    // Restore saved state
    const savedCollapsed = localStorage.getItem('flowcrm_sidebar_collapsed');
    if (savedCollapsed === 'true') {
      sidebar.classList.add('collapsed');
    }
    syncSidebarExpandedState();
  }

  // Initial render based on page
  UI.renderDashboard();
  UI.renderPipeline();
  UI.renderCustomers();
  UI.renderTasks();

  // Listen for data changes
  window.addEventListener('flowcrm_data_changed', (e) => {
    UI.renderDashboard();
    UI.renderPipeline();
    UI.renderCustomers();
    UI.renderTasks();
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
