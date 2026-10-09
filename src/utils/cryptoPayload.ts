import LZString from 'lz-string';

/**
 * Optimizes and resizes an image on the client side before packaging,
 * ensuring fast link generation and lightweight URL payload.
 */
export const compressImageForLink = (
  file: File,
  maxWidth = 800,
  maxHeight = 800,
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
 * Encodes the entire romantic gift state (including images and audio)
 * into a safe, compressed URL fragment.
 */
export const encodePayloadToHash = (data: any): string => {
  const jsonString = JSON.stringify(data);
  return LZString.compressToEncodedURIComponent(jsonString);
};

/**
 * Decodes the encrypted/compressed payload from the URL hash.
 */
export const decodePayloadFromHash = <T>(hashString: string): T | null => {
  try {
    const cleanHash = hashString.replace(/^#data=/, '').replace(/^#/, '');
    if (!cleanHash) return null;

    // Try LZString compressed format first
    const decompressed = LZString.decompressFromEncodedURIComponent(cleanHash);
    if (decompressed) {
      return JSON.parse(decompressed);
    }

    // Fallback for base64 legacy links
    const decodedLegacy = JSON.parse(decodeURIComponent(escape(atob(cleanHash))));
    return decodedLegacy;
  } catch (error) {
    console.error('Failed to decode payload from hash:', error);
    return null;
  }
};
