/**
 * 100% Zero-Dependency Browser-Native Gift Packer & Unpacker
 * Uses HTML5 Canvas + Native TextEncoder/TextDecoder + URL-safe Base64
 * Eliminates all external dependencies and TypeScript typing errors on Vercel.
 */

export const compressImageToUrlData = (
  file: File,
  maxDimension = 420,
  quality = 0.55
): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
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
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
};

/**
 * Packs the gift payload into a URL-safe string using native browser APIs
 */
export const packGiftToUrl = (data: any): string => {
  try {
    const jsonString = JSON.stringify(data);
    const utf8Bytes = new TextEncoder().encode(jsonString);
    let binary = '';
    const len = utf8Bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(utf8Bytes[i]);
    }
    return encodeURIComponent(btoa(binary));
  } catch (err) {
    console.error('Error packing gift:', err);
    return '';
  }
};

/**
 * Unpacks the gift payload from URL using native browser APIs
 */
export const unpackGiftFromUrl = <T>(hashOrSearch: string): T | null => {
  try {
    let clean = hashOrSearch.trim();
    if (clean.startsWith('#')) clean = clean.substring(1);
    if (clean.startsWith('?')) clean = clean.substring(1);
    if (clean.startsWith('gift=')) clean = clean.substring(5);
    if (clean.startsWith('data=')) clean = clean.substring(5);
    if (clean.startsWith('id=')) clean = clean.substring(3);

    if (!clean) return null;

    const decodedUri = decodeURIComponent(clean);
    const binary = atob(decodedUri);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const jsonString = new TextDecoder().decode(bytes);
    return JSON.parse(jsonString);
  } catch (err) {
    console.error('Error unpacking gift from URL:', err);
    return null;
  }
};
