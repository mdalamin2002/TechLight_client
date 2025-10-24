import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/Components/ui/dialog";
import { MapPin, Plus } from "lucide-react";
import { toast } from "react-toastify";

const AddressModal = ({
  open,
  onOpenChange,
  onSave,
  editingAddress = null,
  addresses = [],
  updateAddress,
  deleteAddress,
  refetch,
  refetchDefault,
}) => {
  const { register, handleSubmit, reset, setValue } = useForm({ defaultValues: editingAddress || {} });

  useEffect(() => {
    reset(editingAddress || {});
  }, [editingAddress, reset]);

  const handleFormSubmit = (data) => onSave(data);

  const handleSetDefault = async (addr) => {
    try {
      await updateAddress.mutateAsync({ id: addr._id, updatedData: { ...addr, default: true } });
      toast.success("Default address updated!");
      refetch();
      refetchDefault();
    } catch (err) {
      console.error(err);
      toast.error("Failed to set default");
    }
  };

  const handleEditAddress = (addr) => {
    // Populate form with selected address
    Object.keys(addr).forEach(key => {
      setValue(key, addr[key]);
    });
  };

  const handleDelete = async (addrId) => {
    if (!window.confirm("Delete this address?")) return;
    try {
      await deleteAddress.mutateAsync(addrId);
      toast.success("Address deleted!");
      if (editingAddress?._id === addrId) reset();
      refetch();
      refetchDefault();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete address");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-2xl border border-border/60 bg-card shadow-2xl backdrop-blur-md max-h-[85vh] flex flex-col">
        <DialogHeader className="bg-gradient-to-r from-primary/20 to-blue-50 -m-6 px-6 py-4 mb-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              <DialogTitle className="text-xl font-bold">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </DialogTitle>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Manage your saved addresses below</p>
        </DialogHeader>

        {/* Saved Addresses */}
        {addresses.length > 0 && (
          <div className="space-y-2 mb-4 max-h-40 overflow-y-auto px-1 flex-shrink-0">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">Saved Addresses</h3>
            {addresses.map((addr) => (
              <div
                key={addr._id}
                className={`border p-3 rounded-lg cursor-pointer flex justify-between items-start transition-all hover:shadow-md ${
                  addr.default ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                }`}
              >
                <div onClick={() => handleSetDefault(addr)} className="flex-1 cursor-pointer">
                  <p><span className="font-semibold">{addr.fullName}</span> {addr.label && `(${addr.label})`}</p>
                  <p className="text-sm">{addr.phone}</p>
                  {addr.altPhone && <p className="text-sm">Alt: {addr.altPhone}</p>}
                  <p className="text-sm">{addr.street}, {addr.city}, {addr.postal}</p>
                  {addr.landmark && <p className="text-xs text-muted-foreground">Landmark: {addr.landmark}</p>}
                  {addr.default && <p className="text-green-600 font-medium text-sm mt-1">✓ Default</p>}
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:underline"
                    onClick={() => handleEditAddress(addr)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="text-sm text-red-500 hover:underline"
                    onClick={() => handleDelete(addr._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Form */}
        <div className="overflow-y-auto flex-1 pr-2">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Label *</label>
            <select
              {...register("label", { required: true })}
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
              {...register("fullName", { required: true })}
              type="text"
              placeholder="Enter your full name"
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary/50 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Phone Number *</label>
              <input
                {...register("phone", { required: true })}
                type="tel"
                placeholder="+880 1700000000"
                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary/50 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Alt Phone</label>
              <input
                {...register("altPhone")}
                type="tel"
                placeholder="Alternative phone"
                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary/50 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Street Address *</label>
            <input
              {...register("street", { required: true })}
              type="text"
              placeholder="123 Main Street"
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary/50 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">City *</label>
              <input
                {...register("city", { required: true })}
                type="text"
                placeholder="Dhaka"
                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary/50 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Postal Code *</label>
              <input
                {...register("postal", { required: true })}
                type="text"
                placeholder="1205"
                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary/50 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Landmark</label>
            <input
              {...register("landmark")}
              type="text"
              placeholder="Near City Mall"
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary/50 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Delivery Instructions</label>
            <textarea
              {...register("instructions")}
              placeholder="e.g., Ring the bell twice"
              rows={3}
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary/50 outline-none resize-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-primary to-blue-600 text-white font-semibold hover:shadow-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {editingAddress ? 'Update Address' : 'Save Address'}
            </button>
          </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddressModal;
