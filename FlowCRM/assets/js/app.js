// FlowCRM - Main Application JavaScript
// One-time reset of demo data seeded by the earlier Vietnamese build, so returning
// visitors see the English sample data. Runs from app.js or auth.js, whichever loads first.
(function migrateFlowcrmLocale() {
  try {
    if (localStorage.getItem('flowcrm_locale') === 'en') return;
    ['flowcrm_deals', 'flowcrm_customers', 'flowcrm_tasks', 'flowcrm_events', 'flowcrm_messages', 'flowcrm_activities']
      .forEach(key => localStorage.removeItem(key));
    const session = JSON.parse(localStorage.getItem('flowcrm_session') || 'null');
    if (session && (session.isDemo || session.userId === 'demo')) localStorage.removeItem('flowcrm_session');
    localStorage.setItem('flowcrm_locale', 'en');
  } catch (error) {
    // Storage unavailable: nothing to migrate.
  }
})();

// UX Optimized Version with LocalStorage Persistence

const WorkspacePreferences = {
  options: {
    pipeline: [
      ['', 'All stages'], ['qualification', 'Qualification'], ['proposal', 'Proposal'],
      ['negotiation', 'Negotiation'], ['closed-won', 'Won'], ['closed-lost', 'Lost']
    ],
    tasks: [
      ['all', 'All tasks'], ['overdue', 'Overdue'], ['today', 'Today'],
      ['upcoming', 'Upcoming'], ['completed', 'Completed']
    ],
    calendar: [['month', 'Month'], ['week', 'Week'], ['day', 'Day']],
    motion: [['system', 'Match system'], ['reduce', 'Reduce motion']]
  },

  get(name) {
    const options = this.options[name];
    const saved = localStorage.getItem('flowcrm_preference_' + name);
    return options.find(([value]) => value === saved)?.[0] ?? options[0][0];
  },

  set(name, value) {
    if (!this.options[name].some(([option]) => option === value)) return;
    localStorage.setItem('flowcrm_preference_' + name, value);
    if (name === 'motion') document.documentElement.dataset.motion = value;
  }
};

document.documentElement.dataset.motion = WorkspacePreferences.get('motion');

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
    if (!localStorage.getItem(this.KEYS.ACTIVITIES)) {
      this.save(this.KEYS.ACTIVITIES, [
        { id: '1', type: 'deal', text: 'You created the deal <strong>Website Redesign</strong>', time: '10 min ago' },
        { id: '2', type: 'customer', text: 'Customer <strong>Nguyễn Văn An</strong> was added', time: '2 hours ago' },
        { id: '3', type: 'task', text: 'Task <strong>Send quote</strong> was completed', time: '5 hours ago' }
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
    data = data.map(item => String(item.id) === String(id) ? { ...item, ...updates } : item);
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
      text = `You created the deal <strong>${escapeText(item.title)}</strong>`;
      type = 'deal';
    } else if (key === this.KEYS.CUSTOMERS) {
      text = `Customer <strong>${escapeText(item.name)}</strong> was added`;
      type = 'customer';
    } else if (key === this.KEYS.TASKS) {
      text = `Task <strong>${escapeText(item.title)}</strong> was created`;
      type = 'task';
    }

    activities.unshift({ id: Date.now().toString(), type, text, time: 'Just now' });
    this.save(this.KEYS.ACTIVITIES, activities.slice(0, 20)); // Keep only last 20
  }
};

// Initialize Storage
Storage.init();

function hydrateDemoData() {
  if (localStorage.getItem(Storage.KEYS.DEALS) === null) {
    Storage.save(Storage.KEYS.DEALS, [
      { id: '1', title: 'Website Redesign', customer: 'ABC Company', value: 150000000, stage: 'qualification', tag: 'warm', date: '2026-05-14', owner: 'An Nguyen', nextAction: 'Confirm scope' },
      { id: '2', title: 'Mobile App Development', customer: 'Tech Solutions', value: 320000000, stage: 'qualification', tag: 'hot', date: '2026-05-14', owner: 'Linh Pham', nextAction: 'Confirm budget' },
      { id: '3', title: 'CRM Integration', customer: 'Design Co', value: 85000000, stage: 'qualification', tag: 'cold', date: '2026-05-15', owner: 'Bao Le', nextAction: 'Verify requirements' },
      { id: '4', title: 'E-commerce Platform', customer: 'Fashion Store', value: 125000000, stage: 'qualification', tag: 'warm', date: '2026-05-16', owner: 'An Nguyen', nextAction: 'Send sample proposal' },
      { id: '5', title: 'Cloud Migration', customer: 'Alpha Corp', value: 480000000, stage: 'proposal', tag: 'hot', date: '2026-05-15', owner: 'Minh Tran', nextAction: 'Send quote' },
      { id: '6', title: 'Security Audit', customer: 'Beta Industries', value: 95000000, stage: 'proposal', tag: 'warm', date: '2026-05-16', owner: 'Minh Tran', nextAction: 'Confirm audit schedule' },
      { id: '7', title: 'Data Analytics Suite', customer: 'Gamma Ltd', value: 210000000, stage: 'proposal', tag: 'warm', date: '2026-05-17', owner: 'An Nguyen', nextAction: 'Review proposal' },
      { id: '8', title: 'Marketing Automation', customer: 'Delta Inc', value: 180000000, stage: 'negotiation', tag: 'hot', date: '2026-05-15', owner: 'Minh Tran', nextAction: 'Finalize terms' },
      { id: '9', title: 'Inventory System', customer: 'Epsilon Co', value: 120000000, stage: 'negotiation', tag: 'warm', date: '2026-05-18', owner: 'Linh Pham', nextAction: 'Product demo' },
      { id: '10', title: 'SEO Optimization', customer: 'Zeta Group', value: 75000000, stage: 'closed', tag: 'won', date: '2026-05-10', owner: 'Bao Le', nextAction: 'Project handover' },
      { id: '11', title: 'UI/UX Design System', customer: 'Eta Corp', value: 95000000, stage: 'closed', tag: 'won', date: '2026-05-11', owner: 'Linh Pham', nextAction: 'Send invoice' },
      { id: '12', title: 'Social Media Campaign', customer: 'Theta Ltd', value: 45000000, stage: 'lost', tag: 'lost', date: '2026-05-09', owner: 'Bao Le', nextAction: 'Record loss reason' }
    ]);
  }

  if (localStorage.getItem(Storage.KEYS.CUSTOMERS) === null) {
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

  if (localStorage.getItem(Storage.KEYS.TASKS) === null) {
    Storage.save(Storage.KEYS.TASKS, [
      { id: '1', title: 'Call Alpha Corp', deadline: '2026-05-10', dueLabel: 'Overdue: May 10, 2026', category: 'overdue', deal: 'Cloud Migration', customer: 'Alpha Corp', owner: 'An', priority: 'hot', completed: false },
      { id: '2', title: 'Send quote to Beta Industries', deadline: '2026-05-11', dueLabel: 'Overdue: May 11, 2026', category: 'overdue', deal: 'Security Audit', customer: 'Beta Industries', owner: 'Minh', priority: 'hot', completed: false },
      { id: '3', title: 'Team meeting on Q2 pipeline', deadline: '2026-05-14', dueLabel: 'Today, 14:00', category: 'today', deal: 'Internal', customer: 'Sales team', owner: 'An', priority: 'warm', completed: false },
      { id: '4', title: 'Send quote to Tech Solutions', deadline: '2026-05-14', dueLabel: 'Today, 10:30', category: 'today', deal: 'Mobile App Development', customer: 'Tech Solutions', owner: 'Linh', priority: 'warm', completed: true },
      { id: '5', title: 'Follow up on Design Co deal', deadline: '2026-05-14', dueLabel: 'Today, 16:30', category: 'today', deal: 'CRM Integration', customer: 'Design Co', owner: 'Bao', priority: 'hot', completed: false },
      { id: '6', title: 'Send contract to Delta Inc', deadline: '2026-05-15', dueLabel: 'May 15, 2026', category: 'upcoming', deal: 'Marketing Automation', customer: 'Delta Inc', owner: 'Minh', priority: 'warm', completed: false },
      { id: '7', title: 'Product demo for Epsilon Co', deadline: '2026-05-18', dueLabel: 'May 18, 2026', category: 'upcoming', deal: 'Inventory System', customer: 'Epsilon Co', owner: 'Linh', priority: 'cold', completed: false },
      { id: '8', title: 'Review proposal with Gamma Ltd', deadline: '2026-05-20', dueLabel: 'May 20, 2026', category: 'upcoming', deal: 'Data Analytics Suite', customer: 'Gamma Ltd', owner: 'An', priority: 'warm', completed: false },
      { id: '9', title: 'Close deal with Zeta Group', deadline: '2026-05-25', dueLabel: 'May 25, 2026', category: 'upcoming', deal: 'SEO Optimization', customer: 'Zeta Group', owner: 'Bao', priority: 'hot', completed: false }
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
function escapeText(value) {
  const characters = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(value ?? '').replace(/[&<>"']/g, character => characters[character]);
}

function localDateKey(date) {
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()]
    .map((part, index) => index === 0 ? String(part) : String(part).padStart(2, '0'))
    .join('-');
}


function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
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
    nextAction: 'Confirm budget'
  },
  proposal: {
    selector: 'proposal',
    probability: 52,
    nextAction: 'Send proposal'
  },
  negotiation: {
    selector: 'negotiation',
    probability: 68,
    nextAction: 'Finalize terms'
  },
  closed: {
    selector: 'closed-won',
    probability: 100,
    nextAction: 'Project handover'
  },
  lost: {
    selector: 'closed-lost',
    probability: 0,
    nextAction: 'Record loss reason'
  }
};

const PIPELINE_OWNERS = ['An Nguyen', 'Minh Tran', 'Linh Pham', 'Bao Le'];

function formatShortDate(value) {
  if (!value) return 'No date';

  const date = new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? value + "T00:00:00" : value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
}

function getPipelineColumn(stage) {
  const config = PIPELINE_STAGE_CONFIG[stage] || {};
  return document.querySelector(
    `.kanban-column[data-stage="${stage}"], .kanban-column[data-stage="${config.selector}"]`
  );
}

function normalizePipelineStage(stage) {
  if (Object.hasOwn(PIPELINE_STAGE_CONFIG, stage)) return stage;
  return Object.keys(PIPELINE_STAGE_CONFIG).find(key => PIPELINE_STAGE_CONFIG[key].selector === stage) || 'proposal';
}

function getDealPipelineMeta(deal, index, stage) {
  const config = PIPELINE_STAGE_CONFIG[stage] || PIPELINE_STAGE_CONFIG.qualification;

  return {
    owner: deal.owner || PIPELINE_OWNERS[index % PIPELINE_OWNERS.length],
    followUp: deal.plan?.dueDate || deal.followUp || deal.date,
    probability: Number.isFinite(deal.probability) ? deal.probability : config.probability,
    nextAction: deal.plan ? (deal.plan.completed ? 'Follow-up completed' : deal.plan.task) : (deal.nextAction || config.nextAction)
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
const modalOpeners = new WeakMap();

function openModal(modal) {
  if (!modal || modal.classList.contains('active')) return;
  modalOpeners.set(modal, document.activeElement);
  modal.classList.add('active');
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  const title = modal.querySelector('.modal-title');
  if (title) {
    title.id ||= modal.id + 'Title';
    modal.setAttribute('aria-labelledby', title.id);
  }
  document.body.style.overflow = 'hidden';
  const initial = modal.querySelector('input:not([type="hidden"]), textarea, select') || modal.querySelector('button');
  initial?.focus();
}

function closeModal(modal) {
  if (!modal?.classList.contains('active')) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
  modalOpeners.get(modal)?.focus();
  modalOpeners.delete(modal);
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
let editingCustomerId = null;

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
// Quick create dialog (Pipeline)
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
function openCustomerForm(customer) {
  editingCustomerId = customer?.id ?? null;
  addCustomerForm.reset();
  addCustomerModal.querySelector('.modal-title').textContent = customer ? 'Edit customer' : 'Add customer';
  if (customer) {
    for (const key of ['name', 'email', 'phone', 'company', 'status', 'notes']) {
      const field = document.getElementById('customer' + key[0].toUpperCase() + key.slice(1));
      field.value = customer[key] ?? field.value;
    }
  }
  openModal(addCustomerModal);
}

addCustomerBtn?.addEventListener('click', () => openCustomerForm());
customerTableBody?.addEventListener('click', event => {
  const edit = event.target.closest('[data-edit-customer]');
  if (!edit) return;
  const customer = Storage.get(Storage.KEYS.CUSTOMERS).find(item => String(item.id) === edit.dataset.editCustomer);
  if (customer) openCustomerForm(customer);
});

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
    const today = localDateKey(new Date());
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
      const rawDealValue = formData.get('opportunityValue') || document.getElementById('opportunityValue')?.value;
      const newDeal = {
        title: formData.get('opportunityTitle') || document.getElementById('opportunityName')?.value || 'Untitled deal',
        customer: formData.get('customerName') || document.getElementById('opportunityCustomer')?.selectedOptions[0]?.textContent || 'Prospect',
        value: Number(String(rawDealValue || '').replace(/[^\d]/g, '')) || 0,
        stage: normalizePipelineStage(formData.get('opportunityStage') || document.getElementById('opportunityStage')?.value || 'qualification'),
        tag: formData.get('opportunityPriority') || document.getElementById('opportunityPriority')?.value || 'warm',
        date: new Date().toISOString().split('T')[0]
      };

      createDealBtn.disabled = true;
      createDealBtn.textContent = 'Creating...';

      setTimeout(() => {
        Storage.addItem(Storage.KEYS.DEALS, newDeal);
        createDealBtn.disabled = false;
        createDealBtn.textContent = 'Create deal';
        quickCreateForm.reset();
        closeModal(quickCreateModal);
        Toast.show('Deal created.');
      }, 500);
    }
  });
}

// ========================================
// Customer Creation with Toast
// ========================================
if (saveCustomerBtn && addCustomerForm) {
  const saveCustomer = event => {
    event.preventDefault();
    const name = document.getElementById('customerName');
    name.value = name.value.trim();
    if (!addCustomerForm.reportValidity()) return;
    const customer = {
      name: name.value,
      email: document.getElementById('customerEmail').value,
      phone: document.getElementById('customerPhone').value,
      company: document.getElementById('customerCompany').value,
      status: document.getElementById('customerStatus').value,
      notes: document.getElementById('customerNotes').value
    };
    closeModal(addCustomerModal);
    if (editingCustomerId === null) {
      Storage.addItem(Storage.KEYS.CUSTOMERS, { ...customer, latestDeal: 'No deals yet' });
      Toast.show('Customer added.');
    } else {
      Storage.updateItem(Storage.KEYS.CUSTOMERS, editingCustomerId, customer);
      const editButton = [...customerTableBody.querySelectorAll('[data-edit-customer]')]
        .find(button => button.dataset.editCustomer === String(editingCustomerId) && button.getClientRects().length);
      (editButton || tableSearch)?.focus();
      Toast.show('Customer saved.');
    }
  };
  saveCustomerBtn.addEventListener('click', saveCustomer);
  addCustomerForm.addEventListener('submit', saveCustomer);
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
        title: getFieldValue(formData, 'taskTitle', 'taskTitle', 'New task'),
        deadline,
        dueLabel: deadline ? `${formatShortDate(deadline)}${time ? `, ${time}` : ''}` : 'No due date',
        category: deadline === localDateKey(new Date()) ? 'today'
          : deadline && deadline < localDateKey(new Date()) ? 'overdue' : 'upcoming',
        deal: dealSelect?.value && selectedDeal ? selectedDeal : 'Not linked',
        customer: dealSelect?.value && selectedDeal.includes('-') ? selectedDeal.split('-').pop().trim() : 'Unassigned',
        owner: 'An',
        priority: getFieldValue(formData, 'taskPriority', 'taskPriority', 'warm'),
        completed: false
      };

      saveTaskBtn.disabled = true;
      saveTaskBtn.textContent = 'Creating...';

      setTimeout(() => {
        Storage.addItem(Storage.KEYS.TASKS, newTask);
        saveTaskBtn.disabled = false;
        saveTaskBtn.textContent = 'Create task';
        addTaskForm.reset();
        closeModal(addTaskModal);
        Toast.show('Task created.');
      }, 500);
    }
  });
}

// ========================================
// Event Creation
// ========================================
if (saveEventBtn && addEventForm) {
  saveEventBtn.addEventListener('click', (eventClick) => {
    eventClick.preventDefault();

    if (!validateForm(addEventForm)) return;

    const formData = new FormData(addEventForm);
    const event = {
      id: Date.now().toString(),
      title: getFieldValue(formData, 'eventTitle', 'eventTitle', 'New appointment'),
      date: getFieldValue(formData, 'eventDate', 'eventDate'),
      startTime: getFieldValue(formData, 'eventStartTime', 'eventStartTime'),
      endTime: getFieldValue(formData, 'eventEndTime', 'eventEndTime'),
      customer: document.getElementById('eventCustomer')?.selectedOptions[0]?.textContent || '',
      location: getFieldValue(formData, 'eventLocation', 'eventLocation'),
      notes: getFieldValue(formData, 'eventNotes', 'eventNotes')
    };

    saveEventBtn.disabled = true;
    saveEventBtn.textContent = 'Creating...';

    setTimeout(() => {
      const events = Storage.get(Storage.KEYS.EVENTS);
      Storage.save(Storage.KEYS.EVENTS, [event, ...events]);
      saveEventBtn.disabled = false;
      saveEventBtn.textContent = 'Create appointment';
      addEventForm.reset();
      closeModal(addEventModal);
      window.dispatchEvent(new CustomEvent('flowcrm_event_created', { detail: event }));
      Toast.show('Appointment created.');
    }, 500);
  }, true);
}

// ========================================
// Kanban Drag and Drop with visual feedback
// ========================================
const kanbanBoard = document.getElementById('kanbanBoard');
const pipelineSearch = document.getElementById('pipelineSearch');
const pipelineStageFilter = document.getElementById('pipelineStageFilter');

pipelineSearch?.addEventListener('input', () => UI.renderPipeline());
pipelineStageFilter?.addEventListener('change', () => UI.renderPipeline());

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
  sourceColumn = this.closest('.kanban-column');
  this.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', this.dataset.id);
}

function handleDragEnd(e) {
  draggedCard = sourceColumn = null;
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

  if (!draggedCard || sourceColumn === this) return;

  Storage.updateItem(Storage.KEYS.DEALS, draggedCard.dataset.id, {
    stage: normalizePipelineStage(this.dataset.stage),
    probability: undefined
  });
  draggedCard = sourceColumn = null;
  Toast.show('Deal stage saved.');
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
      emptyState.textContent = 'No deals in this stage';
    } else if (emptyState) {
      emptyState.remove();
    }

    const totalValue = Array.from(cards).reduce((sum, card) => sum + parseCardValue(card), 0);
    let summary = column.querySelector('.kanban-column-summary');
    if (!summary) {
      summary = document.createElement('div');
      summary.className = 'kanban-column-summary';
      column.appendChild(summary);
    }
    summary.textContent = formatCurrency(totalValue);
  });
}

// ========================================
// Task completion
// ========================================
document.getElementById('tasksList')?.addEventListener('click', event => {
  const button = event.target.closest('.task-complete');
  if (!button) return;
  const id = button.closest('.task-item').dataset.id;
  const completed = button.getAttribute('aria-pressed') !== 'true';
  Storage.updateItem(Storage.KEYS.TASKS, id, { completed });
  const nextButton = [...document.querySelectorAll('.task-item')].find(item => item.dataset.id === id)?.querySelector('.task-complete');
  if (nextButton?.getClientRects().length) nextButton.focus();
  else document.querySelector('.task-filter.active')?.focus();
  Toast.show(completed ? 'Task completed.' : 'Task reopened.');
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

function getCustomerStatusLabel(status = 'active') {
  const labels = {
    active: 'Active',
    prospect: 'Prospect',
    inactive: 'Inactive'
  };
  return labels[status] || status;
}

function applyCustomerTableState() {
  const rows = customerTableBody?.querySelectorAll('tr');
  if (!rows) return;

  const searchTerm = (tableSearch?.value || '').toLowerCase();
  const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';

  let count = 0;
  rows.forEach(row => {
    const matchesSearch = row.textContent.toLowerCase().includes(searchTerm.trim());
    const matchesFilter = activeFilter === 'all' || row.dataset.status === activeFilter;
    row.hidden = !matchesSearch || !matchesFilter;
    if (!row.hidden) count++;
  });
  document.getElementById('customerCount').textContent = count + (count === 1 ? ' customer' : ' customers');
  document.getElementById('customersEmpty').hidden = count > 0;
}

document.querySelectorAll('.filter-btn').forEach(button => {
  button.addEventListener('click', function() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn === this);
      btn.setAttribute('aria-pressed', String(btn === this));
    });
    applyCustomerTableState();
  });
});

document.querySelectorAll('.customer-table th.sortable').forEach(header => {
  header.addEventListener('click', function() {
    if (!customerTableBody) return;

    const index = Array.from(this.parentElement.children).indexOf(this);
    const direction = this.classList.contains('asc') ? 'desc' : 'asc';
    const rows = Array.from(customerTableBody.querySelectorAll('tr'));

    document.querySelectorAll('.customer-table th.sortable').forEach(th => {
      th.classList.remove('sorted', 'asc', 'desc');
      th.removeAttribute('aria-sort');
    });
    this.setAttribute('aria-sort', direction === 'asc' ? 'ascending' : 'descending');
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
// Task filters
// ========================================
document.querySelectorAll('.task-filter').forEach(filter => {
  filter.addEventListener('click', function() {
    document.querySelectorAll('.task-filter').forEach(item => {
      item.classList.toggle('active', item === this);
      item.setAttribute('aria-pressed', String(item === this));
    });
    const filterType = this.dataset.filter;
    const taskItems = [...document.querySelectorAll('#tasksList .task-item')];
    taskItems.forEach(item => {
      item.hidden = filterType !== 'all' && (filterType === 'completed'
        ? !item.classList.contains('completed')
        : !item.classList.contains('task-' + filterType) || item.classList.contains('completed'));
    });
    document.querySelectorAll('#tasksList .task-section').forEach(section => {
      section.hidden = !section.querySelector('.task-item:not([hidden])');
    });
    document.getElementById('tasksEmpty').hidden = taskItems.some(item => !item.hidden);
  });
});

// ========================================
// Dropdown Menus
// ========================================
function initActionMenus() {
  document.querySelectorAll('.kanban-card-menu:not([data-deal-open]), .action-btn').forEach(menuBtn => {
    if (menuBtn.dataset.menuBound === 'true') return;
    menuBtn.dataset.menuBound = 'true';

    menuBtn.addEventListener('click', function(e) {
      e.stopPropagation();

      document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
        if (menu !== this.nextElementSibling) menu.classList.remove('show');
      });

      let dropdown = this.nextElementSibling;
      if (!dropdown || !dropdown.classList.contains('dropdown-menu')) {
        const canDelete = this.title === 'Delete' || this.dataset.action === 'delete';

        dropdown = document.createElement('div');
        dropdown.className = 'dropdown-menu show';
        dropdown.innerHTML = `
          <div class="dropdown-item" data-action="view">View details</div>
          <div class="dropdown-item" data-action="edit">Edit</div>
          ${canDelete ? '<div class="dropdown-item danger" data-action="delete">Delete</div>' : ''}
        `;
        this.parentElement.appendChild(dropdown);

        dropdown.querySelectorAll('.dropdown-item').forEach(item => {
          item.addEventListener('click', (event) => {
            event.stopPropagation();
            const action = item.dataset.action;

            if (action === 'delete') {
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
              Toast.show('Deleted.');
            } else {
              Toast.show('Coming soon.');
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
      const isDelete = this.innerHTML.includes('trash') || this.title === 'Delete';

      dropdown = document.createElement('div');
      dropdown.className = 'dropdown-menu show';
      dropdown.innerHTML = `
        <div class="dropdown-item" data-action="view">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          View details
        </div>
        <div class="dropdown-item" data-action="edit">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Edit
        </div>
        ${isDelete ? `
        <div class="dropdown-item danger" data-action="delete">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
          Delete
        </div>` : ''}
      `;
      this.parentElement.appendChild(dropdown);

      dropdown.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function(e) {
          e.stopPropagation();
          const action = this.dataset.action;

          if (action === 'delete') {
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
            Toast.show('Deleted.');
          } else if (action === 'edit') {
            Toast.show('Coming soon.');
          } else if (action === 'view') {
            Toast.show('Coming soon.');
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

  if (e.key === 'Tab') {
    const modal = document.querySelector('.modal-overlay.active');
    const controls = [...(modal?.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href]') || [])]
      .filter(control => control.getClientRects().length);
    const boundary = e.shiftKey ? controls.at(0) : controls.at(-1);
    if (boundary && boundary === document.activeElement) {
      e.preventDefault();
      (e.shiftKey ? controls.at(-1) : controls.at(0)).focus();
    }
  }

  // Ctrl/Cmd + N to open quick create on the pipeline page
  if ((e.ctrlKey || e.metaKey) && e.key === 'n' && quickCreateModal) {
    e.preventDefault();
    openModal(quickCreateModal);
  }

  // Ctrl/Cmd + K to focus search
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    const searchInput = document.querySelector('#pipelineSearch, .search-box input, .table-search input');
    if (searchInput) {
      e.preventDefault();
      searchInput.focus();
    }
  }
});

// ========================================
// ========================================
// Global Search (Cmd/Ctrl + K hint)
// ========================================
document.addEventListener('keyup', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    Toast.show('Press Ctrl+K to search', 2000);
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

    const pending = document.getElementById('dashboardPendingTasks');
    if (pending) {
      const followUps = deals.filter(deal => deal.plan && !deal.plan.completed).length;
      pending.textContent = (tasks.filter(task => !task.completed).length + followUps) + ' open tasks';
    }

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
    if (!kanbanBoard) return;
    const deals = Storage.get(Storage.KEYS.DEALS);
    const query = pipelineSearch.value.trim().toLocaleLowerCase('vi');
    const selectedStage = pipelineStageFilter.value;
    const matchingDeals = deals.filter(deal => [deal.title, deal.customer].join(' ').toLocaleLowerCase('vi').includes(query));
    const visibleDeals = selectedStage ? matchingDeals.filter(deal => normalizePipelineStage(deal.stage) === normalizePipelineStage(selectedStage)) : matchingDeals;
    document.getElementById('pipelineTotal').textContent = formatCurrency(deals.reduce((sum, deal) => sum + (Number(deal.value) || 0), 0));
    document.getElementById('pipelineOpen').textContent = deals.filter(deal => !['closed', 'lost'].includes(normalizePipelineStage(deal.stage))).length;
    document.getElementById('pipelineWon').textContent = deals.filter(deal => normalizePipelineStage(deal.stage) === 'closed').length;
    document.getElementById('pipelineEmpty').hidden = visibleDeals.length > 0;
    document.querySelector('.pipeline-stage-links').hidden = Boolean(selectedStage) || !visibleDeals.length;
    kanbanBoard.classList.toggle('filtered', Boolean(selectedStage));

    Object.keys(PIPELINE_STAGE_CONFIG).forEach(stage => {
      const column = getPipelineColumn(stage);
      if (!column) return;
      const stageDeals = visibleDeals.filter(deal => normalizePipelineStage(deal.stage) === stage);
      column.hidden = (selectedStage && selectedStage !== column.dataset.stage) || (query && !stageDeals.length);
      column.querySelector('.kanban-cards').innerHTML = stageDeals.map((deal, index) => {
        const meta = getDealPipelineMeta(deal, index, stage);
        return `
          <article class="kanban-card" draggable="true" data-id="${escapeText(deal.id)}" data-value="${Number(deal.value) || 0}" data-probability="${meta.probability}">
            <button class="kanban-card-title deal-open" type="button" data-deal-open>${escapeText(deal.title)}</button>
            <p class="kanban-card-customer">${escapeText(deal.customer)}</p>
            <div class="kanban-card-footer">
              <strong class="kanban-card-value">${formatCurrency(deal.value || 0)}</strong>
              <span class="kanban-card-probability" aria-label="Win probability ${meta.probability}%">${meta.probability}% win</span>
            </div>
            <div class="kanban-card-next">
              <span>${escapeText(meta.nextAction)}</span>
              <time datetime="${escapeText(meta.followUp)}">${escapeText(formatShortDate(meta.followUp))}</time>
            </div>
          </article>`;
      }).join('');
    });
    updateColumnCounts();
    this.initDragAndDrop();
  },

  renderCustomers() {
    const customers = Storage.get(Storage.KEYS.CUSTOMERS);
    const tbody = document.getElementById('customerTableBody');
    if (tbody) {
      tbody.innerHTML = customers.map(customer => {
        const name = customer.name || 'New customer';
        const status = ['active', 'prospect', 'inactive'].includes(customer.status) ? customer.status : 'active';
        return `
        <tr data-status="${status}">
          <td><div class="customer-name-cell">
            <div class="customer-avatar" aria-hidden="true">${escapeText(Auth.getInitials(name))}</div>
            <div><div class="customer-name">${escapeText(name)}</div>
              <div class="customer-email">${escapeText(customer.email)}</div></div>
          </div></td>
          <td data-label="Company">${escapeText(customer.company || 'Not set')}</td>
          <td data-label="Phone">${escapeText(customer.phone || 'Not set')}</td>
          <td data-label="Status"><span class="status-badge ${status}">${getCustomerStatusLabel(status)}</span></td>
          <td data-label="Latest deal">${escapeText(customer.latestDeal || 'No deals yet')}</td>
          <td><button type="button" class="btn btn-secondary btn-sm" aria-label="Edit ${escapeText(name)}" data-edit-customer="${escapeText(customer.id)}">Edit</button></td>
        </tr>`;
      }).join('');
      document.querySelectorAll('.filter-btn').forEach(button => {
        const filter = button.dataset.filter;
        const count = filter === 'all' ? customers.length : customers.filter(customer => (customer.status || 'active') === filter).length;
        button.querySelector('.filter-count').textContent = count;
      });
      applyCustomerTableState();
    }
  },

  renderTasks() {
    const taskList = document.getElementById('tasksList');
    if (!taskList) return;

    const tasks = Storage.get(Storage.KEYS.TASKS);
    const groups = [
      { key: 'overdue', title: 'Overdue' },
      { key: 'today', title: 'Today' },
      { key: 'upcoming', title: 'Upcoming' },
      { key: 'completed', title: 'Completed' }
    ];
    const priorityLabel = { hot: 'High', warm: 'Medium', cold: 'Low', high: 'High', medium: 'Medium', low: 'Low' };

    taskList.innerHTML = groups.map(group => {
      const groupTasks = tasks.filter(task => (task.completed ? 'completed' : (task.category || 'upcoming')) === group.key);
      return `
        <div class="task-section task-section-${group.key}">
          <div class="task-section-header">
            <h3 class="task-section-title">${group.title}</h3>
            <span class="task-count">${groupTasks.length}</span>
          </div>
          ${groupTasks.map(task => `
            <div class="task-item task-${group.key} ${task.completed ? 'completed' : ''}" data-id="${escapeText(task.id)}">
              <button class="task-complete" type="button" aria-pressed="${Boolean(task.completed)}" aria-label="${task.completed ? 'Reopen' : 'Complete'} ${escapeText(task.title)}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </button>
              <div class="task-content">
                <span class="task-title">${escapeText(task.title || 'New task')}</span>
                <div class="task-meta">
                  ${task.deal && task.deal !== 'Not linked' ? `<span class="task-deal">${escapeText(task.deal)}</span>` : ''}
                  ${task.customer && task.customer !== 'Unassigned' && !task.deal?.includes(task.customer) ? `<span class="task-customer">${escapeText(task.customer)}</span>` : ''}
                  ${task.owner ? `<span class="task-owner">Owner: ${escapeText(task.owner)}</span>` : ''}
                </div>
              </div>
              <div class="task-timing">
                <span class="task-deadline ${group.key === 'overdue' ? 'overdue' : ''}">${escapeText(task.dueLabel || formatShortDate(task.deadline))}</span>
                <span class="task-priority ${Object.hasOwn(priorityLabel, task.priority) ? task.priority : 'warm'}">${priorityLabel[task.priority] || 'Medium'} priority</span>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }).join('');

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

  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar = document.querySelector('.sidebar');
  const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
  const mobile = window.matchMedia('(max-width: 900px)');
  const main = document.getElementById('mainContent');
  const setMenu = (open, restoreFocus = false) => {
    sidebar.classList.toggle('open', open);
    sidebarToggle.setAttribute('aria-expanded', String(open));
    sidebarToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    main.inert = open;
    if (open) sidebar.querySelector('.nav-item[aria-current="page"], .nav-item')?.focus();
    else if (restoreFocus) sidebarToggle.focus();
  };
  if (sidebarToggle && sidebar && main) {
    sidebarToggle.addEventListener('click', () => setMenu(!sidebar.classList.contains('open'), true));
    document.addEventListener('click', event => {
      if (sidebar.classList.contains('open') && !sidebar.contains(event.target) && !sidebarToggle.contains(event.target)) {
        setMenu(false, true);
      }
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && sidebar.classList.contains('open')) setMenu(false, true);
    });
  }
  if (sidebarToggleBtn && sidebar) {
    const applyCollapsed = () => {
      const collapsed = !mobile.matches && localStorage.getItem('flowcrm_sidebar_collapsed') === 'true';
      sidebar.classList.toggle('collapsed', collapsed);
      sidebarToggleBtn.setAttribute('aria-expanded', String(!collapsed));
      sidebarToggleBtn.setAttribute('aria-label', collapsed ? 'Expand navigation' : 'Collapse navigation');
    };
    sidebarToggleBtn.addEventListener('click', () => {
      localStorage.setItem('flowcrm_sidebar_collapsed', String(!sidebar.classList.contains('collapsed')));
      window.dispatchEvent(new Event('flowcrm_sidebar_changed'));
    });
    window.addEventListener('flowcrm_sidebar_changed', applyCollapsed);
    mobile.addEventListener('change', () => {
      if (!mobile.matches && sidebarToggle && main) setMenu(false);
      applyCollapsed();
    });
    applyCollapsed();
  }

  // Keep a direct link to a deal visible regardless of the preferred filter.
  if (pipelineStageFilter && !new URLSearchParams(location.search).has('deal')) {
    pipelineStageFilter.value = WorkspacePreferences.get('pipeline');
  }
  document.querySelector(`.task-filter[data-filter="${WorkspacePreferences.get('tasks')}"]`)?.click();

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
