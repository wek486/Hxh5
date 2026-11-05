type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'
type Result<T> = { code: number; data: T; msg?: string; message?: string }

let base = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/+$/, '')
// #ifdef H5
base ||= '/api'
// #endif

const tokenKey = 'hx-api-token'
export const getToken = () => String(uni.getStorageSync(tokenKey) || '')
export function setToken(token: string) {
  if (token) uni.setStorageSync(tokenKey, token)
  else uni.removeStorageSync(tokenKey)
}
export function mediaUrl(url?: string) {
  if (!url || !url.startsWith('/api/')) return url || ''
  return base + url.slice(4)
}
function endpoint(path: string) {
  if (!base) throw new Error('请在 .env.local 配置 VITE_API_BASE_URL')
  return base + path
}
function unwrap<T>(status: number, body: unknown, token: string): T {
  const result = body as Result<T>
  if (status === 401 && token && getToken() === token) {
    setToken('')
    uni.$emit('hx-session-expired')
  }
  if (status >= 200 && status < 300 && result?.code === 1) return result.data
  throw new Error(result?.msg || result?.message || `请求失败（${status}）`)
}
export default async function request<T>(path: string, method: Method = 'GET', data?: Record<string, unknown>): Promise<T> {
  const url = endpoint(path)
  const token = path === '/login' || path === '/register' ? '' : getToken()
  return new Promise((resolve, reject) => {
    uni.request({
      url, method, data, timeout: 15000,
      header: token ? { Authorization: `Bearer ${token}` } : {},
      success(res) {
        try { resolve(unwrap<T>(res.statusCode, res.data, token)) }
        catch (error) { reject(error) }
      },
      fail() { reject(new Error('连接失败，请检查后端和接口地址')) }
    })
  })
}
export async function uploadAvatar<T>(filePath: string): Promise<T> {
  const url = endpoint('/account/avatar')
  const token = getToken()
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url, filePath, name: 'file', header: { Authorization: `Bearer ${token}` },
      success(res) {
        try { resolve(unwrap<T>(res.statusCode, JSON.parse(res.data), token)) }
        catch (error) { reject(error) }
      },
      fail() { reject(new Error('头像上传失败')) }
    })
  })
}
