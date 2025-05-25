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
import { Separator } from "@/components/ui/separator";
import { Flame, Sparkles, Wallet } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function MintBurnTab() {
  const [mintAddress, setMintAddress] = useState("");
  const [mintAmount, setMintAmount] = useState("");
  const [burnAddress, setBurnAddress] = useState("");
  const [burnAmount, setBurnAmount] = useState("");
  const [isMinting, setIsMinting] = useState(false);
  const [isBurning, setIsBurning] = useState(false);

  const handleMint = async () => {
    if (!mintAddress || !mintAmount || Number.parseInt(mintAmount) <= 0) {
      toast({
        title: "Invalid input",
        description: "Please provide a valid wallet address and amount.",
        variant: "destructive",
      });
      return;
    }

    setIsMinting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Tokens minted successfully",
        description: `${Number.parseInt(
          mintAmount
        ).toLocaleString()} STARS have been minted to ${mintAddress.substring(
          0,
          6
        )}...${mintAddress.substring(mintAddress.length - 4)}`,
      });

      // Reset form
      setMintAddress("");
      setMintAmount("");
    } catch (error) {
      toast({
        title: "Mint operation failed",
        description:
          "There was an error processing your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsMinting(false);
    }
  };

  const handleBurn = async () => {
    if (!burnAddress || !burnAmount || Number.parseInt(burnAmount) <= 0) {
      toast({
        title: "Invalid input",
        description: "Please provide a valid wallet address and amount.",
        variant: "destructive",
      });
      return;
    }

    setIsBurning(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Tokens burned successfully",
        description: `${Number.parseInt(
          burnAmount
        ).toLocaleString()} STARS have been burned from ${burnAddress.substring(
          0,
          6
        )}...${burnAddress.substring(burnAddress.length - 4)}`,
      });

      // Reset form
      setBurnAddress("");
      setBurnAmount("");
    } catch (error) {
      toast({
        title: "Burn operation failed",
        description:
          "There was an error processing your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsBurning(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Mint Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-green-500" />
            Mint Tokens
          </CardTitle>
          <CardDescription>
            Create new tokens and assign them to a wallet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mint-address">Recipient Wallet Address</Label>
              <div className="flex">
                <div className="bg-muted flex items-center px-3 rounded-l-md border border-r-0 border-input">
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  id="mint-address"
                  placeholder="0x..."
                  className="rounded-l-none"
                  value={mintAddress}
                  onChange={(e) => setMintAddress(e.target.value)}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Enter the wallet address that will receive the newly minted
                tokens
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mint-amount">Amount to Mint</Label>
              <div className="flex">
                <Input
                  id="mint-amount"
                  type="number"
                  placeholder="0"
                  min="1"
                  value={mintAmount}
                  onChange={(e) => setMintAmount(e.target.value)}
                />
                <div className="bg-muted flex items-center px-3 rounded-r-md border border-l-0 border-input">
                  STARS
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Enter the number of tokens to mint
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={handleMint}
            disabled={isMinting || !mintAddress || !mintAmount}
          >
            {isMinting ? (
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
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Mint Tokens
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Burn Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-red-500" />
            Burn Tokens
          </CardTitle>
          <CardDescription>
            Remove tokens from circulation permanently
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="burn-address">Target Wallet Address</Label>
              <div className="flex">
                <div className="bg-muted flex items-center px-3 rounded-l-md border border-r-0 border-input">
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  id="burn-address"
                  placeholder="0x..."
                  className="rounded-l-none"
                  value={burnAddress}
                  onChange={(e) => setBurnAddress(e.target.value)}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Enter the wallet address from which tokens will be burned
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="burn-amount">Amount to Burn</Label>
              <div className="flex">
                <Input
                  id="burn-amount"
                  type="number"
                  placeholder="0"
                  min="1"
                  value={burnAmount}
                  onChange={(e) => setBurnAmount(e.target.value)}
                />
                <div className="bg-muted flex items-center px-3 rounded-r-md border border-l-0 border-input">
                  STARS
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Enter the number of tokens to burn
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleBurn}
            disabled={isBurning || !burnAddress || !burnAmount}
          >
            {isBurning ? (
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
              <>
                <Flame className="mr-2 h-4 w-4" />
                Burn Tokens
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Information Card */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Important Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">Minting Tokens</h3>
              <p className="text-sm text-muted-foreground">
                Minting creates new tokens and adds them to the total supply.
                This operation should be performed carefully as it increases the
                token circulation and may affect the token value.
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-1">Burning Tokens</h3>
              <p className="text-sm text-muted-foreground">
                Burning permanently removes tokens from circulation, reducing
                the total supply. This operation cannot be reversed and should
                be used with caution.
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-1">Transaction Confirmation</h3>
              <p className="text-sm text-muted-foreground">
                Both minting and burning operations require blockchain
                confirmation. You will need to confirm the transaction with your
                connected wallet. These operations may take some time to
                complete depending on network conditions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
