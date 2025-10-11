import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Plus } from "lucide-react";
import { toast } from "react-toastify";

const AddressModal = ({
  open,
  onOpenChange,
  onSave,
  editingAddress = null,
  addresses = [],
  // addAddress,
  updateAddress,
  deleteAddress,
  refetch,
  refetchDefault,
}) => {
  const { register, handleSubmit, reset } = useForm({ defaultValues: editingAddress || {} });

  useEffect(() => {
    reset(editingAddress || {});
  }, [editingAddress, reset]);

  const handleFormSubmit = (data) => onSave(data);

  const handleSetDefault = async (addr) => {
    try {
      await updateAddress.mutateAsync({ id: addr._id, updatedData: { default: true } });
      toast.success("Default address updated!");
      refetch();
      refetchDefault();
    } catch (err) {
      console.error(err);
      toast.error("Failed to set default");
    }
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
      <DialogContent className="max-w-md rounded-2xl border border-border/60 bg-card shadow-2xl backdrop-blur-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-5 h-5 text-primary" />
            <DialogTitle className="text-lg font-semibold">Delivery Address</DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Saved addresses and add/edit below</p>
        </DialogHeader>

        {/* Saved Addresses */}
        {addresses.length > 0 && (
          <div className="space-y-2 mb-4 max-h-52 overflow-y-auto">
            {addresses.map((addr) => (
              <div
                key={addr._id}
                className={`border p-3 rounded-lg cursor-pointer flex justify-between items-start ${
                  addr.default ? "border-primary bg-primary/10" : "border-border"
                }`}
              >
                <div onClick={() => handleSetDefault(addr)} className="flex-1">
                  <p><span className="font-semibold">{addr.fullName}</span> ({addr.type})</p>
                  <p>{addr.phone}</p>
                  {addr.altPhone && <p>Alt: {addr.altPhone}</p>}
                  <p>{addr.street}, {addr.city}, {addr.postal}</p>
                  {addr.landmark && <p>Landmark: {addr.landmark}</p>}
                  {addr.instructions && <p>Note: {addr.instructions}</p>}
                  {addr.default && <p className="text-green-600 font-medium">Default</p>}
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    className="text-sm text-blue-600"
                    onClick={() => reset(addr)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-sm text-red-500"
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
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <input {...register("fullName", { required: true })} placeholder="Full Name" className="input-field" />
            <input {...register("phone", { required: true })} placeholder="Phone" className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input {...register("altPhone")} placeholder="Alt Phone" className="input-field" />
            <select {...register("type", { required: true })} className="input-field">
              <option value="">Type</option>
              <option value="home">Home</option>
              <option value="office">Office</option>
              <option value="other">Other</option>
            </select>
          </div>
          <input {...register("street", { required: true })} placeholder="Street Address" className="input-field" />
          <div className="grid grid-cols-2 gap-2">
            <input {...register("city", { required: true })} placeholder="City / District" className="input-field" />
            <input {...register("postal", { required: true })} placeholder="Postal Code" className="input-field" />
          </div>
          <input {...register("landmark")} placeholder="Landmark" className="input-field" />
          <textarea {...register("instructions")} placeholder="Delivery Instructions" rows={2} className="input-field resize-none" />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" {...register("default")} className="accent-primary w-4 h-4" />
              Set as default
            </label>
            <button type="submit" className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" /> Save
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddressModal;
