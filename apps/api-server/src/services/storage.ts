import { bucket } from './firebase';

export async function uploadBufferToStorage(path: string, buffer: Buffer, contentType: string): Promise<string> {
  const file = bucket.file(path);
  await file.save(buffer, { contentType, resumable: false, public: true });
  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
  return publicUrl;
}


