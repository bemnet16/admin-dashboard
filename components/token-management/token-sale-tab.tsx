"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, DollarSign, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface TokenSaleTabProps {
  currentPrice: number;
  saleActive: boolean;
}

export function TokenSaleTab({ currentPrice, saleActive }: TokenSaleTabProps) {
  const [price, setPrice] = useState(currentPrice.toString());
  const [isActive, setIsActive] = useState(saleActive);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveChanges = async () => {
    const newPrice = Number.parseFloat(price);

    if (isNaN(newPrice) || newPrice <= 0) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid token price greater than zero.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Settings updated successfully",
        description: `Token sale is now ${
          isActive ? "active" : "inactive"
        } with a price of $${newPrice.toFixed(2)} per STAR.`,
      });
    } catch (error) {
      toast({
        title: "Failed to update settings",
        description:
          "There was an error saving your changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Token Sale Settings</CardTitle>
          <CardDescription>Configure the token sale parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border">
              <div>
                <h3 className="font-medium">Token Sale Status</h3>
                <p className="text-sm text-muted-foreground">
                  Enable or disable the public token sale
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="sale-active"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
                <Label htmlFor="sale-active" className="font-medium">
                  {isActive ? "Active" : "Inactive"}
                </Label>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="token-price">Token Price (USD)</Label>
                <div className="flex">
                  <div className="bg-muted flex items-center px-3 rounded-l-md border border-r-0 border-input">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="token-price"
                    type="number"
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="rounded-l-none"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Set the price for one STAR token in USD
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800 dark:text-amber-300">
                  Important Notice
                </h4>
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  Changing the token price or sale status will affect all users
                  immediately. Make sure you have communicated any changes to
                  your community before updating these settings.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleSaveChanges}
            disabled={isSaving}
            className="ml-auto"
          >
            {isSaving ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Historical Price Card */}
      <Card>
        <CardHeader>
          <CardTitle>Historical Pricing</CardTitle>
          <CardDescription>Previous token price changes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-md divide-y">
              <div className="p-3 flex justify-between items-center">
                <div>
                  <div className="font-medium">$0.05</div>
                  <div className="text-xs text-muted-foreground">
                    Current Price
                  </div>
                </div>
                <div className="text-sm text-right">
                  <div>May 1, 2023</div>
                  <div className="text-xs text-muted-foreground">
                    to Present
                  </div>
                </div>
              </div>
              <div className="p-3 flex justify-between items-center">
                <div>
                  <div className="font-medium">$0.04</div>
                  <div className="text-xs text-muted-foreground">
                    Previous Price
                  </div>
                </div>
                <div className="text-sm text-right">
                  <div>Feb 15, 2023</div>
                  <div className="text-xs text-muted-foreground">
                    to Apr 30, 2023
                  </div>
                </div>
              </div>
              <div className="p-3 flex justify-between items-center">
                <div>
                  <div className="font-medium">$0.03</div>
                  <div className="text-xs text-muted-foreground">
                    Initial Price
                  </div>
                </div>
                <div className="text-sm text-right">
                  <div>Jan 1, 2023</div>
                  <div className="text-xs text-muted-foreground">
                    to Feb 14, 2023
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sale Statistics Card */}
      <Card>
        <CardHeader>
          <CardTitle>Sale Statistics</CardTitle>
          <CardDescription>Token sale performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 border rounded-md">
                <div className="text-2xl font-bold">2,450</div>
                <div className="text-sm text-muted-foreground">Total Sales</div>
              </div>
              <div className="p-3 border rounded-md">
                <div className="text-2xl font-bold">$12,250</div>
                <div className="text-sm text-muted-foreground">Revenue</div>
              </div>
              <div className="p-3 border rounded-md">
                <div className="text-2xl font-bold">245,000</div>
                <div className="text-sm text-muted-foreground">Tokens Sold</div>
              </div>
              <div className="p-3 border rounded-md">
                <div className="text-2xl font-bold">187</div>
                <div className="text-sm text-muted-foreground">
                  Unique Buyers
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-2">Recent Activity</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Last sale:</span>
                  <span>2 hours ago</span>
                </div>
                <div className="flex justify-between">
                  <span>Largest purchase:</span>
                  <span>10,000 STARS</span>
                </div>
                <div className="flex justify-between">
                  <span>Average purchase:</span>
                  <span>1,310 STARS</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
