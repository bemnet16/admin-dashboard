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
import { AlertCircle, DollarSign, Save, Gift, Settings, Wallet } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useWallet } from "@/lib/wallet-context";
import { ethers } from "ethers";
import {
  buyStars,
  giftStars,
  setFeaturePrice,
  withdrawMATIC,
  withdrawStars,
  refillStars,
  getTokenRate,
  getFeaturePrice,
  isContractOwner,
} from "@/lib/contract-interactions";

interface TokenSaleTabProps {
  currentPrice: number;
  saleActive: boolean;
}

export function TokenSaleTab({ currentPrice, saleActive }: TokenSaleTabProps) {
  const { address, isConnected, isConnecting, connect } = useWallet();
  const [price, setPrice] = useState(currentPrice.toString());
  const [isActive, setIsActive] = useState(saleActive);
  const [isSettingPrice, setIsSettingPrice] = useState(false);
  const [isSettingSale, setIsSettingSale] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isRefilling, setIsRefilling] = useState(false);
  const [isGifting, setIsGifting] = useState(false);
  const [isSettingFeature, setIsSettingFeature] = useState(false);
  const [giftAmount, setGiftAmount] = useState("");
  const [giftRecipient, setGiftRecipient] = useState("");
  const [featureName, setFeatureName] = useState<string>("");
  const [featurePriceValue, setFeaturePriceValue] = useState<string>("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [refillAmount, setRefillAmount] = useState("");
  const [buyAmount, setBuyAmount] = useState("");

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

    setIsSettingPrice(true);

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
      setIsSettingPrice(false);
    }
  };

  const handleBuyStars = async () => {
    if (!isConnected || !window.ethereum) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to buy tokens.",
        variant: "destructive",
      });
      return;
    }

    const amount = Number(buyAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to buy.",
        variant: "destructive",
      });
      return;
    }

    setIsSettingSale(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      await buyStars(signer, amount);
      toast({
        title: "Purchase successful",
        description: `Successfully purchased STARS tokens for ${amount.toLocaleString()} MATIC.`,
      });
      setBuyAmount("");
    } catch (error) {
      console.error("Error buying stars:", error);
      toast({
        title: "Purchase failed",
        description: "Failed to buy STARS tokens. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSettingSale(false);
    }
  };

  const handleGiftStars = async () => {
    if (!isConnected || !window.ethereum) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to gift tokens.",
        variant: "destructive",
      });
      return;
    }

    const amount = Number(giftAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to gift.",
        variant: "destructive",
      });
      return;
    }

    const trimmedRecipient = giftRecipient.trim();
    if (!trimmedRecipient) {
      toast({
        title: "Invalid recipient",
        description: "Please enter a valid recipient address.",
        variant: "destructive",
      });
      return;
    }

    setIsGifting(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      await giftStars(signer, trimmedRecipient, amount);
      toast({
        title: "Gift sent successfully",
        description: `Successfully sent ${amount.toLocaleString()} STARS to ${trimmedRecipient.substring(0, 6)}...${trimmedRecipient.substring(trimmedRecipient.length - 4)}`,
      });
      setGiftAmount("");
      setGiftRecipient("");
    } catch (error) {
      console.error("Error gifting stars:", error);
      toast({
        title: "Gift failed",
        description: "Failed to gift STARS tokens. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGifting(false);
    }
  };

  const handleSetFeaturePrice = async () => {
    if (!isConnected || !window.ethereum) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to set feature prices.",
        variant: "destructive",
      });
      return;
    }

    if (!featureName) {
      toast({
        title: "Invalid feature name",
        description: "Please enter a feature name.",
        variant: "destructive",
      });
      return;
    }

    const price = Number(featurePriceValue);
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price.",
        variant: "destructive",
      });
      return;
    }

    setIsSettingFeature(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const receipt = await setFeaturePrice(signer, featureName, price);
      console.log("Transaction receipt:", receipt);
      
      toast({
        title: "Success",
        description: "Feature price set successfully",
      });
      setFeatureName("");
      setFeaturePriceValue("");
    } catch (error: any) {
      console.error("Error setting feature price:", error);
      if (error.message?.includes("Only the contract owner")) {
        toast({
          title: "Unauthorized",
          description: "Only the contract owner can set feature prices.",
          variant: "destructive",
        });
      } else if (error.message?.includes("rejected")) {
        toast({
          title: "Transaction rejected",
          description: "You rejected the transaction in your wallet.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to set feature price",
          variant: "destructive",
        });
      }
    } finally {
      setIsSettingFeature(false);
    }
  };

  const handleWithdrawMATIC = async () => {
    if (!isConnected || !window.ethereum) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to withdraw MATIC.",
        variant: "destructive",
      });
      return;
    }

    setIsWithdrawing(true);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      await withdrawMATIC(signer);
      
      toast({
        title: "Withdrawal successful",
        description: "Successfully withdrew MATIC from the platform.",
      });
    } catch (error) {
      console.error("Error withdrawing MATIC:", error);
      toast({
        title: "Withdrawal failed",
        description: "There was an error withdrawing MATIC. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleWithdrawStars = async () => {
    if (!isConnected || !window.ethereum) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to withdraw STARS.",
        variant: "destructive",
      });
      return;
    }

    const amount = Number(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to withdraw.",
        variant: "destructive",
      });
      return;
    }

    setIsSettingSale(true);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      await withdrawStars(signer, amount);
      
      toast({
        title: "Withdrawal successful",
        description: `Successfully withdrew ${amount.toLocaleString()} STARS from the platform.`,
      });
      
      setWithdrawAmount("");
    } catch (error) {
      console.error("Error withdrawing STARS:", error);
      toast({
        title: "Withdrawal failed",
        description: "There was an error withdrawing STARS. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSettingSale(false);
    }
  };

  const handleRefillStars = async () => {
    if (!isConnected || !window.ethereum) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to refill STARS.",
        variant: "destructive",
      });
      return;
    }

    const amount = Number(refillAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to refill.",
        variant: "destructive",
      });
      return;
    }

    setIsRefilling(true);
    try {
      console.log("Refilling STARS:", { amount });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const signerAddress = await signer.getAddress();
      console.log("Got signer:", signerAddress);
      
      // Check if the user is the contract owner
      const isOwner = await isContractOwner(signer);
      if (!isOwner) {
        toast({
          title: "Unauthorized",
          description: "Only the contract owner can refill STARS.",
          variant: "destructive",
        });
        return;
      }
      
      await refillStars(signer, amount);
      
      toast({
        title: "Refill successful",
        description: `Successfully refilled ${amount.toLocaleString()} STARS to the platform.`,
      });
      setRefillAmount("");
    } catch (error: any) {
      console.error("Error refilling STARS:", error);
      if (error.message?.includes("Only the contract owner")) {
        toast({
          title: "Unauthorized",
          description: "Only the contract owner can refill STARS.",
          variant: "destructive",
        });
      } else if (error.message?.includes("Transaction was rejected")) {
        toast({
          title: "Transaction rejected",
          description: "You rejected the transaction in your wallet.",
          variant: "destructive",
        });
      } else if (error.message?.includes("Insufficient token allowance")) {
        toast({
          title: "Insufficient allowance",
          description: "Please approve more STARS tokens for the platform contract.",
          variant: "destructive",
        });
      } else if (error.message?.includes("Insufficient STARS balance")) {
        toast({
          title: "Insufficient balance",
          description: "You don't have enough STARS tokens to refill.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Refill failed",
          description: error.message || "There was an error refilling STARS. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsRefilling(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Buy Tokens Card */}
     

      {/* Gift Tokens Card */}
      <Card>
        <CardHeader>
          <CardTitle>Gift Tokens</CardTitle>
          <CardDescription>
            Send STARS tokens to another address
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="giftRecipient">Recipient Address</Label>
              <Input
                id="giftRecipient"
                placeholder="Enter recipient address"
                value={giftRecipient}
                onChange={(e) => setGiftRecipient(e.target.value)}
                disabled={isGifting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="giftAmount">Amount to Gift</Label>
              <Input
                id="giftAmount"
                type="number"
                placeholder="Enter amount"
                value={giftAmount}
                onChange={(e) => setGiftAmount(e.target.value)}
                disabled={isGifting}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleGiftStars}
            disabled={isGifting || !isConnected}
            className="w-full"
          >
            {isGifting ? (
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
                Processing...
              </>
            ) : (
              "Send Gift"
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Set Feature Price Card */}
      <Card>
        <CardHeader>
          <CardTitle>Set Feature Price</CardTitle>
          <CardDescription>
            Configure the price for platform features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="featureName">Feature Name</Label>
              <Input
                id="featureName"
                placeholder="Enter feature name"
                value={featureName}
                onChange={(e) => setFeatureName(e.target.value)}
                disabled={isSettingFeature}
              />
            </div>
            <div>
              <Label htmlFor="featurePrice">Price (STARS)</Label>
              <Input
                id="featurePrice"
                type="number"
                placeholder="Enter price in STARS"
                value={featurePriceValue}
                onChange={(e) => setFeaturePriceValue(e.target.value)}
                disabled={isSettingFeature}
              />
            </div>
            <Button
              onClick={handleSetFeaturePrice}
              disabled={isSettingFeature || !isConnected}
              className="w-full"
            >
              {isSettingFeature ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  Setting Price...
                </>
              ) : (
                "Set Feature Price"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Platform Funds Management Card */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Funds</CardTitle>
          <CardDescription>
            Manage platform funds and token reserves
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="withdrawAmount">Withdraw STARS</Label>
                <Input
                  id="withdrawAmount"
                  type="number"
                  placeholder="Enter amount"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  disabled={isSettingSale}
                />
              </div>
              <Button
                onClick={handleWithdrawStars}
                disabled={isSettingSale || !isConnected}
                className="w-full"
              >
                {isSettingSale ? (
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
                    Processing...
                  </>
                ) : (
                  "Withdraw STARS"
                )}
              </Button>
            </div>

            <Separator />

            <div className="space-y-4">
              <Button
                onClick={handleWithdrawMATIC}
                disabled={isWithdrawing || !isConnected}
                className="w-full"
              >
                {isWithdrawing ? (
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
                    Processing...
                  </>
                ) : (
                  "Withdraw MATIC"
                )}
              </Button>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="refillAmount">Refill STARS</Label>
                <Input
                  id="refillAmount"
                  type="number"
                  placeholder="Enter amount"
                  value={refillAmount}
                  onChange={(e) => setRefillAmount(e.target.value)}
                  disabled={isRefilling}
                />
              </div>
              <Button
                onClick={handleRefillStars}
                disabled={isRefilling || !isConnected}
                className="w-full"
              >
                {isRefilling ? (
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
                    Processing...
                  </>
                ) : (
                  "Refill STARS"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
