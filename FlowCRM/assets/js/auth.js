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

/**
 * FlowCRM - Authentication Module
 * Client-side auth with localStorage and SHA-256 password hashing
 */

const Auth = {
  KEYS: {
    USERS: 'flowcrm_users',
    SESSION: 'flowcrm_session'
  },

  ROLES: {
    ADMIN: 'admin',
    MANAGER: 'manager',
    SALES: 'sales'
  },

  PERMISSIONS: {
    VIEW_REPORTS: 'view_reports',
    MANAGE_USERS: 'manage_users',
    SYSTEM_SETTINGS: 'system_settings'
  },

  /**
   * Hash password using SHA-256 Web Crypto API
   */
  async hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },

  /**
   * Get initials from name for avatar
   */
  getInitials(name) {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  },

  /**
   * Get role display name
   */
  getRoleDisplayName(role) {
    const roles = {
      admin: 'Admin',
      manager: 'Manager',
      sales: 'Sales rep'
    };
    return roles[role] || role;
  },

  /**
   * Get all users
   */
  getUsers() {
    const data = localStorage.getItem(this.KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },

  /**
   * Save users to localStorage
   */
  saveUsers(users) {
    localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));
  },

  /**
   * Get user by ID
   */
  getUserById(id) {
    const users = this.getUsers();
    return users.find(u => u.id === id);
  },

  /**
   * Get user by email
   */
  getUserByEmail(email) {
    const users = this.getUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  /**
   * Check if email already exists
   */
  emailExists(email) {
    return this.getUserByEmail(email) !== undefined;
  },

  /**
   * Register a new user
   * First user automatically becomes admin
   */
  async register(name, email, password) {
    if (!name || !email || !password) {
      throw new Error('Please fill in all fields');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    if (this.emailExists(email)) {
      throw new Error('This email is already in use');
    }

    const users = this.getUsers();
    const isFirstUser = users.length === 0;

    const user = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash: await this.hashPassword(password),
      role: isFirstUser ? this.ROLES.ADMIN : this.ROLES.SALES,
      avatar: this.getInitials(name),
      createdAt: new Date().toISOString()
    };

    users.push(user);
    this.saveUsers(users);

    // Auto login after registration
    this.createSession(user);

    return user;
  },

  /**
   * Login with email and password
   */
  async login(email, password) {
    if (!email || !password) {
      throw new Error('Please enter your email and password');
    }

    const user = this.getUserByEmail(email);
    if (!user) {
      throw new Error('Incorrect email or password');
    }

    const passwordHash = await this.hashPassword(password);
    if (passwordHash !== user.passwordHash) {
      throw new Error('Incorrect email or password');
    }

    this.createSession(user);
    return user;
  },

  /**
   * Create session for user
   */
  createSession(user) {
    const session = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      loginTime: new Date().toISOString()
    };
    localStorage.setItem(this.KEYS.SESSION, JSON.stringify(session));
    window.dispatchEvent(new CustomEvent('auth_state_changed'));
  },

  /**
   * Logout - clear session
   */
  logout() {
    localStorage.removeItem(this.KEYS.SESSION);
    window.dispatchEvent(new CustomEvent('auth_state_changed'));
    window.location.href = 'login.html';
  },

  /**
   * Get current logged in user
   */
  getCurrentUser() {
    const session = this.getSession();
    if (!session) return null;

    // For demo users, return session directly
    if (session.isDemo || session.userId === 'demo') {
      return {
        id: 'demo',
        name: session.name,
        email: session.email,
        role: session.role,
        avatar: session.avatar,
        isDemo: true
      };
    }

    const user = this.getUserById(session.userId);
    if (!user) return null;

    return {
      ...user,
      avatar: session.avatar || user.avatar
    };
  },

  /**
   * Get current session
   */
  getSession() {
    const session = localStorage.getItem(this.KEYS.SESSION);
    return session ? JSON.parse(session) : null;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return this.getCurrentUser() !== null;
  },

  /**
   * Start a session for the public demo
   */
  startDemo() {
    this.createSession({
      id: 'demo',
      email: 'demo@flowcrm.vn',
      name: 'Demo User',
      role: this.ROLES.ADMIN,
      avatar: 'DM'
    });
  },

  /**
   * Check if current user has a specific permission
   */
  hasPermission(permission) {
    const user = this.getCurrentUser();
    if (!user) return false;

    const permissions = {
      admin: [this.PERMISSIONS.VIEW_REPORTS, this.PERMISSIONS.MANAGE_USERS, this.PERMISSIONS.SYSTEM_SETTINGS],
      manager: [this.PERMISSIONS.VIEW_REPORTS],
      sales: []
    };

    return permissions[user.role]?.includes(permission) || false;
  },

  /**
   * Check if current user is admin
   */
  isAdmin() {
    const user = this.getCurrentUser();
    return user?.role === this.ROLES.ADMIN;
  },

  /**
   * Update user profile
   */
  updateProfile(userId, updates) {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) {
      throw new Error('User not found');
    }

    if (updates.name) {
      users[index].name = updates.name.trim();
      users[index].avatar = this.getInitials(updates.name);

      // Update session
      const session = this.getSession();
      if (session) {
        session.name = users[index].name;
        session.avatar = users[index].avatar;
        localStorage.setItem(this.KEYS.SESSION, JSON.stringify(session));
      }
    }

    this.saveUsers(users);
    window.dispatchEvent(new CustomEvent('auth_state_changed'));
    return users[index];
  },

  /**
   * Change password
   */
  async changePassword(userId, currentPassword, newPassword) {
    if (!currentPassword || !newPassword) {
      throw new Error('Please fill in all fields');
    }

    if (newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters');
    }

    const users = this.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) {
      throw new Error('User not found');
    }

    const currentHash = await this.hashPassword(currentPassword);
    if (currentHash !== users[index].passwordHash) {
      throw new Error('Current password is incorrect');
    }

    users[index].passwordHash = await this.hashPassword(newPassword);
    this.saveUsers(users);
    return true;
  },

  /**
   * Add new user (admin only)
   */
  async addUser(name, email, password, role) {
    if (!name || !email || !password) {
      throw new Error('Please fill in all fields');
    }

    if (!this.isAdmin()) {
      throw new Error('Only admins can add users');
    }

    if (this.emailExists(email)) {
      throw new Error('This email is already in use');
    }

    const users = this.getUsers();
    const user = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash: await this.hashPassword(password),
      role: role || this.ROLES.SALES,
      avatar: this.getInitials(name),
      createdAt: new Date().toISOString()
    };

    users.push(user);
    this.saveUsers(users);
    return user;
  },

  /**
   * Update user (admin only)
   */
  updateUser(userId, updates) {
    if (!this.isAdmin()) {
      throw new Error('Only admins can edit users');
    }

    const users = this.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) {
      throw new Error('User not found');
    }

    if (updates.name) {
      users[index].name = updates.name.trim();
      users[index].avatar = this.getInitials(updates.name);
    }

    if (updates.role) {
      users[index].role = updates.role;
    }

    if (updates.password) {
      // Note: This should be called separately with password change
    }

    this.saveUsers(users);
    return users[index];
  },

  /**
   * Delete user (admin only)
   */
  deleteUser(userId) {
    if (!this.isAdmin()) {
      throw new Error('Only admins can delete users');
    }

    const currentUser = this.getCurrentUser();
    if (currentUser?.id === userId) {
      throw new Error('You cannot delete your own account');
    }

    const users = this.getUsers();
    const filtered = users.filter(u => u.id !== userId);
    this.saveUsers(filtered);
    return true;
  }
};

// Open demo pages directly while keeping the account pages available by their own URLs.
const currentAuthPage = window.location.pathname.split('/').pop();
if (currentAuthPage !== 'login.html' && currentAuthPage !== 'register.html' && !Auth.isAuthenticated()) {
  Auth.startDemo();
}
