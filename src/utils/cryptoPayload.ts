/**
 * Native, zero-dependency client-side image compression & Base64 encoding.
 * Eliminates all external package bundling/typing issues on Vercel.
 */

export const compressImageForLink = (
  file: File,
  maxWidth = 700,
  maxHeight = 700,
  quality = 0.7
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Standard Unicode-safe Base64 encoder (Native Web APIs only)
 */
export const encodePayloadToHash = (data: any): string => {
  try {
    const jsonString = JSON.stringify(data);
    const utf8Bytes = new TextEncoder().encode(jsonString);
    let binary = '';
    const len = utf8Bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(utf8Bytes[i]);
    }
    return btoa(binary);
  } catch (error) {
    console.error('Encoding error:', error);
    return '';
  }
};

/**
 * Standard Unicode-safe Base64 decoder (Native Web APIs only)
 */
export const decodePayloadFromHash = <T>(hashString: string): T | null => {
  try {
    const cleanHash = hashString.replace(/^#data=/, '').replace(/^#/, '');
    if (!cleanHash) return null;

    const binary = atob(cleanHash);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const jsonString = new TextDecoder().decode(bytes);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Failed to decode payload from hash:', error);
    return null;
  }
};
