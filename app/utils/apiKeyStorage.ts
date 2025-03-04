import { encrypt, decrypt } from "./encryptionUtils"

interface ApiKeys {
  [key: string]: string
}

const STORAGE_KEY = "encrypted_api_keys"

export function saveApiKeys(keys: ApiKeys): void {
  const encrypted = encrypt(JSON.stringify(keys))
  localStorage.setItem(STORAGE_KEY, encrypted)
}

export function getApiKeys(): ApiKeys {
  const encrypted = localStorage.getItem(STORAGE_KEY)
  if (!encrypted) return {}
  try {
    return JSON.parse(decrypt(encrypted))
  } catch (error) {
    console.error("Error decrypting API keys:", error)
    return {}
  }
}

