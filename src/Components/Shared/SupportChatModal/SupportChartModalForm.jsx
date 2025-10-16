import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Button } from "@/Components/ui/button";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue} from "@/Components/ui/select";
import { Send, AlertCircle, User, Mail, Phone } from "lucide-react";

const SupportChartModalForm = ({handleSubmit, handleInputChange, formData, errors, categories, onClose,loading}) => {
    return (
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-700 font-medium flex items-center gap-2">
              <User className="w-4 h-4" />
              Full Name *
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              readOnly
              className={`${
                errors.name ? "border-red-500 focus:ring-red-500" : ""
              } transition-all`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Email and Phone Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-medium flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                readOnly
                className={`${
                  errors.email ? "border-red-500 focus:ring-red-500" : ""
                } transition-all`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-slate-700 font-medium flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone (Optional)
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+880 1234-567890"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-slate-700 font-medium">
              Category *
            </Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
              <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.category}
              </p>
            )}
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-slate-700 font-medium">
              Subject *
            </Label>
            <Input
              id="subject"
              type="text"
              placeholder="Brief summary of your issue"
              value={formData.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
              className={errors.subject ? "border-red-500 focus:ring-red-500" : ""}
            />
            {errors.subject && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.subject}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-700 font-medium">
              Describe Your Issue *
            </Label>
            <Textarea
              id="description"
              placeholder="Please provide detailed information about your issue..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
              className={`${
                errors.description ? "border-red-500 focus:ring-red-500" : ""
              } resize-none transition-all`}
            />
            <div className="flex justify-between items-center">
              {errors.description ? (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.description}
                </p>
              ) : (
                <p className="text-slate-500 text-sm">
                  {formData.description.length} characters
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 cursor-pointer"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 cursor-pointer"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Start Chat
                </span>
              )}
            </Button>
          </div>
        </form>
    );
};

export default SupportChartModalForm;