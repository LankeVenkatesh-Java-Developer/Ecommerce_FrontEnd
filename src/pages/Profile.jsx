import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../store/slices/authSlice';
import { userService } from '../services/userService';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaMapMarkerAlt } from 'react-icons/fa';
import { ADDRESS_TYPES } from '../utils/constants';
import './Profile.css';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
  });
  const [addressForm, setAddressForm] = useState({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    addressType: 'HOME',
    isDefault: false,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        mobileNumber: user.mobileNumber || '',
      });
      fetchAddresses();
    }
  }, [user]);

  const fetchAddresses = async () => {
    if (!user) return;
    setLoadingAddresses(true);
    try {
      const data = await userService.getAddresses(user.id);
      setAddresses(data);
    } catch (err) {
      console.error('Failed to fetch addresses:', err);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');

    try {
      const updatedUser = await userService.updateUser(user.id, formData);
      dispatch(updateUser(updatedUser));
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update profile';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      mobileNumber: user.mobileNumber || '',
    });
    setIsEditing(false);
    setError('');
  };

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm({
      ...addressForm,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setAddressForm({
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
      addressType: 'HOME',
      isDefault: false,
    });
    setShowAddressModal(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setAddressForm({
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      city: address.city,
      state: address.state,
      country: address.country,
      postalCode: address.postalCode,
      addressType: address.addressType || 'HOME',
      isDefault: address.isDefault || false,
    });
    setShowAddressModal(true);
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;

    try {
      await userService.deleteAddress(user.id, addressId);
      toast.success('Address deleted successfully');
      fetchAddresses();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete address';
      toast.error(errorMessage);
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingAddress) {
        await userService.updateAddress(user.id, editingAddress.id, addressForm);
        toast.success('Address updated successfully');
      } else {
        await userService.addAddress(user.id, addressForm);
        toast.success('Address added successfully');
      }
      setShowAddressModal(false);
      fetchAddresses();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to save address';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <Loading />;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <p>Manage your account information and addresses</p>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

      <div className="profile-card">
        <div className="profile-avatar">
          <div className="avatar-circle">
            {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
          </div>
        </div>

        <div className="profile-form">
          <div className="form-group">
            <label>First Name</label>
            {isEditing ? (
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={loading}
              />
            ) : (
              <span>{user.firstName || '-'}</span>
            )}
          </div>

          <div className="form-group">
            <label>Last Name</label>
            {isEditing ? (
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={loading}
              />
            ) : (
              <span>{user.lastName || '-'}</span>
            )}
          </div>

          <div className="form-group">
            <label>Email</label>
            <span className="readonly-field">{user.email || '-'}</span>
          </div>

          <div className="form-group">
            <label>Mobile Number</label>
            {isEditing ? (
              <input
                type="tel"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                disabled={loading}
              />
            ) : (
              <span>{user.mobileNumber || '-'}</span>
            )}
          </div>

          <div className="form-group">
            <label>Status</label>
            <span className={`status-badge ${user.status?.toLowerCase()}`}>
              {user.status || 'ACTIVE'}
            </span>
          </div>

          <div className="profile-actions">
            {isEditing ? (
              <>
                <button
                  className="btn btn-secondary"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? <Loading size="small" /> : 'Save Changes'}
                </button>
              </>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="addresses-section">
        <div className="section-header">
          <h2>My Addresses</h2>
          <button className="btn btn-primary" onClick={handleAddAddress}>
            <FaPlus />
            <span>Add Address</span>
          </button>
        </div>

        {loadingAddresses ? (
          <Loading />
        ) : addresses.length === 0 ? (
          <div className="empty-state">
            <FaMapMarkerAlt />
            <p>No addresses added yet</p>
          </div>
        ) : (
          <div className="addresses-grid">
            {addresses.map((address) => (
              <div key={address.id} className="address-card">
                {address.isDefault && <span className="default-badge">Default</span>}
                <div className="address-type">{address.addressType}</div>
                <div className="address-details">
                  <p>{address.addressLine1}</p>
                  {address.addressLine2 && <p>{address.addressLine2}</p>}
                  <p>{address.city}, {address.state}</p>
                  <p>{address.country} - {address.postalCode}</p>
                </div>
                <div className="address-actions">
                  <button
                    className="btn-icon"
                    onClick={() => handleEditAddress(address)}
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn-icon btn-icon-danger"
                    onClick={() => handleDeleteAddress(address.id)}
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddressModal && (
        <div className="modal-overlay" onClick={() => setShowAddressModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
              <button className="modal-close" onClick={() => setShowAddressModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleSaveAddress} className="address-form">
              <div className="form-group">
                <label>Address Line 1 *</label>
                <input
                  type="text"
                  name="addressLine1"
                  value={addressForm.addressLine1}
                  onChange={handleAddressChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label>Address Line 2</label>
                <input
                  type="text"
                  name="addressLine2"
                  value={addressForm.addressLine2}
                  onChange={handleAddressChange}
                  disabled={loading}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={addressForm.city}
                    onChange={handleAddressChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label>State *</label>
                  <input
                    type="text"
                    name="state"
                    value={addressForm.state}
                    onChange={handleAddressChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Country *</label>
                  <input
                    type="text"
                    name="country"
                    value={addressForm.country}
                    onChange={handleAddressChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label>Postal Code *</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={addressForm.postalCode}
                    onChange={handleAddressChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Address Type</label>
                <select
                  name="addressType"
                  value={addressForm.addressType}
                  onChange={handleAddressChange}
                  disabled={loading}
                >
                  <option value="HOME">Home</option>
                  <option value="WORK">Work</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={addressForm.isDefault}
                    onChange={handleAddressChange}
                    disabled={loading}
                  />
                  <span>Set as default address</span>
                </label>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddressModal(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? <Loading size="small" /> : editingAddress ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
