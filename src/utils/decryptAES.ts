// src/utils/decryptAES.ts

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

// ---------- helpers ----------
const hexToBytes = (hex: string) => {
  const match = hex.match(/.{1,2}/g);
  if (!match) return new Uint8Array(0);
  return new Uint8Array(match.map((byte) => parseInt(byte, 16)));
};

const deriveKeySHA256 = async (keyString: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(keyString);
  const hash = await crypto.subtle.digest("SHA-256", data);

  return crypto.subtle.importKey(
    "raw",
    hash,
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );
};

// ---------- main decrypt ----------
export const decryptText = async (encrypted: string | null) => {
  if (!encrypted || !ENCRYPTION_KEY) return "";

  const trimmed = encrypted.trim();
  try {
    const parts = trimmed.split(":");
    if (parts.length !== 3) {
      console.warn("Invalid encrypted format:", trimmed);
      return trimmed;
    }

    const iv = hexToBytes(parts[0].trim());
    const authTag = hexToBytes(parts[1].trim());
    const cipherText = hexToBytes(parts[2].trim());

    const key = await deriveKeySHA256(ENCRYPTION_KEY);

    const encryptedData = new Uint8Array(
      cipherText.length + authTag.length
    );
    encryptedData.set(cipherText);
    encryptedData.set(authTag, cipherText.length);

    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv, tagLength: 128 },
      key,
      encryptedData
    );

    return new TextDecoder().decode(decrypted);
  } catch (err) {
    console.error("Decryption failed for:", trimmed, err);
    return "🔒 Encrypted";
  }
};
