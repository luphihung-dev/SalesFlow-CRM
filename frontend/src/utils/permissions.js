import { authStorage } from '../api/auth';

export const getCurrentUser = () => authStorage.getUser();
export const getCurrentRole = () => getCurrentUser()?.role;

export const isAdmin = () => getCurrentRole() === 'ADMIN';
export const isManager = () => getCurrentRole() === 'MANAGER';
export const isSales = () => getCurrentRole() === 'SALES';

export const canManageCustomers = () => isAdmin() || isManager() || isSales();
export const canDeleteRecords = () => isAdmin();
export const canDeleteTeamRecords = () => isAdmin() || isManager();
export const canAccessSettings = () => isAdmin();
