import React, { useState, useEffect } from 'react';
import { FaSearch, FaUserPlus, FaEdit, FaBan, FaTrash, FaCheck } from 'react-icons/fa';
import adminManagementService from '../../services/adminManagementService';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState('view'); // view, edit, create

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminManagementService.getAllUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.mobileNumber?.includes(searchTerm)
      );
    }

    if (roleFilter !== 'ALL') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleUpdateStatus = async (userId, newStatus) => {
    try {
      await adminManagementService.updateUserStatus(userId, newStatus);
      await fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    if (window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      try {
        await adminManagementService.updateUserRole(userId, newRole);
        await fetchUsers();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await adminManagementService.deleteUser(userId);
        await fetchUsers();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setModalMode('view');
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setModalMode('edit');
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      ACTIVE: 'bg-green-100 text-green-800',
      INACTIVE: 'bg-gray-100 text-gray-800',
      SUSPENDED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getRoleColor = (role) => {
    const colors = {
      CUSTOMER: 'bg-blue-100 text-blue-800',
      ADMIN: 'bg-purple-100 text-purple-800',
      SUPER_ADMIN: 'bg-red-100 text-red-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="admin-users">
      <div className="page-header">
        <h1>User Management</h1>
        <p>Manage system users and their permissions</p>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, email, or mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-box">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="ALL">All Roles</option>
            <option value="CUSTOMER">Customer</option>
            <option value="ADMIN">Admin</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>
        </div>
        <div className="filter-box">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-state">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.firstName} {user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.mobileNumber}</td>
                  <td>
                    <span className={`role-badge ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="actions">
                    <button
                      className="btn-view"
                      onClick={() => handleViewUser(user)}
                      title="View Details"
                    >
                      <FaSearch />
                    </button>
                    <button
                      className="btn-edit"
                      onClick={() => handleEditUser(user)}
                      title="Edit User"
                    >
                      <FaEdit />
                    </button>
                    {user.status === 'ACTIVE' ? (
                      <button
                        className="btn-deactivate"
                        onClick={() => handleUpdateStatus(user.id, 'INACTIVE')}
                        title="Deactivate User"
                      >
                        <FaBan />
                      </button>
                    ) : (
                      <button
                        className="btn-activate"
                        onClick={() => handleUpdateStatus(user.id, 'ACTIVE')}
                        title="Activate User"
                      >
                        <FaCheck />
                      </button>
                    )}
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteUser(user.id)}
                      title="Delete User"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* User Details Modal */}
      {showModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {modalMode === 'view' ? 'User Details' : 
                 modalMode === 'edit' ? 'Edit User' : 'Create User'}
              </h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <FaBan />
              </button>
            </div>
            <div className="modal-body">
              <div className="user-info">
                <div className="info-group">
                  <label>Name:</label>
                  <span>{selectedUser.firstName} {selectedUser.lastName}</span>
                </div>
                <div className="info-group">
                  <label>Email:</label>
                  <span>{selectedUser.email}</span>
                </div>
                <div className="info-group">
                  <label>Mobile:</label>
                  <span>{selectedUser.mobileNumber}</span>
                </div>
                <div className="info-group">
                  <label>Role:</label>
                  <span className={`role-badge ${getRoleColor(selectedUser.role)}`}>
                    {selectedUser.role}
                  </span>
                </div>
                <div className="info-group">
                  <label>Status:</label>
                  <span className={`status-badge ${getStatusColor(selectedUser.status)}`}>
                    {selectedUser.status}
                  </span>
                </div>
                <div className="info-group">
                  <label>Joined:</label>
                  <span>{new Date(selectedUser.createdAt).toLocaleString()}</span>
                </div>
                <div className="info-group">
                  <label>Last Updated:</label>
                  <span>{new Date(selectedUser.updatedAt).toLocaleString()}</span>
                </div>
              </div>

              {modalMode === 'edit' && (
                <div className="edit-actions">
                  <div className="role-change">
                    <label>Change Role:</label>
                    <select
                      defaultValue={selectedUser.role}
                      onChange={(e) => handleUpdateRole(selectedUser.id, e.target.value)}
                    >
                      <option value="CUSTOMER">Customer</option>
                      <option value="ADMIN">Admin</option>
                      <option value="SUPER_ADMIN">Super Admin</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
