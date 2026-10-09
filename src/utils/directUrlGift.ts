import LZString from 'lz-string';

/**
 * 1. Compress image to a compact size suitable for instant URL transmission
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
        // Use efficient JPEG compression
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
 * 2. Compresses the entire data payload into a clean, working URL string with LZString
 */
export const packGiftToUrl = (data: any): string => {
  try {
    const json = JSON.stringify(data);
    const compressed = LZString.compressToEncodedURIComponent(json);
    return compressed;
  } catch (err) {
    console.error('Error packing gift:', err);
    return '';
  }
};

/**
 * 3. Unpacks the gift from URL with zero network latency
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

    // LZString decompression
    const json = LZString.decompressFromEncodedURIComponent(clean);
    if (json) {
      return JSON.parse(json);
    }

    // Fallback: Unicode JSON parser
    const binary = atob(clean);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const decoded = new TextDecoder().decode(bytes);
    return JSON.parse(decoded);
  } catch (err) {
    console.error('Error unpacking gift:', err);
    return null;
  }
};
