import React from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin } from "lucide-react";

const AddressModal = ({ open, onOpenChange, onSave, defaultValues }) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: defaultValues || {},
  });

  const handleFormSubmit = data => {
    onSave(data);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl border border-border/60 bg-card shadow-2xl backdrop-blur-md transition-all duration-300">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-5 h-5 text-primary" />
            <DialogTitle className="text-lg font-semibold">
              Set Delivery Address
            </DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Please provide your accurate delivery details below.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 pt-3">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              {...register("fullName", { required: true })}
              className="w-full border border-border/70 rounded-lg px-3 py-2 text-sm bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/50 outline-none transition"
            />
            <input
              type="text"
              placeholder="Phone Number"
              {...register("phone", { required: true })}
              className="w-full border border-border/70 rounded-lg px-3 py-2 text-sm bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/50 outline-none transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Alternate Phone (optional)"
              {...register("altPhone")}
              className="w-full border border-border/70 rounded-lg px-3 py-2 text-sm bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/50 outline-none transition"
            />
            <select
              {...register("type", { required: true })}
              className="w-full border border-border/70 rounded-lg px-3 py-2 text-sm bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/50 outline-none transition"
            >
              <option value="">Address Type</option>
              <option value="home">Home</option>
              <option value="office">Office</option>
              <option value="other">Other</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="Street Address (House, Road, etc.)"
            {...register("street", { required: true })}
            className="w-full border border-border/70 rounded-lg px-3 py-2 text-sm bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/50 outline-none transition"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="City / District"
              {...register("city", { required: true })}
              className="w-full border border-border/70 rounded-lg px-3 py-2 text-sm bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/50 outline-none transition"
            />
            <input
              type="text"
              placeholder="Postal Code"
              {...register("postal", { required: true })}
              className="w-full border border-border/70 rounded-lg px-3 py-2 text-sm bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/50 outline-none transition"
            />
          </div>

          <input
            type="text"
            placeholder="Landmark (e.g., Near City Mall)"
            {...register("landmark")}
            className="w-full border border-border/70 rounded-lg px-3 py-2 text-sm bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/50 outline-none transition"
          />

          <textarea
            placeholder="Delivery Instructions (optional)"
            rows="2"
            {...register("instructions")}
            className="w-full border border-border/70 rounded-lg px-3 py-2 text-sm bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/50 outline-none transition resize-none"
          ></textarea>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                {...register("default")}
                className="accent-primary w-4 h-4"
              />
              Set as Default Address
            </label>
            <button
              type="submit"
              className="px-5 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 font-medium transition flex items-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              Save Address
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddressModal;
