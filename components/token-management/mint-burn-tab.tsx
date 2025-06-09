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
import { Flame, Sparkles, Wallet, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { CONTRACT_CONFIG, getContractUrl } from "@/lib/contract-config";
import { useWallet } from "@/lib/wallet-context";
import { mintTokens, burnTokens } from "@/lib/contract-interactions";
import { ethers } from "ethers";

export function MintBurnTab() {
  const { address, isConnected, isConnecting, connect } = useWallet();
  const [mintAddress, setMintAddress] = useState("");
  const [mintAmount, setMintAmount] = useState("");
  const [burnAddress, setBurnAddress] = useState("");
  const [burnAmount, setBurnAmount] = useState("");
  const [isMinting, setIsMinting] = useState(false);
  const [isBurning, setIsBurning] = useState(false);

  const handleMint = async () => {
    if (!isConnected || !window.ethereum) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to mint tokens.",
        variant: "destructive",
      });
      return;
    }

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
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const tx = await mintTokens(signer, mintAddress, Number(mintAmount));
      
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
    } catch (error: any) {
      toast({
        title: "Mint operation failed",
        description: error.message || "There was an error processing your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsMinting(false);
    }
  };

  const handleBurn = async () => {
    if (!isConnected || !window.ethereum) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to burn tokens.",
        variant: "destructive",
      });
      return;
    }

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
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const tx = await burnTokens(signer, Number(burnAmount));
      
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
    } catch (error: any) {
      toast({
        title: "Burn operation failed",
        description: error.message || "There was an error processing your request. Please try again.",
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
            disabled={isMinting || !mintAddress || !mintAmount || !isConnected}
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
            disabled={isBurning || !burnAddress || !burnAmount || !isConnected}
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
          <CardTitle>Contract Information</CardTitle>
          <CardDescription>
            View and interact with the token contracts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-lg border">
              <div>
                <h3 className="font-medium">Stars Token Contract</h3>
                <p className="text-sm text-muted-foreground">
                  {CONTRACT_CONFIG.STARS_TOKEN_ADDRESS}
                </p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a
                  href={getContractUrl(CONTRACT_CONFIG.STARS_TOKEN_ADDRESS)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Etherscan
                </a>
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-lg border">
              <div>
                <h3 className="font-medium">Platform Contract</h3>
                <p className="text-sm text-muted-foreground">
                  {CONTRACT_CONFIG.STARS_PLATFORM_ADDRESS}
                </p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a
                  href={getContractUrl(CONTRACT_CONFIG.STARS_PLATFORM_ADDRESS)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Etherscan
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
