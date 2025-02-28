const ENCRYPTION_KEY = "your-encryption-key" // À remplacer par une clé générée de manière sécurisée

export function encrypt(text: string): string {
  const textToChars = text.split("").map((c) => c.charCodeAt(0))
  const keyToChars = ENCRYPTION_KEY.split("").map((c) => c.charCodeAt(0))
  const encrypted = textToChars.map((char, i) => String.fromCharCode(char ^ keyToChars[i % keyToChars.length]))
  return btoa(encrypted.join(""))
}

export function decrypt(encoded: string): string {
  const textToChars = atob(encoded)
    .split("")
    .map((c) => c.charCodeAt(0))
  const keyToChars = ENCRYPTION_KEY.split("").map((c) => c.charCodeAt(0))
  const decrypted = textToChars.map((char, i) => String.fromCharCode(char ^ keyToChars[i % keyToChars.length]))
  return decrypted.join("")
}

