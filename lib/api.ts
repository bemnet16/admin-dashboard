export async function fetchUsers() {
  const response = await fetch('/auth/users')
  if (!response.ok) throw new Error('Failed to fetch users')
  return response.json()
}

export async function fetchPosts() {
  const response = await fetch('/social/posts')
  if (!response.ok) throw new Error('Failed to fetch posts')
  return response.json()
}

export async function fetchReels() {
  const response = await fetch('/reel')
  if (!response.ok) throw new Error('Failed to fetch reels')
  return response.json()
}

export async function fetchPostReports(postId: string) {
  const response = await fetch(`/social/posts/${postId}/reports`)
  if (!response.ok) throw new Error('Failed to fetch post reports')
  return response.json()
}

export async function fetchUserPosts(userId: string) {
  const response = await fetch(`/social/posts?authorId=${userId}`)
  if (!response.ok) throw new Error('Failed to fetch user posts')
  return response.json()
}

export async function fetchFollowers(userId: string) {
  const response = await fetch(`/auth/followers?userId=${userId}`)
  if (!response.ok) throw new Error('Failed to fetch followers')
  return response.json()
}

export async function fetchFollowing(userId: string) {
  const response = await fetch(`/auth/following?userId=${userId}`)
  if (!response.ok) throw new Error('Failed to fetch following')
  return response.json()
} 