export const ROLES = ['admin', 'staff', 'customer'];

export const ROLE_LABELS = {
  admin: 'Administrator',
  staff: 'Staff',
  customer: 'Pelanggan',
};

export const isManagementRole = (role) => role === 'admin' || role === 'staff';

export const isAdminRole = (role) => role === 'admin';

export const getRoleLabel = (role) => ROLE_LABELS[role] || role || 'Tidak diketahui';

