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
  Key,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  UserCog,
  UserX,
} from "lucide-react";

interface ActionsTabProps {
  userData: {
    status: string;
    role: string;
    verified: boolean;
  };
}

export function ActionsTab({ userData }: ActionsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Administrative Actions</CardTitle>
        <CardDescription>
          Manage this user's account and permissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Account Management</h3>
              <p className="text-sm text-muted-foreground">
                Actions that affect the user's account status
              </p>
            </div>
            <div className="grid gap-2">
              <Button variant="outline" className="justify-start">
                <ShieldAlert className="mr-2 h-4 w-4 text-amber-500" />
                {userData.status === "Active"
                  ? "Suspend User"
                  : "Activate User"}
              </Button>
              <Button variant="outline" className="justify-start">
                <UserX className="mr-2 h-4 w-4 text-red-500" />
                Delete User
              </Button>
              <Button variant="outline" className="justify-start">
                <Key className="mr-2 h-4 w-4 text-blue-500" />
                Reset Password
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Role Management</h3>
              <p className="text-sm text-muted-foreground">
                Actions that affect the user's permissions
              </p>
            </div>
            <div className="grid gap-2">
              <Button variant="outline" className="justify-start">
                <UserCog className="mr-2 h-4 w-4 text-violet-500" />
                {userData.role === "User"
                  ? "Promote to Moderator"
                  : "Demote to User"}
              </Button>
              <Button variant="outline" className="justify-start">
                <ShieldCheck className="mr-2 h-4 w-4 text-green-500" />
                {userData.verified ? "Remove Verification" : "Verify User"}
              </Button>
              <Button variant="outline" className="justify-start">
                <ExternalLink className="mr-2 h-4 w-4" />
                View on Blockchain Explorer
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <div className="space-y-2">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              Danger Zone
            </h3>
            <p className="text-sm text-muted-foreground">
              These actions are irreversible and should be used with caution
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="destructive" className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Permanently Delete Account
            </Button>
            <Button variant="destructive" className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Ban User & IP
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
