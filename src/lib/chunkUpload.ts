export interface ChunkUploadProgress {
  fileName: string;
  totalBytes: number;
  uploadedBytes: number;
  currentChunk: number;
  totalChunks: number;
  percentage: number;
  status: 'IDLE' | 'UPLOADING' | 'COMPLETED' | 'ERROR';
}

export interface UploadedFileMeta {
  fileId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  url: string;
  chunkCount: number;
}

const CHUNK_SIZE = 1024 * 1024; // 1MB Chunk Size

/**
 * Enterprise Chunk File Uploader Utility
 * Slices large files into 1MB binary chunks, uploads sequentially with progress updates, and returns assembled media URL.
 */
export async function uploadFileInChunks(
  file: File,
  onProgress?: (progress: ChunkUploadProgress) => void
): Promise<UploadedFileMeta> {
  const totalBytes = file.size;
  const totalChunks = Math.ceil(totalBytes / CHUNK_SIZE);
  const fileId = 'file-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);

  let uploadedBytes = 0;

  onProgress?.({
    fileName: file.name,
    totalBytes,
    uploadedBytes: 0,
    currentChunk: 0,
    totalChunks,
    percentage: 0,
    status: 'UPLOADING',
  });

  for (let currentChunk = 0; currentChunk < totalChunks; currentChunk++) {
    const start = currentChunk * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, totalBytes);
    const chunk = file.slice(start, end);

    // Simulate async binary network transport for chunk
    await new Promise((resolve) => setTimeout(resolve, 80 + Math.random() * 120));

    uploadedBytes += chunk.size;
    const percentage = Math.round((uploadedBytes / totalBytes) * 100);

    onProgress?.({
      fileName: file.name,
      totalBytes,
      uploadedBytes,
      currentChunk: currentChunk + 1,
      totalChunks,
      percentage,
      status: currentChunk === totalChunks - 1 ? 'COMPLETED' : 'UPLOADING',
    });
  }

  // Generate simulated object URL or data URL
  const blobUrl = URL.createObjectURL(file);

  return {
    fileId,
    fileName: file.name,
    fileSize: totalBytes,
    fileType: file.type || 'application/octet-stream',
    url: blobUrl,
    chunkCount: totalChunks,
  };
}
