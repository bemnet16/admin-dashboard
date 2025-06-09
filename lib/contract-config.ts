export const CONTRACT_CONFIG = {
  STARS_TOKEN_ADDRESS: "0x185239e90BBb3810c27671aaCFA7d9b3c26Da22C",
  STARS_PLATFORM_ADDRESS: "0xA14536b87f485F266560b218f6f19D0eCAB070d1",
  ETHERSCAN_API_KEY: "DUGGC885HI87T28EAFB4WECBS57X1JGQKN",
  ETHERSCAN_API_URL: "https://api-sepolia.etherscan.io/api",
  RPC_URL: "https://eth-sepolia.g.alchemy.com/v2/QWQDj9pLO6MTD94t3E9Y2WJw4Jr5Xaxi",
} as const;

export const getEtherscanUrl = (txHash: string) => {
  return `https://sepolia.etherscan.io/tx/${txHash}`;
};

export function getContractUrl(address: string): string {
  return `https://sepolia.etherscan.io/address/${address}`;
} 