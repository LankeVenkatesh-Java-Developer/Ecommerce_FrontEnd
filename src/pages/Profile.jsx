import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../store/slices/authSlice';
import { userService } from '../services/userService';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaMapMarkerAlt } from 'react-icons/fa';
import { ADDRESS_TYPES } from '../utils/constants';

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Profile</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your account information and addresses</p>
        </div>

        {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
            <div className="flex flex-col items-center justify-start gap-6">
              <div className="w-36 h-36 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-4xl font-bold flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-800">
                {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">First Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={loading}
                    className="input-3d"
                  />
                ) : (
                  <span className="text-gray-900 dark:text-white text-lg">{user.firstName || '-'}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Last Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={loading}
                    className="input-3d"
                  />
                ) : (
                  <span className="text-gray-900 dark:text-white text-lg">{user.lastName || '-'}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Email</label>
                <span className="text-gray-500 dark:text-gray-400 text-lg italic">{user.email || '-'}</span>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Mobile Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    disabled={loading}
                    className="input-3d"
                  />
                ) : (
                  <span className="text-gray-900 dark:text-white text-lg">{user.mobileNumber || '-'}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Status</label>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium uppercase ${
                  user.status?.toLowerCase() === 'active' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {user.status || 'ACTIVE'}
                </span>
              </div>

              <div className="flex gap-4 mt-4">
                {isEditing ? (
                  <>
                    <button
                      className="btn-secondary-3d"
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn-primary-3d"
                      onClick={handleSave}
                      disabled={loading}
                    >
                      {loading ? <Loading size="small" /> : 'Save Changes'}
                    </button>
                  </>
                ) : (
                  <button
                    className="btn-primary-3d"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Addresses</h2>
            <button className="btn-primary-3d flex items-center gap-2" onClick={handleAddAddress}>
              <FaPlus />
              <span>Add Address</span>
            </button>
          </div>

          {loadingAddresses ? (
            <Loading />
          ) : addresses.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <FaMapMarkerAlt className="text-4xl mx-auto mb-4" />
              <p>No addresses added yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {addresses.map((address) => (
                <div key={address.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 relative hover:shadow-lg transition-shadow">
                  {address.isDefault && (
                    <span className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                      Default
                    </span>
                  )}
                  <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-3">
                    {address.addressType}
                  </div>
                  <div className="space-y-1 text-gray-600 dark:text-gray-300">
                    <p>{address.addressLine1}</p>
                    {address.addressLine2 && <p>{address.addressLine2}</p>}
                    <p>{address.city}, {address.state}</p>
                    <p>{address.country} - {address.postalCode}</p>
                  </div>
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      onClick={() => handleEditAddress(address)}
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="p-2 bg-gray-100 dark:bg-gray-700 text-red-500 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddressModal(false)}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-700" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
                <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" onClick={() => setShowAddressModal(false)}>
                  ×
                </button>
              </div>
              <form onSubmit={handleSaveAddress} className="p-6 flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Address Line 1 *</label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={addressForm.addressLine1}
                    onChange={handleAddressChange}
                    required
                    disabled={loading}
                    className="input-3d"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Address Line 2</label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={addressForm.addressLine2}
                    onChange={handleAddressChange}
                    disabled={loading}
                    className="input-3d"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={addressForm.city}
                      onChange={handleAddressChange}
                      required
                      disabled={loading}
                      className="input-3d"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">State *</label>
                    <input
                      type="text"
                      name="state"
                      value={addressForm.state}
                      onChange={handleAddressChange}
                      required
                      disabled={loading}
                      className="input-3d"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Country *</label>
                    <input
                      type="text"
                      name="country"
                      value={addressForm.country}
                      onChange={handleAddressChange}
                      required
                      disabled={loading}
                      className="input-3d"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Postal Code *</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={addressForm.postalCode}
                      onChange={handleAddressChange}
                      required
                      disabled={loading}
                      className="input-3d"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Address Type</label>
                  <select
                    name="addressType"
                    value={addressForm.addressType}
                    onChange={handleAddressChange}
                    disabled={loading}
                    className="input-3d"
                  >
                    <option value="HOME">Home</option>
                    <option value="WORK">Work</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={addressForm.isDefault}
                    onChange={handleAddressChange}
                    disabled={loading}
                    className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label className="text-gray-700 dark:text-gray-300 cursor-pointer">Set as default address</label>
                </div>
                <div className="flex gap-4 justify-end mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    className="btn-secondary-3d"
                    onClick={() => setShowAddressModal(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary-3d" disabled={loading}>
                    {loading ? <Loading size="small" /> : editingAddress ? 'Update' : 'Add'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
