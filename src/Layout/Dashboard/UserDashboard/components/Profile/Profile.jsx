import { Button } from "@/Components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Skeleton } from "@/Components/ui/skeleton";
import { Pencil, Save, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import useAxiosSecure from "@/utils/useAxiosSecure";
import useAuth from "@/hooks/useAuth";
import { toast } from "react-toastify";

const Profile = () => {
  const axiosSecure = useAxiosSecure();
  const { user: authUser } = useAuth();
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
      <Card className="w-full max-w-md mx-auto p-6 space-y-4">
        <Skeleton className="h-20 w-20 rounded-full mx-auto" />
        <Skeleton className="h-6 w-32 mx-auto" />
        <Skeleton className="h-4 w-48 mx-auto" />
        <Skeleton className="h-10 w-24 mx-auto mt-4" />
      </Card>
    );
  }

  return (
    <Card className="w-full mx-auto p-6 space-y-6">
      <CardHeader className="flex flex-col items-center text-center space-y-2">
        <img
          src={formData.avatar || user.avatar}
          alt="User Avatar"
          className="rounded-full w-20 h-20 object-cover"
        />
      </CardHeader>

      <CardContent className="space-y-4">
        {editing && (
          <div className="space-y-1">
            <label className="text-sm font-medium">Profile Image</label>
            <Input type="file" accept="image/*" onChange={handleAvatarChange} />
          </div>
        )}
        {/* Name */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Full Name</label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={!editing}
          />
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Email</label>
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled
          />
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Phone</label>
          <Input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={!editing}
          />
        </div>
      </CardContent>

      <CardFooter className="flex justify-center gap-2">
        {editing ? (
          <>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" /> Save
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              <X className="w-4 h-4 mr-2" /> Cancel
            </Button>
          </>
        ) : (
          <Button onClick={handleEditToggle}>
            <Pencil className="w-4 h-4 mr-2" /> Edit Profile
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default Profile;
