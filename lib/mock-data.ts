// Mock user data
export const userData = {
  id: "u12345",
  fullName: "Alex Johnson",
  email: "alex.johnson@example.com",
  walletAddress: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s",
  role: "User",
  status: "Active",
  verified: true,
  joinDate: "May 15, 2023",
  avatarUrl: "/placeholder.svg?height=100&width=100",
  tokenBalance: 2450,
};

// Mock content data
export const contentData = [
  {
    id: "p1",
    type: "Post",
    contentType: "image",
    preview:
      "Just launched my new NFT collection! Check it out on the marketplace...",
    mediaItems: [
      {
        type: "image",
        url: "/placeholder.svg?height=400&width=600",
      },
    ],
    date: "2023-10-15T14:30:00Z",
    likes: 45,
    shares: 12,
    status: "Approved",
  },
  {
    id: "c1",
    type: "Comment",
    contentType: "text",
    preview:
      "This is a great initiative. I'm looking forward to participating in the next community event.",
    date: "2023-10-14T09:15:00Z",
    likes: 8,
    shares: 0,
    status: "Approved",
  },
  {
    id: "p2",
    type: "Post",
    contentType: "video",
    preview:
      "My thoughts on the latest blockchain developments and what it means for our community...",
    mediaItems: [
      {
        type: "video",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        thumbnailUrl:
          "https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE=",
      },
      {
        type: "video",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/CastVideos/dash/ElephantsDreamVideo.mp4",
        thumbnailUrl: "/placeholder.svg?height=400&width=600",
      },
      {
        type: "image",
        url: "https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE=",
      },
    ],
    date: "2023-10-10T16:45:00Z",
    likes: 32,
    shares: 7,
    status: "Reported",
  },
  {
    id: "c2",
    type: "Comment",
    contentType: "text",
    preview:
      "I disagree with this approach. We should focus more on sustainability.",
    date: "2023-10-08T11:20:00Z",
    likes: 3,
    shares: 0,
    status: "Approved",
  },
  {
    id: "p3",
    type: "Post",
    contentType: "image",
    preview:
      "Announcing our community AMA session next Friday. Submit your questions now!",
    mediaItems: [
      {
        type: "image",
        url: "/placeholder.svg?height=400&width=600",
      },
    ],
    date: "2023-10-05T13:10:00Z",
    likes: 67,
    shares: 24,
    status: "Approved",
  },
  {
    id: "p4",
    type: "Post",
    contentType: "video",
    preview:
      "Check out this tutorial on how to mint your first NFT on our platform!",
    mediaItems: [
      {
        type: "video",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        thumbnailUrl: "/placeholder.svg?height=400&width=600",
      },
    ],
    date: "2023-10-03T10:20:00Z",
    likes: 89,
    shares: 34,
    status: "Approved",
  },
  {
    id: "p5",
    type: "Post",
    contentType: "text",
    preview:
      "This content has been removed for violating community guidelines.",
    date: "2023-10-01T08:30:00Z",
    likes: 0,
    shares: 0,
    status: "Deleted",
  },
  {
    id: "p6",
    type: "Post",
    contentType: "mixed",
    preview:
      "Here's my full collection of NFT artwork and a video explaining the creative process behind it.",
    mediaItems: [
      {
        type: "image",
        url: "/placeholder.svg?height=400&width=600",
      },
      {
        type: "image",
        url: "/placeholder.svg?height=400&width=600",
      },
      {
        type: "video",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        thumbnailUrl: "/placeholder.svg?height=400&width=600",
      },
    ],
    date: "2023-09-29T11:45:00Z",
    likes: 124,
    shares: 47,
    status: "Approved",
  },
  {
    id: "c3",
    type: "Comment",
    contentType: "text",
    preview:
      "This comment contains inappropriate language and has been reported by multiple users.",
    date: "2023-09-28T14:15:00Z",
    likes: 2,
    shares: 0,
    status: "Reported",
  },
];

// Mock transaction data
export const transactionData = [
  {
    id: "tx1",
    txHash: "0xabc123def456ghi789jkl012mno345pqr678stu901vwx234yza",
    amount: "+150",
    type: "gift",
    date: "2023-11-05T10:30:00Z",
  },
  {
    id: "tx2",
    txHash: "0xdef456ghi789jkl012mno345pqr678stu901vwx234yzaabc123",
    amount: "-50",
    type: "purchase",
    date: "2023-11-03T15:45:00Z",
  },
  {
    id: "tx3",
    txHash: "0xghi789jkl012mno345pqr678stu901vwx234yzaabc123def456",
    amount: "+200",
    type: "gift",
    date: "2023-10-28T09:00:00Z",
  },
  {
    id: "tx4",
    txHash: "0xjkl012mno345pqr678stu901vwx234yzaabc123def456ghi789",
    amount: "-75",
    type: "purchase",
    date: "2023-10-22T18:20:00Z",
  },
  {
    id: "tx5",
    txHash: "0xmno345pqr678stu901vwx234yzaabc123def456ghi789jkl012",
    amount: "+100",
    type: "gift",
    date: "2023-10-15T12:10:00Z",
  },
  {
    id: "tx6",
    txHash: "0xpqr678stu901vwx234yzaabc123def456ghi789jkl012mno345",
    amount: "-25",
    type: "purchase",
    date: "2023-10-08T20:55:00Z",
  },
  {
    id: "tx7",
    txHash: "0xstu901vwx234yzaabc123def456ghi789jkl012mno345pqr678",
    amount: "+50",
    type: "gift",
    date: "2023-10-01T14:05:00Z",
  },
  {
    id: "tx8",
    txHash: "0xvwx234yzaabc123def456ghi789jkl012mno345pqr678stu901",
    amount: "-100",
    type: "purchase",
    date: "2023-09-24T07:30:00Z",
  },
  {
    id: "tx9",
    txHash: "0xyzaabc123def456ghi789jkl012mno345pqr678stu901vwx234",
    amount: "+75",
    type: "gift",
    date: "2023-09-17T11:15:00Z",
  },
  {
    id: "tx10",
    txHash: "0xzaabc123def456ghi789jkl012mno345pqr678stu901vwx234y",
    amount: "-20",
    type: "purchase",
    date: "2023-09-10T19:00:00Z",
  },
];
