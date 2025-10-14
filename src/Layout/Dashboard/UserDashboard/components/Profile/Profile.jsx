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
import { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Simulate API fetch
  useEffect(() => {
    setTimeout(() => {
      const fetchedUser = {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        phone: "+8801XXXXXXXXX",
        avatar: "https://i.pravatar.cc/150?img=3",
      };
      setUser(fetchedUser);
      setFormData(fetchedUser);
      setLoading(false);
    }, 1000);
  }, []);

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

  const handleSave = () => {
    // Simulate save (normally send to backend)
    setUser(formData);
    setEditing(false);
    console.log("Saved user:", formData);
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
          src={user.avatar}
          alt="User Avatar"
          className="rounded-full w-20 h-20 object-cover"
        />
      </CardHeader>

      <CardContent className="space-y-4">
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
            disabled={!editing}
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
