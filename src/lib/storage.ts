import fs from "fs";
import path from "path";

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

export interface StorageProvider {
  uploadFile(file: File, folder?: string): Promise<UploadResult>;
  deleteFile(fileUrl: string): Promise<boolean>;
}

// Local Disk Storage Provider
export class LocalStorageProvider implements StorageProvider {
  private baseDir: string;

  constructor() {
    this.baseDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  async uploadFile(file: File, folder = "general"): Promise<UploadResult> {
    const targetDir = path.join(this.baseDir, folder);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const ext = path.extname(file.name).toLowerCase();
    const cleanBaseName = path
      .basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .slice(0, 40);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    const finalFilename = `${cleanBaseName}-${uniqueSuffix}${ext}`;
    const filePath = path.join(targetDir, finalFilename);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.promises.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${folder}/${finalFilename}`;

    return {
      url: publicUrl,
      filename: finalFilename,
      size: file.size,
      mimeType: file.type,
    };
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    try {
      if (!fileUrl.startsWith("/uploads/")) return false;
      const relativePath = fileUrl.replace(/^\/uploads\//, "");
      const fullPath = path.join(this.baseDir, relativePath);
      if (fs.existsSync(fullPath)) {
        await fs.promises.unlink(fullPath);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to delete local file:", err);
      return false;
    }
  }
}

// S3 Storage Provider stub for cloud scalability
export class S3StorageProvider implements StorageProvider {
  async uploadFile(file: File, folder = "general"): Promise<UploadResult> {
    // If S3 credentials are configured in future, aws-sdk or @aws-sdk/client-s3 can be used here.
    // Fallback to local
    const fallback = new LocalStorageProvider();
    return fallback.uploadFile(file, folder);
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    const fallback = new LocalStorageProvider();
    return fallback.deleteFile(fileUrl);
  }
}

export function getStorageProvider(): StorageProvider {
  const type = process.env.STORAGE_TYPE || "local";
  if (type === "s3" && process.env.STORAGE_KEY && process.env.STORAGE_SECRET) {
    return new S3StorageProvider();
  }
  return new LocalStorageProvider();
}

export const storage = getStorageProvider();
