import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Skeleton } from "@/Components/ui/skeleton";
import { Badge } from "@/Components/ui/badge";
import { Pencil, Save, X, Upload, Mail, Phone, User, Calendar, Shield } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import useAxiosSecure from "@/utils/useAxiosSecure";
import useAuth from "@/hooks/useAuth";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const Profile = () => {
  const axiosSecure = useAxiosSecure();
  const { user: authUser, updateUser: updateAuthProfile, setUser: setAuthUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const userEmail = useMemo(() => authUser?.email || "", [authUser]);
  const DEFAULT_AVATAR_URL = "https://ui-avatars.com/api/?name=User&background=random";

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  const getMemberSince = (date) => {
    if (!date) return 'New Member';
    try {
      const joinDate = new Date(date);
      const now = new Date();
      const years = now.getFullYear() - joinDate.getFullYear();
      const months = now.getMonth() - joinDate.getMonth();
      
      if (years > 0) {
        return `${years} year${years > 1 ? 's' : ''} member`;
      } else if (months > 0) {
        return `${months} month${months > 1 ? 's' : ''} member`;
      }
      return 'New Member';
    } catch {
      return 'Member';
    }
  };

  // Guard: show message if not logged in
  if (!authUser) {
    return (
      <Card className="w-full max-w-full mx-auto p-6 text-center space-y-4">
        <CardHeader>
          <h2 className="text-xl font-semibold">Access Restricted</h2>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Please log in to view your profile.</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <a href="/auth/login">Go to Login</a>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Fetch real user profile
  useEffect(() => {
    let isMounted = true;
    async function fetchProfile() {
      if (!userEmail) return;
      setLoading(true);
      try {
        const { data } = await axiosSecure.get(`/users/${encodeURIComponent(userEmail)}`);
        if (!isMounted) return;
        const profile = {
          id: data?._id || data?.id,
          name: data?.name || data?.displayName || "",
          email: data?.email || userEmail,
          phone: data?.phone || data?.phoneNumber || "",
          avatar: data?.avatar || data?.photoURL || DEFAULT_AVATAR_URL,
          role: data?.role || "user",
          createdAt: data?.created_at || data?.createdAt || null,
        };
        setUser(profile);
        setFormData(profile);
      } catch (err) {
        if (!isMounted) return;
        toast.error(err?.response?.data?.message || "Failed to load profile");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, [axiosSecure, userEmail]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEditToggle = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setFormData(user);
    setEditing(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const previewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, avatar: previewUrl }));
  };

  const handleSave = async () => {
    try {
      if (!userEmail) return;
      const isMultipart = Boolean(avatarFile);
      let payload;
      let headers;
      if (isMultipart) {
        const fd = new FormData();
        fd.append("name", formData.name || "");
        fd.append("phone", formData.phone || "");
        fd.append("avatar", avatarFile);
        payload = fd;
        headers = { "Content-Type": "multipart/form-data" };
      } else {
        payload = { name: formData.name || "", phone: formData.phone || "" };
        headers = { "Content-Type": "application/json" };
      }

      const { data } = await axiosSecure.patch(
        `/users/${encodeURIComponent(userEmail)}`,
        payload,
        { headers }
      );

      const updated = {
        id: data?._id || user?.id,
        name: data?.name ?? formData.name,
        email: data?.email ?? formData.email,
        phone: data?.phone ?? formData.phone,
        avatar: data?.avatar || data?.photoURL || formData.avatar || DEFAULT_AVATAR_URL,
      };
      setUser(updated);
      setFormData(updated);
      // Update Firebase auth profile (photo & name) so Navbar reflects immediately
      try {
        await updateAuthProfile({ displayName: updated.name || authUser?.displayName, photoURL: updated.avatar });
      } catch (_) {
        // no-op; proceed to optimistic state update
      }
      // Optimistically update global auth state for immediate UI refresh
      if (setAuthUser) {
        setAuthUser((prev) => ({ ...prev, displayName: updated.name || prev?.displayName, photoURL: updated.avatar }));
      }
      setEditing(false);
      setAvatarFile(null);
      toast.success("Profile updated");
    } catch (err) {
      const status = err?.response?.status;
      if (status === 404 || status === 405) {
        toast.error("Update endpoint not available. Please add PATCH /api/users/:email to update name, phone, and avatar.");
      } else {
        toast.error(err?.response?.data?.message || "Failed to update profile");
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-6 space-y-6">
          <div className="flex flex-col items-center">
            <Skeleton className="h-32 w-32 rounded-full mb-4" />
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="overflow-hidden">
        {/* Header with gradient background */}
        <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-background" />
        
        <CardHeader className="relative pb-0 -mt-16">
          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="relative group mb-4">
              <img
                src={formData.avatar || user.avatar}
                alt="User Avatar"
                className="rounded-full w-32 h-32 object-cover border-4 border-card shadow-xl"
              />
              {editing && (
                <label className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 transition-all shadow-lg">
                  <Upload className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Name & Role */}
            <h2 className="text-2xl font-bold mb-1">{user.name || "User"}</h2>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary" className="capitalize">
                <Shield className="w-3 h-3 mr-1" />
                {user.role || "User"}
              </Badge>
              <Badge variant="outline">
                {getMemberSince(user.createdAt)}
              </Badge>
            </div>
            {user.createdAt && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Member since {formatDate(user.createdAt)}
              </p>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              Full Name
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!editing}
              className="disabled:opacity-70"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled
              className="disabled:opacity-70 bg-muted"
            />
            <p className="text-xs text-muted-foreground">Email cannot be changed</p>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              Phone Number
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              disabled={!editing}
              placeholder="+1 (555) 000-0000"
              className="disabled:opacity-70"
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-center gap-3 bg-muted/30 py-4">
          {editing ? (
            <>
              <Button onClick={handleSave} className="gap-2">
                <Save className="w-4 h-4" /> Save Changes
              </Button>
              <Button variant="outline" onClick={handleCancel} className="gap-2">
                <X className="w-4 h-4" /> Cancel
              </Button>
            </>
          ) : (
            <Button onClick={handleEditToggle} className="gap-2">
              <Pencil className="w-4 h-4" /> Edit Profile
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default Profile;
