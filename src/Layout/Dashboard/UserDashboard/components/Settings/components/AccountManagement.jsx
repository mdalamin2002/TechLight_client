import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/Components/ui/alert-dialog";
import { Trash, AlertTriangle, Pause } from "lucide-react";
import { toast } from "react-toastify";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { deleteUser } from "firebase/auth";
import { auth } from "@/firebase/firebase.init";
import useAxiosSecure from "@/utils/useAxiosSecure";

const AccountManagement = () => {
  const { user, logOutUser } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeactivateAccount = async () => {
    try {
      // TODO: Implement account deactivation API when backend is ready
      // await axiosSecure.patch(`/users/${user?.email}/deactivate`);
      
      toast.info("Account deactivation feature coming soon!");
      // After implementation, log out user
      // await logOutUser(auth);
      // navigate("/");
    } catch (error) {
      console.error("Deactivation error:", error);
      toast.error("Failed to deactivate account");
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE") {
      toast.error('Please type "DELETE" to confirm');
      return;
    }

    setIsDeleting(true);

    try {
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        toast.error("No authenticated user found");
        return;
      }

      // 1. Delete user data from backend
      try {
        await axiosSecure.delete(`/users/${encodeURIComponent(user?.email)}`);
      } catch (err) {
        console.error("Backend deletion error:", err);
        // Continue even if backend deletion fails
      }

      // 2. Delete Firebase Auth user
      await deleteUser(currentUser);

      toast.success("Account deleted successfully");
      
      // 3. Redirect to home
      navigate("/");
    } catch (error) {
      console.error("Account deletion error:", error);
      
      if (error.code === "auth/requires-recent-login") {
        toast.error("For security, please log out and log in again before deleting your account");
      } else {
        toast.error(error.message || "Failed to delete account. Please try again or contact support.");
      }
    } finally {
      setIsDeleting(false);
      setDeleteConfirmation("");
    }
  };

  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="w-5 h-5" />
          Account Management
        </CardTitle>
        <CardDescription>
          Manage your account status or permanently delete your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Deactivate Account */}
        <div className="p-4 border border-primary/50 bg-primary/10 rounded-lg">
          <div className="flex items-start gap-3 mb-4">
            <Pause className="w-5 h-5 text-primary dark:text-primary mt-0.5" />
            <div>
              <h3 className="font-semibold text-primary dark:text-primary">
                Deactivate Account
              </h3>
              <p className="text-sm text-primary dark:text-primary mt-1">
                Temporarily disable your account. You can reactivate it anytime by logging back in. 
                Your data will be preserved.
              </p>
            </div>
          </div>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary-foreground dark:text-primary dark:hover:bg-primary-foreground">
                <Pause className="w-4 h-4 mr-2" />
                Deactivate Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Deactivate Your Account?</AlertDialogTitle>
                <AlertDialogDescription>
                  Your account will be temporarily disabled. You can reactivate it by logging in again.
                  All your data, orders, and preferences will remain intact.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeactivateAccount}>
                  Deactivate
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Delete Account */}
        <div className="p-4 border border-destructive bg-destructive/10 rounded-lg">
          <div className="flex items-start gap-3 mb-4">
            <Trash className="w-5 h-5 text-destructive mt-0.5" />
            <div>
              <h3 className="font-semibold text-destructive">Delete Account Permanently</h3>
              <p className="text-sm text-destructive/90 mt-1">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="delete-confirmation" className="text-sm">
                Type <span className="font-mono font-bold">DELETE</span> to confirm
              </Label>
              <Input
                id="delete-confirmation"
                type="text"
                placeholder="DELETE"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                className="mt-1"
              />
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  disabled={deleteConfirmation !== "DELETE" || isDeleting}
                >
                  <Trash className="w-4 h-4 mr-2" />
                  {isDeleting ? "Deleting..." : "Delete My Account"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-destructive">
                    Are you absolutely sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="space-y-2">
                    <p className="font-semibold">This will permanently delete:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Your account and profile</li>
                      <li>All order history</li>
                      <li>Saved addresses and payment methods</li>
                      <li>Wishlists and cart items</li>
                      <li>All preferences and settings</li>
                    </ul>
                    <p className="font-semibold text-destructive mt-3">
                      This action cannot be undone!
                    </p>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Yes, Delete Forever
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="mt-4 p-3 bg-muted rounded text-xs text-muted-foreground">
            <strong>Note:</strong> For security reasons, you may need to re-authenticate before deleting your account.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountManagement;
