// src/utils/avatar.js

const AVATAR_BASE_URL = "https://api.dicebear.com/7.x/thumbs/svg?seed="

/**
 * 生成基于用户名的随机头像 URL
 * @param {string} name 用户名
 * @returns {string} 头像URL
 */
export function generateAvatar(name) {
  const seed = encodeURIComponent(name || Math.random().toString(36).substring(2))
  return `${AVATAR_BASE_URL}${seed}`
}
