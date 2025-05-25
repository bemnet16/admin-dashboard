// Mock token statistics
export const mockTokenStats = {
  circulation: 10000000,
  circulationChange: 250000,
  minted: 12000000,
  mintedChange: 300000,
  burned: 2000000,
  burnedChange: 50000,
  price: 0.05,
  priceChange: 5.2,
  saleActive: true,
  lastUpdated: new Date().toISOString(),
};

// Mock transaction data
export interface TokenTransaction {
  id: string;
  userAddress: string;
  userName: string;
  userAvatar?: string;
  type: "buy" | "gift" | "burn" | "mint";
  amount: number;
  date: string;
  txHash: string;
  status: "completed" | "pending" | "failed";
}

export const mockTransactions: TokenTransaction[] = [
  {
    id: "tx1",
    userAddress: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s",
    userName: "Alex Johnson",
    userAvatar: "/placeholder.svg?height=40&width=40",
    type: "buy",
    amount: 500,
    date: "2023-11-05T10:30:00Z",
    txHash: "0xabc123def456ghi789jkl012mno345pqr678stu901vwx234yza",
    status: "completed",
  },
  {
    id: "tx2",
    userAddress: "0xdef456ghi789jkl012mno345pqr678stu901vwx234yzaabc123",
    userName: "Sarah Williams",
    userAvatar: "/placeholder.svg?height=40&width=40",
    type: "gift",
    amount: 150,
    date: "2023-11-03T15:45:00Z",
    txHash: "0xdef456ghi789jkl012mno345pqr678stu901vwx234yzaabc123",
    status: "completed",
  },
  {
    id: "tx3",
    userAddress: "0xghi789jkl012mno345pqr678stu901vwx234yzaabc123def456",
    userName: "Michael Brown",
    userAvatar: "/placeholder.svg?height=40&width=40",
    type: "burn",
    amount: 200,
    date: "2023-10-28T09:00:00Z",
    txHash: "0xghi789jkl012mno345pqr678stu901vwx234yzaabc123def456",
    status: "completed",
  },
  {
    id: "tx4",
    userAddress: "0xjkl012mno345pqr678stu901vwx234yzaabc123def456ghi789",
    userName: "Emily Davis",
    userAvatar: "/placeholder.svg?height=40&width=40",
    type: "buy",
    amount: 1000,
    date: "2023-10-22T18:20:00Z",
    txHash: "0xjkl012mno345pqr678stu901vwx234yzaabc123def456ghi789",
    status: "completed",
  },
  {
    id: "tx5",
    userAddress: "0xmno345pqr678stu901vwx234yzaabc123def456ghi789jkl012",
    userName: "David Wilson",
    userAvatar: "/placeholder.svg?height=40&width=40",
    type: "mint",
    amount: 5000,
    date: "2023-10-15T12:10:00Z",
    txHash: "0xmno345pqr678stu901vwx234yzaabc123def456ghi789jkl012",
    status: "completed",
  },
  {
    id: "tx6",
    userAddress: "0xpqr678stu901vwx234yzaabc123def456ghi789jkl012mno345",
    userName: "Jessica Taylor",
    userAvatar: "/placeholder.svg?height=40&width=40",
    type: "gift",
    amount: 75,
    date: "2023-10-08T20:55:00Z",
    txHash: "0xpqr678stu901vwx234yzaabc123def456ghi789jkl012mno345",
    status: "completed",
  },
  {
    id: "tx7",
    userAddress: "0xstu901vwx234yzaabc123def456ghi789jkl012mno345pqr678",
    userName: "Robert Garcia",
    userAvatar: "/placeholder.svg?height=40&width=40",
    type: "buy",
    amount: 250,
    date: "2023-10-01T14:05:00Z",
    txHash: "0xstu901vwx234yzaabc123def456ghi789jkl012mno345pqr678",
    status: "pending",
  },
  {
    id: "tx8",
    userAddress: "0xvwx234yzaabc123def456ghi789jkl012mno345pqr678stu901",
    userName: "Amanda Martinez",
    userAvatar: "/placeholder.svg?height=40&width=40",
    type: "burn",
    amount: 100,
    date: "2023-09-24T07:30:00Z",
    txHash: "0xvwx234yzaabc123def456ghi789jkl012mno345pqr678stu901",
    status: "failed",
  },
  {
    id: "tx9",
    userAddress: "0xyzaabc123def456ghi789jkl012mno345pqr678stu901vwx234",
    userName: "Thomas Anderson",
    userAvatar: "/placeholder.svg?height=40&width=40",
    type: "mint",
    amount: 10000,
    date: "2023-09-17T11:15:00Z",
    txHash: "0xyzaabc123def456ghi789jkl012mno345pqr678stu901vwx234",
    status: "completed",
  },
  {
    id: "tx10",
    userAddress: "0xzaabc123def456ghi789jkl012mno345pqr678stu901vwx234y",
    userName: "Olivia White",
    userAvatar: "/placeholder.svg?height=40&width=40",
    type: "buy",
    amount: 300,
    date: "2023-09-10T19:00:00Z",
    txHash: "0xzaabc123def456ghi789jkl012mno345pqr678stu901vwx234y",
    status: "completed",
  },
];
