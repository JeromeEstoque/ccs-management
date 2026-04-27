import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';
import { Search, Lock, Unlock, UserPlus, Shield, User, Users, Loader2, Plus } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ role: '', status: '', search: '' });
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    username: '', email: '', password: ''
  });

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getUsers(filters);
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await adminAPI.updateUserStatus(id, newStatus);
      toast.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleUnlock = async (id) => {
    try {
      await adminAPI.unlockUser(id);
      toast.success('User account unlocked');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to unlock user');
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminAPI.createAdmin(formData);
      toast.success('Admin account created successfully');
      setShowAddAdminModal(false);
      setFormData({ username: '', email: '', password: '' });
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create admin');
    } finally {
      setSaving(false);
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      student: 'badge-success',
      teacher: 'badge-info',
      admin: 'badge-warning',
    };
    return colors[role] || 'badge-secondary';
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'badge-success' : 'badge-danger';
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-orange-200 mb-1">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Access Control</span>
            </div>
            <h1 className="text-2xl font-bold">User Management</h1>
            <p className="text-orange-100 text-sm mt-1">{users.length} users registered</p>
          </div>
          <button
            onClick={() => setShowAddAdminModal(true)}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors backdrop-blur-sm"
          >
            <Plus className="w-4 h-4" />
            Add Admin
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-panel rounded-xl p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="label">Search Users</label>
            <div>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                placeholder="Search by name or email..."
                className="input-search"
              />
            </div>
          </div>
          <div>
            <label className="label">Role</label>
            <select
              value={filters.role}
              onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
              className="input-field w-auto"
            >
              <option value="">All Roles</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="label">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="input-field w-auto"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <Card title="User Accounts" icon={Users}>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        ) : users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-secondary-800">{user.full_name || user.username}</p>
                          <p className="text-sm text-secondary-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge capitalize ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>
                      <div className="text-secondary-500 text-sm">
                        {user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        {user.locked_until && new Date(user.locked_until) > new Date() && (
                          <button
                            onClick={() => handleUnlock(user.id)}
                            className="p-2 text-orange-500 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Unlock Account"
                          >
                            <Unlock className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleToggleStatus(user.id, user.status)}
                          className={`p-2 rounded-lg transition-colors ${
                            user.status === 'active' 
                              ? 'text-red-500 hover:text-red-700 hover:bg-red-50' 
                              : 'text-green-500 hover:text-green-700 hover:bg-green-50'
                          }`}
                          title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          {user.status === 'active' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state py-16">
            <Users className="w-12 h-12" />
            <p className="text-base font-medium">No users found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </Card>

      {/* Add Admin Modal */}
      <Modal
        isOpen={showAddAdminModal}
        onClose={() => setShowAddAdminModal(false)}
        title="Add New Admin"
        icon={UserPlus}
      >
        <form onSubmit={handleAddAdmin} className="space-y-4">
          <div>
            <label className="label">Username *</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              className="input-search"
              placeholder="Enter username"
              required
            />
          </div>
          <div>
            <label className="label">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="input-search"
              placeholder="Enter email address"
              required
            />
          </div>
          <div>
            <label className="label">Password *</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="input-search"
              placeholder="Enter password (min 6 characters)"
              required
              minLength={6}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setShowAddAdminModal(false)} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? 'Creating...' : 'Create Admin'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserManagement;
