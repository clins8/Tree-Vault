import crypto from 'crypto-js';

export function generateImageHash(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      if (e.target?.result) {
        const arrayBuffer = e.target.result as ArrayBuffer;
        const wordArray = crypto.lib.WordArray.create(arrayBuffer);
        const hash = crypto.SHA256(wordArray).toString();
        resolve(hash);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    
    reader.onerror = function() {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
}
