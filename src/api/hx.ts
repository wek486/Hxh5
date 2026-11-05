import request from '../utils/axios'

export interface ImageRecord {
  id: number
  title?: string
  url: string
  author: string
  authorId: number
  authorUserId?: number
  avatarUrl?: string
  time?: string
  height?: number
  likes: number
}
export interface Profile {
  id: number
  username: string
  nickname: string
  bio: string
  avatarUrl: string
  followingCount: number
  likesCount: number
  commentsCount: number
}
export interface FollowRecord { id: number; name: string; avatarUrl: string; coverUrl: string }
export interface CommentRecord {
  id: number
  userId: number
  username: string
  content: string
  createdAt: string
  status: string
  avatarUrl?: string
}
export const hx = {
  feed: (category: string, sort: string, page: number) => request<ImageRecord[]>('/get_image_list', 'GET', { category, sort, page }),
  search: (content: string, category: string, sort: string) => request<ImageRecord[]>('/images/search', 'GET', { content, category, sort }),
  image: (id: number) => request<ImageRecord>(`/social/images/${id}`),
  login: (username: string, password: string) => request<{ token: string }>('/login', 'POST', { username, password }),
  register: (username: string, password: string) => request<void>('/register', 'POST', { username, password }),
  me: () => request<Profile>('/account/me'),
  updateProfile: (nickname: string, bio: string) => request<Profile>('/account/me', 'PUT', { nickname, bio }),
  password: (oldPassword: string, newPassword: string) => request<void>('/account/password', 'PUT', { oldPassword, newPassword }),
  likes: (page: number) => request<{ image: ImageRecord }[]>('/social/me/likes', 'GET', { page, size: 100 }),
  follows: (page: number) => request<FollowRecord[]>('/social/me/follows', 'GET', { page, size: 100 }),
  like: (id: number, on: boolean) => request<{ liked: boolean; likes: number }>(`/social/images/${id}/like`, on ? 'PUT' : 'DELETE'),
  follow: (id: number, on: boolean) => request<void>(`/social/authors/${id}/follow`, on ? 'PUT' : 'DELETE'),
  comments: (id: number, page: number) => request<{ records: CommentRecord[]; total: number }>(`/social/images/${id}/comments`, 'GET', { page, size: 20 }),
  postComment: (id: number, content: string) => request<void>(`/social/images/${id}/comments`, 'POST', { content }),
  deleteComment: (id: number) => request<void>(`/social/comments/${id}`, 'DELETE')
}
