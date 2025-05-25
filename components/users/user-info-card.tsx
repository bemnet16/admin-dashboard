"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, ShieldCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type UserData = {
  id: string;
  fullName: string;
  email: string;
  walletAddress: string;
  role: string;
  status: string;
  verified: boolean;
  joinDate: string;
  avatarUrl: string;
  tokenBalance: number;
};

interface UserInfoCardProps {
  user: UserData;
}

export function UserInfoCard({ user }: UserInfoCardProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The text has been copied to your clipboard.",
    });
  };

  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  return (
    <Card className="mb-6 overflow-hidden">
      <div className="bg-gradient-to-r from-violet-500/20 to-purple-900 h-20" />
      <CardContent className="pt-0">
        <div className="flex flex-col md:flex-row gap-6 -mt-8">
          <Avatar className="h-24 w-24 border-4 border-background">
            <AvatarImage
              src={user.avatarUrl || "/placeholder.svg"}
              alt={user.fullName}
            />
            <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <h2 className="text-2xl font-bold">{user.fullName}</h2>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={
                    user.status === "Active"
                      ? "success"
                      : user.status === "Suspended"
                      ? "warning"
                      : "destructive"
                  }
                >
                  {user.status}
                </Badge>
                {user.verified && (
                  <Badge variant="outline" className="flex items-center gap-1 ">
                    <ShieldCheck className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Email
                </p>
                <p>{user.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Role
                </p>
                <p>{user.role}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Member Since
                </p>
                <p>{user.joinDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Wallet Address
                </p>
                <div className="flex items-center gap-2">
                  <code className="text-xs sm:text-sm font-mono bg-muted px-2 py-1 rounded">
                    {truncateAddress(user.walletAddress)}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => copyToClipboard(user.walletAddress)}
                  >
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy wallet address</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
