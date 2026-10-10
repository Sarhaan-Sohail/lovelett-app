/**
 * Fool-Proof Native GZIP/Deflate URL Gift Engine
 * Uses the Web standard CompressionStream / DecompressionStream API
 * supported natively in all modern browsers (Chrome, Safari, iOS Safari, Firefox, Edge, Android).
 * 
 * 100% Client-Side. 0 Third-Party Endpoints. 0 Database Outages. 100% Reliable.
 */

// Helper to convert Uint8Array to base64url
function uint8ArrayToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Helper to convert base64url to Uint8Array
function base64UrlToUint8Array(base64url: string): Uint8Array {
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Highly optimized image resizer to keep photo payloads under 20-30KB each
 */
export const compressImageForInstantLink = (
  file: File,
  maxDim = 480,
  quality = 0.65
): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let w = img.width;
        let h = img.height;

        if (w > h) {
          if (w > maxDim) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          }
        } else {
          if (h > maxDim) {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }

        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => resolve('');
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
};

/**
 * Deflate/Gzip compress the entire gift object into a standalone URL string
 */
export async function encodeGiftPayload(giftData: any): Promise<string> {
  const jsonStr = JSON.stringify(giftData);
  const uncompressedBytes = new TextEncoder().encode(jsonStr);

  // Modern browser CompressionStream (Deflate)
  if (typeof CompressionStream !== 'undefined') {
    const blob = new Blob([uncompressedBytes as BlobPart]);
    const stream = new Response(
      blob.stream().pipeThrough(new CompressionStream('deflate-raw'))
    );
    const compressedBuffer = await stream.arrayBuffer();
    return uint8ArrayToBase64Url(new Uint8Array(compressedBuffer));
  }

  return uint8ArrayToBase64Url(uncompressedBytes);
}

/**
 * Decompress and restore the gift object on the recipient's phone/browser
 */
export async function decodeGiftPayload<T>(encodedString: string): Promise<T | null> {
  try {
    let clean = encodedString.trim();
    if (clean.startsWith('#')) clean = clean.substring(1);
    if (clean.startsWith('?')) clean = clean.substring(1);
    if (clean.startsWith('gift=')) clean = clean.substring(5);
    if (clean.startsWith('id=')) clean = clean.substring(3);
    if (clean.startsWith('data=')) clean = clean.substring(5);

    if (!clean) return null;

    const compressedBytes = base64UrlToUint8Array(clean);

    // Modern browser DecompressionStream (Deflate)
    if (typeof DecompressionStream !== 'undefined') {
      try {
        const blob = new Blob([compressedBytes as BlobPart]);
        const stream = new Response(
          blob.stream().pipeThrough(new DecompressionStream('deflate-raw'))
        );
        const decompressedBuffer = await stream.arrayBuffer();
        const jsonStr = new TextDecoder().decode(decompressedBuffer);
        return JSON.parse(jsonStr);
      } catch (streamErr) {
        console.warn('Deflate stream failed, trying raw UTF-8 fallback:', streamErr);
      }
    }

    // Direct uncompressed UTF8 fallback
    const rawJson = new TextDecoder().decode(compressedBytes);
    return JSON.parse(rawJson);
  } catch (err) {
    console.error('Error decoding gift payload:', err);
    return null;
  }
}
