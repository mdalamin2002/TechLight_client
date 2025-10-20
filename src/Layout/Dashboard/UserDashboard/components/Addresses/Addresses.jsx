import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  MapPin,
  Phone,
  User,
  Home,
  Building2,
  CheckCircle,
  X,
} from 'lucide-react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import useAxiosSecure from '@/utils/useAxiosSecure';
import useAuth from '@/hooks/useAuth';

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    label: 'Home',
    fullName: '',
    phone: '',
    altPhone: '',
    street: '',
    city: '',
    postal: '',
    landmark: '',
    instructions: '',
    default: false,
  });

  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  // Fetch addresses from backend
  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const response = await axiosSecure.get('/addresses');
      if (response.data.success) {
        setAddresses(response.data.data || []);
      } else if (Array.isArray(response.data)) {
        setAddresses(response.data);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast.error('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      label: 'Home',
      fullName: '',
      phone: '',
      altPhone: '',
      street: '',
      city: '',
      postal: '',
      landmark: '',
      instructions: '',
      default: false,
    });
    setEditingId(null);
  };

  const handleAddAddress = async () => {
    if (!formData.fullName || !formData.phone || !formData.street || !formData.city) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingId) {
        // Update existing address
        const response = await axiosSecure.put(`/addresses/${editingId}`, formData);
        if (response.data.success) {
          toast.success('Address updated successfully!');
          fetchAddresses();
        }
      } else {
        // Add new address
        const response = await axiosSecure.post('/addresses', formData);
        if (response.data.success) {
          toast.success('Address added successfully!');
          fetchAddresses();
        }
      }
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error(error.response?.data?.message || 'Failed to save address');
    }
  };

  const handleEditAddress = (address) => {
    setFormData({
      label: address.label || 'Home',
      fullName: address.fullName || '',
      phone: address.phone || '',
      altPhone: address.altPhone || '',
      street: address.street || '',
      city: address.city || '',
      postal: address.postal || '',
      landmark: address.landmark || '',
      instructions: address.instructions || '',
      default: address.default || false,
    });
    setEditingId(address._id);
    setShowModal(true);
  };

  const handleDeleteAddress = async (id) => {
    Swal.fire({
      title: 'Delete Address?',
      text: 'Are you sure you want to delete this address?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it',
      customClass: { popup: 'rounded-2xl' },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axiosSecure.delete(`/addresses/${id}`);
          if (response.data.success) {
            toast.success('Address deleted successfully!');
            fetchAddresses();
          }
        } catch (error) {
          console.error('Error deleting address:', error);
          toast.error(error.response?.data?.message || 'Failed to delete address');
        }
      }
    });
  };

  const handleSetDefault = async (id) => {
    try {
      const response = await axiosSecure.patch(`/addresses/${id}/set-default`);
      if (response.data.success) {
        toast.success('Default address updated!');
        fetchAddresses();
      }
    } catch (error) {
      console.error('Error setting default address:', error);
      toast.error(error.response?.data?.message || 'Failed to set default address');
    }
  };

  const getLabelIcon = (label) => {
    switch (label?.toLowerCase()) {
      case 'home':
        return <Home size={20} />;
      case 'office':
        return <Building2 size={20} />;
      default:
        return <MapPin size={20} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="p-3 rounded-lg bg-primary/20">
            <MapPin size={28} className="text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">My Addresses</h1>
            <p className="text-muted-foreground">Manage your delivery addresses</p>
          </div>
        </div>

        {/* Add Button */}
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="mb-6 px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-blue-600 text-white font-semibold hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Plus size={20} /> Add New Address
        </button>

        {/* Address Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div
              key={address._id}
              className={`bg-card border-2 rounded-2xl p-6 transition-all hover:shadow-lg ${
                address.default ? 'border-primary bg-primary/5' : 'border-border/50'
              }`}
            >
              <div className="flex justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${address.default ? 'bg-primary/20' : 'bg-muted/50'}`}>
                    {getLabelIcon(address.label)}
                  </div>
                  <div>
                    <h3 className="font-bold">{address.label || 'Address'}</h3>
                    {address.default && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary mt-1">
                        <CheckCircle size={12} /> Default
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditAddress(address)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors text-primary"
                    title="Edit address"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(address._id)}
                    className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                    title="Delete address"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-3 mb-4 pb-4 border-b border-border/30">
                <div className="flex items-start gap-2">
                  <User size={16} className="text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="font-medium">{address.fullName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone size={16} className="text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-medium">{address.phone}</p>
                    {address.altPhone && <p className="text-sm text-muted-foreground">Alt: {address.altPhone}</p>}
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Address</p>
                    <p className="font-medium">
                      {address.street}, {address.city} {address.postal}
                    </p>
                    {address.landmark && <p className="text-sm text-muted-foreground">Landmark: {address.landmark}</p>}
                  </div>
                </div>
                {address.instructions && (
                  <div className="flex items-start gap-2">
                    <div className="w-4" />
                    <div>
                      <p className="text-xs text-muted-foreground">Instructions</p>
                      <p className="text-sm">{address.instructions}</p>
                    </div>
                  </div>
                )}
              </div>

              {!address.default && (
                <button
                  onClick={() => handleSetDefault(address._id)}
                  className="w-full py-2 text-sm font-semibold text-primary border border-primary/30 rounded-lg hover:bg-primary/10 transition-colors"
                >
                  Set as Default
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary/20 to-blue-50 border-b px-6 py-4 flex justify-between">
                <h2 className="text-2xl font-bold">
                  {editingId ? 'Edit Address' : 'Add New Address'}
                </h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-muted rounded-lg">
                  <X size={24} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto">
                <div>
                  <label className="block text-sm font-semibold mb-2">Label *</label>
                  <select
                    name="label"
                    value={formData.label}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary/50 outline-none"
                  >
                    <option value="Home">Home</option>
                    <option value="Office">Office</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary/50 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+880 1700000000"
                      className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary/50 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Alt Phone</label>
                    <input
                      type="tel"
                      name="altPhone"
                      value={formData.altPhone}
                      onChange={handleInputChange}
                      placeholder="Alternative phone"
                      className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary/50 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Street Address *</label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    placeholder="123 Main Street"
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary/50 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Dhaka"
                      className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary/50 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Postal Code *</label>
                    <input
                      type="text"
                      name="postal"
                      value={formData.postal}
                      onChange={handleInputChange}
                      placeholder="1205"
                      className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary/50 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Landmark</label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    placeholder="Near City Mall"
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary/50 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Delivery Instructions</label>
                  <textarea
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleInputChange}
                    placeholder="e.g., Ring the bell twice"
                    rows={3}
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary/50 outline-none resize-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="default"
                    name="default"
                    checked={formData.default}
                    onChange={(e) => setFormData(prev => ({ ...prev, default: e.target.checked }))}
                    className="w-4 h-4 accent-primary"
                  />
                  <label htmlFor="default" className="text-sm font-medium cursor-pointer">
                    Set as default address
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t px-6 py-4 flex justify-end gap-3 bg-muted/20">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 rounded-lg border font-semibold hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddAddress}
                  className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-primary to-blue-600 text-white font-semibold hover:shadow-lg"
                >
                  {editingId ? 'Update Address' : 'Add Address'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Addresses;
