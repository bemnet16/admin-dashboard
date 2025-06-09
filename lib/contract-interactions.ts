import { ethers } from "ethers";
import tokenAbi from "../contract_abi/StarsToken.json";
import platformAbi from "../contract_abi/StarsPlatform.json";
import { CONTRACT_CONFIG } from "./contract-config";
import StarsPlatformABI from "../contract_abi/StarsPlatform.json";

// Contract ABIs
const STARS_TOKEN_ABI = tokenAbi.abi;
const STARS_PLATFORM_ABI = platformAbi.abi;

// Contract addresses
const STARS_TOKEN_ADDRESS = CONTRACT_CONFIG.STARS_TOKEN_ADDRESS;
const STARS_PLATFORM_ADDRESS = CONTRACT_CONFIG.STARS_PLATFORM_ADDRESS;

// Helper function to get contract instance
const getContract = (address: string, abi: any, signer: ethers.Signer) => {
  return new ethers.Contract(address, abi, signer);
};

// Token Contract Interactions
export const getTokenContract = (signer: ethers.Signer) => {
  return getContract(STARS_TOKEN_ADDRESS, STARS_TOKEN_ABI, signer);
};

export const mintTokens = async (
  signer: ethers.Signer,
  to: string,
  amount: number
) => {
  const contract = getTokenContract(signer);
  const amountWei = ethers.parseUnits(amount.toString(), 18); // Assuming 18 decimals
  const tx = await contract.mint(to, amountWei);
  return await tx.wait();
};

export const burnTokens = async (
  signer: ethers.Signer,
  amount: number
) => {
  const contract = getTokenContract(signer);
  const amountWei = ethers.parseUnits(amount.toString(), 18); // Assuming 18 decimals
  const tx = await contract.burn(amountWei);
  return await tx.wait();
};

export const approveTokens = async (
  signer: ethers.Signer,
  spender: string,
  amount: number
) => {
  const contract = getTokenContract(signer);
  const amountWei = ethers.parseUnits(amount.toString(), 18); // Assuming 18 decimals
  const tx = await contract.approve(spender, amountWei);
  return await tx.wait();
};

// Platform Contract Interactions
export const getPlatformContract = (signer: ethers.Signer) => {
  return getContract(STARS_PLATFORM_ADDRESS, STARS_PLATFORM_ABI, signer);
};

export const buyStars = async (signer: ethers.Signer, amount: number) => {
  const contract = getPlatformContract(signer);
  const amountWei = ethers.parseUnits(amount.toString(), 18); // Assuming 18 decimals
  const tx = await contract.buyStars({ value: amountWei });
  return await tx.wait();
};

export const giftStars = async (
  signer: ethers.Signer,
  recipient: string,
  amount: number
) => {
  const platformContract = getPlatformContract(signer);
  const tokenContract = getTokenContract(signer);
  const amountWei = ethers.parseUnits(amount.toString(), 18);

  // First approve the platform contract to spend our tokens
  const approveTx = await tokenContract.approve(platformContract.target, amountWei);
  await approveTx.wait();

  // Then gift the tokens
  const tx = await platformContract.giftStars(recipient.trim(), amountWei);
  return await tx.wait();
};

export const setFeaturePrice = async (
  signer: ethers.Signer,
  feature: string,
  price: number
): Promise<ethers.TransactionReceipt> => {
  try {
    console.log("Creating contract instance...");
    const contract = getPlatformContract(signer);
    console.log("Contract address:", contract.target);
    
    console.log("Converting price to wei...");
    const priceWei = ethers.parseUnits(price.toString(), 18);
    console.log("Price in wei:", priceWei.toString());
    
    console.log("Calling setFeaturePrice on contract...");
    const tx = await contract.setFeaturePrice(feature, priceWei);
    console.log("Transaction hash:", tx.hash);
    
    console.log("Waiting for transaction confirmation...");
    const receipt = await tx.wait();
    console.log("Transaction confirmed:", receipt);
    
    return receipt;
  } catch (error: any) {
    console.error("Error in setFeaturePrice:", error);
    if (error.message?.includes("OwnableUnauthorizedAccount")) {
      throw new Error("Only the contract owner can set feature prices");
    } else if (error.message?.includes("user rejected")) {
      throw new Error("Transaction was rejected by user");
    } else {
      throw error;
    }
  }
};

export const withdrawMATIC = async (signer: ethers.Signer) => {
  const contract = getPlatformContract(signer);
  const tx = await contract.withdrawMATIC();
  return await tx.wait();
};

export const withdrawStars = async (signer: ethers.Signer, amount: number) => {
  const contract = new ethers.Contract(
    CONTRACT_CONFIG.STARS_PLATFORM_ADDRESS,
    StarsPlatformABI.abi,
    signer
  );

  const amountWei = ethers.parseUnits(amount.toString(), 18);
  const tx = await contract.withdrawStars(amountWei);
  await tx.wait();
};

export const refillStars = async (signer: ethers.Signer, amount: number) => {
  try {
    console.log("Creating contract instance...");
    const contract = getPlatformContract(signer);
    console.log("Contract address:", contract.target);
    
    console.log("Converting amount to wei...");
    const amountWei = ethers.parseUnits(amount.toString(), 18);
    console.log("Amount in wei:", amountWei.toString());
    
    // First approve the platform contract to spend our tokens
    console.log("Approving tokens...");
    const tokenContract = getTokenContract(signer);
    const approveTx = await tokenContract.approve(contract.target, amountWei);
    console.log("Approval transaction hash:", approveTx.hash);
    await approveTx.wait();
    console.log("Approval confirmed");
    
    console.log("Calling refillStars on contract...");
    const tx = await contract.refillStars(amountWei);
    console.log("Transaction hash:", tx.hash);
    
    console.log("Waiting for transaction confirmation...");
    const receipt = await tx.wait();
    console.log("Transaction confirmed:", receipt);
    
    return receipt;
  } catch (error: any) {
    console.error("Error in refillStars:", error);
    if (error.message?.includes("OwnableUnauthorizedAccount")) {
      throw new Error("Only the contract owner can refill STARS");
    } else if (error.message?.includes("user rejected")) {
      throw new Error("Transaction was rejected by user");
    } else if (error.message?.includes("insufficient allowance")) {
      throw new Error("Insufficient token allowance. Please approve more tokens.");
    } else if (error.message?.includes("insufficient balance")) {
      throw new Error("Insufficient STARS balance to refill");
    } else {
      throw error;
    }
  }
};

// View Functions
export const getTokenBalance = async (
  signer: ethers.Signer,
  address: string
) => {
  const contract = getTokenContract(signer);
  const balance = await contract.balanceOf(address);
  return ethers.formatUnits(balance, 18); // Assuming 18 decimals
};

export const getFeaturePrice = async (
  signer: ethers.Signer,
  feature: string
) => {
  const contract = getPlatformContract(signer);
  const price = await contract.featurePrices(feature);
  return ethers.formatUnits(price, 18); // Assuming 18 decimals
};

export const getTokenRate = async (signer: ethers.Signer) => {
  const contract = getPlatformContract(signer);
  const rate = await contract.rate();
  return ethers.formatUnits(rate, 18); // Assuming 18 decimals
};

export const isContractOwner = async (signer: ethers.Signer) => {
  const contract = getPlatformContract(signer);
  const owner = await contract.owner();
  const signerAddress = await signer.getAddress();
  return owner.toLowerCase() === signerAddress.toLowerCase();
}; 