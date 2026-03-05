import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import * as mimeTypes from 'mime-types';
import * as path from 'path';
import { CONFIG } from 'src/shared/constants/env';

@Injectable()
export class CloudflareService {
  private readonly s3: S3Client;
  private readonly bucketName = CONFIG.CLOUDFLARE_R2.BUCKET_NAME;

  constructor() {
    this.s3 = new S3Client({
      endpoint: CONFIG.CLOUDFLARE_R2.ENDPOINT,
      credentials: {
        accessKeyId: CONFIG.CLOUDFLARE_R2.ACCESS_KEY,
        secretAccessKey: CONFIG.CLOUDFLARE_R2.SECRET_KEY,
      },
      region: 'auto',
      forcePathStyle: true,
    });
  }

  /**
   * Garante que R2 está configurado. Use o endpoint da API: https://<ACCOUNT_ID>.r2.cloudflarestorage.com
   */
  private ensureR2Configured(): void {
    const endpoint = CONFIG.CLOUDFLARE_R2.ENDPOINT?.trim();
    if (!endpoint || !CONFIG.CLOUDFLARE_R2.BUCKET_NAME?.trim()) {
      throw new ServiceUnavailableException(
        'Storage (R2) não configurado. Defina CLOUDFLARE_R2_ENDPOINT (ex: https://<ACCOUNT_ID>.r2.cloudflarestorage.com), CLOUDFLARE_R2_BUCKET_NAME e as credenciais no .env.',
      );
    }
  }

  /**
   * Gera URL pré-assinada para upload (PUT)
   */
  async getUploadUrl(fileKey: string): Promise<string> {
    this.ensureR2Configured();
    const fileExt = path.extname(fileKey);
    const contentType = mimeTypes.lookup(fileExt) || 'application/octet-stream';

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
      ContentType: contentType,
    });

    return getSignedUrl(this.s3, command, { expiresIn: 3600 });
  }

  /**
   * Gera URL pré-assinada para download (GET)
   */
  async getDownloadUrl(fileKey: string, expiresIn = 3600): Promise<string> {
    this.ensureR2Configured();
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
    });

    return getSignedUrl(this.s3, command, { expiresIn });
  }

  /**
   * Retorna URL pública do objeto.
   * Se CLOUDFLARE_R2_PUBLIC_URL estiver configurado, usa URL pública permanente.
   * Caso contrário, gera URL pré-assinada (máx. 7 dias - limite do S3/R2).
   */
  async getPublicUrl(fileKey: string): Promise<string> {
    const publicUrl = CONFIG.CLOUDFLARE_R2.PUBLIC_URL?.trim();
    if (publicUrl) {
      return `${publicUrl.replace(/\/$/, '')}/${fileKey}`;
    }
    // Fallback: presigned URL com 7 dias (limite máximo do S3 Signature v4)
    return this.getDownloadUrl(fileKey, 7 * 24 * 3600);
  }

  /**
   * Faz upload de buffer/stream para o R2 (uso no backend)
   */
  async putObject(fileKey: string, body: Buffer | Uint8Array, contentType?: string): Promise<void> {
    this.ensureR2Configured();
    const fileExt = path.extname(fileKey);
    const resolvedContentType =
      contentType || mimeTypes.lookup(fileExt) || 'application/octet-stream';

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
      Body: body,
      ContentType: resolvedContentType,
    });

    await this.s3.send(command);
  }

  /**
   * Remove objeto do bucket (uso no backend)
   */
  async deleteObject(fileKey: string): Promise<void> {
    this.ensureR2Configured();
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
    });

    await this.s3.send(command);
  }

  /**
   * Normaliza nome de arquivo para chave única (lowercase, sem espaços, com timestamp)
   */
  normalizeFileKey(fileKey: string): string {
    const fileExt = path.extname(fileKey);
    const baseName = fileKey.replace(fileExt, '').toLowerCase().replace(/\s+/g, '-');
    return `${baseName}-${Date.now()}${fileExt}`;
  }
}
