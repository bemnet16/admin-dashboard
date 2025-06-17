import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertCircle,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useUpdateUserStatusMutation, useDeleteUserMutation } from "@/store/services/userApi";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
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
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface ActionsTabProps {
  userData: {
    id: string;
    status: 'active' | 'suspended' | 'inactive' | 'pending';
    role: string;
    walletId?: string;
  };
  onStatusChange?: (newStatus: 'active' | 'suspended' | 'inactive' | 'pending') => void;
  onUserDeleted?: () => void;
}

export function ActionsTab({ userData, onStatusChange, onUserDeleted }: ActionsTabProps) {
  const { data: session } = useSession();
  const [updateUserStatus] = useUpdateUserStatusMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(userData.status);

  const handleStatusUpdate = async () => {
    if (!session?.user.accessToken) {
      toast.error("Authentication required");
      return;
    }

    try {
      // If current status is active, we want to suspend
      // If current status is suspended, we want to activate
      const newStatus = currentStatus === "active" ? "suspended" : "active";
      
      await updateUserStatus({ 
        userId: userData.id, 
        status: newStatus,
        token: session.user.accessToken
      }).unwrap();
      
      // Update local state
      setCurrentStatus(newStatus);
      // Notify parent component if callback is provided
      onStatusChange?.(newStatus);
      
      toast.success(`User ${newStatus === "active" ? "activated" : "suspended"} successfully`);
    } catch (error) {
      toast.error("Failed to update user status");
    }
  };

  const handleDeleteUser = async () => {
    if (!session?.user.accessToken) {
      toast.error("Authentication required");
      return;
    }

    try {
      setIsDeleting(true);
      await deleteUser({ 
        userId: userData.id,
        token: session.user.accessToken 
      }).unwrap();
      
      // Notify parent component that user was deleted
      onUserDeleted?.();
      
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error("Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewOnBlockchain = () => {
    if (!userData.walletId) {
      toast.error("No wallet address found for this user");
      return;
    }
    // Open blockchain explorer in new tab
    window.open(`https://sepolia.etherscan.io/address/${userData.walletId}`, '_blank');
  };

  // Only show status toggle button if user is active or suspended
  const canToggleStatus = currentStatus === "active" || currentStatus === "suspended";
  const statusButtonText = currentStatus === "active" ? "Suspend User" : "Activate User";
  const StatusIcon = currentStatus === "active" ? ShieldAlert : ShieldCheck;
  const statusIconColor = currentStatus === "active" ? "text-amber-500" : "text-green-500";

  console.log(userData, "uuu")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Administrative Actions</CardTitle>
        <CardDescription>
          Manage this user's account and permissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-2">
            {canToggleStatus && (
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={handleStatusUpdate}
              >
                <StatusIcon className={`mr-2 h-4 w-4 ${statusIconColor}`} />
                {statusButtonText}
              </Button>
            )}

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="justify-start">
                  <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                  Delete User
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the user
                    and remove their data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteUser}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {userData.walletId && (
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={handleViewOnBlockchain}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View on Blockchain Explorer
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
