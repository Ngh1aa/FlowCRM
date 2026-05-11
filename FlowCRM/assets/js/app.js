// FlowCRM - Main Application JavaScript

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

// ========================================
// Modal Functions
// ========================================
function openModal(modal) {
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modal) {
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Quick Create Modal
if (quickCreateBtn) {
  quickCreateBtn.addEventListener('click', () => openModal(quickCreateModal));
}

if (closeModalBtn) {
  closeModalBtn.addEventListener('click', () => closeModal(quickCreateModal));
}

if (cancelBtn) {
  cancelBtn.addEventListener('click', () => closeModal(quickCreateModal));
}

// Close modal on overlay click
if (quickCreateModal) {
  quickCreateModal.addEventListener('click', (e) => {
    if (e.target === quickCreateModal) {
      closeModal(quickCreateModal);
    }
  });
}

// Add Customer Modal
if (addCustomerBtn) {
  addCustomerBtn.addEventListener('click', () => openModal(addCustomerModal));
}

if (closeModalBtn) {
  const closeBtnInCustomerModal = addCustomerModal?.querySelector('#closeModalBtn');
  if (closeBtnInCustomerModal) {
    closeBtnInCustomerModal.addEventListener('click', () => closeModal(addCustomerModal));
  }
}

if (cancelBtn) {
  const cancelBtnInCustomerModal = addCustomerModal?.querySelector('#cancelBtn');
  if (cancelBtnInCustomerModal) {
    cancelBtnInCustomerModal.addEventListener('click', () => closeModal(addCustomerModal));
  }
}

if (addCustomerModal) {
  addCustomerModal.addEventListener('click', (e) => {
    if (e.target === addCustomerModal) {
      closeModal(addCustomerModal);
    }
  });
}

// ========================================
// Form Validation
// ========================================
function validateForm(form) {
  let isValid = true;
  const requiredInputs = form.querySelectorAll('[required]');

  requiredInputs.forEach(input => {
    const formGroup = input.closest('.form-group');

    if (!input.value.trim()) {
      formGroup?.classList.add('has-error');
      isValid = false;
    } else {
      formGroup?.classList.remove('has-error');
    }
  });

  return isValid;
}

// Real-time validation
document.querySelectorAll('.form-input').forEach(input => {
  input.addEventListener('blur', function() {
    const formGroup = this.closest('.form-group');

    if (this.hasAttribute('required') && !this.value.trim()) {
      formGroup?.classList.add('has-error');
    } else {
      formGroup?.classList.remove('has-error');
    }
  });

  input.addEventListener('input', function() {
    const formGroup = this.closest('.form-group');
    formGroup?.classList.remove('has-error');
  });
});

// ========================================
// Deal Creation
// ========================================
if (createDealBtn) {
  createDealBtn.addEventListener('click', () => {
    if (validateForm(quickCreateForm)) {
      // Simulate creating a deal
      const dealName = document.getElementById('dealName').value;
      const dealValue = document.getElementById('dealValue').value;
      const dealStage = document.getElementById('dealStage').value;
      const dealCustomer = document.getElementById('dealCustomer').value;
      const dealPriority = document.getElementById('dealPriority').value;

      console.log('Creating deal:', {
        name: dealName,
        value: dealValue,
        stage: dealStage,
        customer: dealCustomer,
        priority: dealPriority
      });

      // Show success feedback
      createDealBtn.textContent = 'Đang tạo...';
      setTimeout(() => {
        createDealBtn.textContent = 'Tạo Deal';

        // Reset form
        quickCreateForm.reset();

        // Close modal
        closeModal(quickCreateModal);

        // Show notification (could be improved with a toast system)
        alert('Deal đã được tạo thành công!');
      }, 500);
    }
  });
}

// ========================================
// Customer Creation
// ========================================
if (saveCustomerBtn) {
  saveCustomerBtn.addEventListener('click', () => {
    if (validateForm(addCustomerForm)) {
      const firstName = document.getElementById('customerFirstName').value;
      const lastName = document.getElementById('customerLastName').value;
      const email = document.getElementById('customerEmail').value;

      console.log('Creating customer:', {
        firstName,
        lastName,
        email
      });

      saveCustomerBtn.textContent = 'Đang lưu...';
      setTimeout(() => {
        saveCustomerBtn.textContent = 'Lưu khách hàng';
        addCustomerForm.reset();
        closeModal(addCustomerModal);
        alert('Khách hàng đã được thêm thành công!');
      }, 500);
    }
  });
}

// ========================================
// Kanban Drag and Drop
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

      // Update the column count
      updateColumnCounts();

      // Log the move
      const dealId = draggedCard.dataset.id;
      const newStage = this.dataset.stage;
      console.log(`Deal ${dealId} moved to ${newStage}`);
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
// Customer Table Search
// ========================================
if (tableSearch) {
  tableSearch.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const rows = customerTableBody?.querySelectorAll('tr');

    rows?.forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
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
// Dropdown Menus
// ========================================
document.querySelectorAll('.kanban-card-menu').forEach(menuBtn => {
  menuBtn.addEventListener('click', function(e) {
    e.stopPropagation();

    // Close any open dropdowns first
    document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
      menu.classList.remove('show');
    });

    // Create dropdown menu if not exists
    let dropdown = this.nextElementSibling;
    if (!dropdown || !dropdown.classList.contains('dropdown-menu')) {
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
        <div class="dropdown-item danger">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
          Xóa
        </div>
      `;
      this.parentElement.appendChild(dropdown);

      // Handle dropdown item clicks
      dropdown.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function(e) {
          e.stopPropagation();
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

  // Ctrl/Cmd + N to open quick create
  if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
    e.preventDefault();
    openModal(quickCreateModal);
  }
});

// ========================================
// Utility Functions
// ========================================

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

// Debounce function
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
// Initialize App
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('FlowCRM initialized');

  // Add smooth transition to kanban cards
  document.querySelectorAll('.kanban-card').forEach(card => {
    card.style.transition = 'box-shadow 0.2s ease, transform 0.2s ease';
  });

  // Initialize tooltips (if needed)
  // This is a placeholder for tooltip functionality
});