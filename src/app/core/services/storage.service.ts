import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

export type StorageBucket = 'img-uploads' | 'doc-uploads';

/**
 * Storage service for uploading, retrieving, and deleting files from Supabase Storage.
 * Uses two buckets:
 * - img-uploads (5MB max): Service images, hotel photos, tour photos, provider profile images
 * - doc-uploads (10MB max): Provider business registration documents
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  constructor(private supabaseService: SupabaseService) {}

  /**
   * Uploads a file to the specified Supabase Storage bucket.
   * @param bucket - The target bucket ('img-uploads' or 'doc-uploads')
   * @param file - The File object to upload
   * @param path - The storage path (e.g., 'services/123/image.jpg')
   * @returns The public URL of the uploaded file
   * @throws Error if upload fails
   */
  async uploadFile(bucket: StorageBucket, file: File, path: string): Promise<string> {
    const { data, error } = await this.supabaseService.client.storage
      .from(bucket)
      .upload(path, file, { upsert: true });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    return this.getPublicUrl(bucket, data.path);
  }

  /**
   * Gets the public URL for a file stored in a bucket.
   * @param bucket - The bucket name
   * @param path - The file path within the bucket
   * @returns The public URL string
   */
  getPublicUrl(bucket: StorageBucket, path: string): string {
    const { data } = this.supabaseService.client.storage
      .from(bucket)
      .getPublicUrl(path);
    return data.publicUrl;
  }

  /**
   * Deletes a file from the specified bucket.
   * @param bucket - The bucket name
   * @param path - The file path to delete
   * @throws Error if deletion fails
   */
  async deleteFile(bucket: StorageBucket, path: string): Promise<void> {
    const { error } = await this.supabaseService.client.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  }
}
