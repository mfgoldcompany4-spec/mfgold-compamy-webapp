import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const maxBytes = 5 * 1024 * 1024;
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

/** Resolved R2 settings from env (only the five supported variables). */
export type R2ResolvedConfig = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  /** Normalized S3 API endpoint (no trailing slash). */
  endpoint: string;
  endpointUrl: URL;
};

export type R2UploadSuccess = {
  url: string;
  key: string;
  bucket: string;
  contentType: string;
  size: number;
};

export type R2UploadError = {
  error: string;
};

export type R2UploadResult = R2UploadSuccess | R2UploadError;

function trimEnv(v: string | undefined): string | undefined {
  const t = v?.trim();
  return t || undefined;
}

function parseEndpoint(raw: string): URL | null {
  try {
    const u = new URL(raw);
    if (!u.protocol.startsWith("http")) return null;
    return u;
  } catch {
    return null;
  }
}

/**
 * Reads Cloudflare R2 configuration from env.
 * Required: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_ENDPOINT
 */
export function getR2Config(): R2ResolvedConfig | null {
  const accountId = trimEnv(process.env.R2_ACCOUNT_ID);
  const accessKeyId = trimEnv(process.env.R2_ACCESS_KEY_ID);
  const secretAccessKey = trimEnv(process.env.R2_SECRET_ACCESS_KEY);
  const bucket = trimEnv(process.env.R2_BUCKET);
  const endpointRaw = trimEnv(process.env.R2_ENDPOINT);
  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !endpointRaw) {
    return null;
  }
  const endpointUrl = parseEndpoint(endpointRaw);
  if (!endpointUrl) return null;

  const endpoint = endpointUrl.toString().replace(/\/$/, "");

  return {
    accountId,
    accessKeyId,
    secretAccessKey,
    bucket,
    endpoint,
    endpointUrl,
  };
}

let cachedClient: { sig: string; client: S3Client } | null = null;

function clientCacheSignature(cfg: R2ResolvedConfig): string {
  return [cfg.endpoint, cfg.bucket, cfg.accessKeyId, cfg.secretAccessKey].join("\0");
}

function getCachedS3Client(cfg: R2ResolvedConfig): S3Client {
  const sig = clientCacheSignature(cfg);
  if (cachedClient?.sig === sig) return cachedClient.client;
  const client = new S3Client({
    region: "auto",
    endpoint: cfg.endpoint,
    credentials: {
      accessKeyId: cfg.accessKeyId,
      secretAccessKey: cfg.secretAccessKey,
    },
    forcePathStyle: true,
  });
  cachedClient = { sig, client };
  return client;
}

/** Shared S3 client for R2. Returns null if env is incomplete. */
export function getR2S3Client(): { client: S3Client; config: R2ResolvedConfig } | null {
  const config = getR2Config();
  if (!config) return null;
  return { client: getCachedS3Client(config), config };
}

export function isR2Configured(): boolean {
  return getR2Config() !== null;
}

export function validateImageFile(file: File): string | null {
  if (!allowedTypes.has(file.type)) {
    return "Only JPEG, PNG, or WebP images are allowed.";
  }
  if (file.size > maxBytes) {
    return "File must be 5MB or smaller.";
  }
  return null;
}

/**
 * Public object URL for stored keys. Uses path-style URL on the R2 S3 endpoint host:
 * `{R2_ENDPOINT}/{R2_BUCKET}/{key}`. Enable public access or a custom domain that maps
 * to this bucket if browsers should load images without signing.
 */
export function buildR2PublicObjectUrl(config: R2ResolvedConfig, key: string): string {
  const base = config.endpoint.replace(/\/$/, "");
  const safeKey = key.replace(/^\/+/, "");
  return `${base}/${config.bucket}/${safeKey}`;
}

/**
 * Derives object key from a stored public URL for delete. Supports:
 * - Current: same host as R2_ENDPOINT with path `/{bucket}/{key}`
 * - Legacy: any other host with path equal to the object key (e.g. old `R2_PUBLIC_URL` + key)
 */
export function publicUrlToObjectKey(publicUrl: string): string | null {
  const cfg = getR2Config();
  if (!cfg) return null;
  let u: URL;
  try {
    u = new URL(publicUrl);
  } catch {
    return null;
  }

  if (u.hostname === cfg.endpointUrl.hostname) {
    const path = u.pathname.replace(/^\/+/, "");
    const prefix = `${cfg.bucket}/`;
    if (path.startsWith(prefix)) {
      const key = path.slice(prefix.length);
      return key || null;
    }
    return path || null;
  }

  const legacyKey = u.pathname.replace(/^\/+/, "");
  return legacyKey || null;
}

export async function uploadToR2(file: File, prefix: string): Promise<R2UploadResult> {
  const resolved = getR2S3Client();
  if (!resolved) {
    return {
      error:
        "R2 is not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, and R2_ENDPOINT.",
    };
  }

  const { client, config } = resolved;

  const err = validateImageFile(file);
  if (err) return { error: err };

  const ext =
    file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const safePrefix = prefix.replace(/\/$/, "").replace(/^\/+/, "");
  const key = `${safePrefix}/${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    await client.send(
      new PutObjectCommand({
        Bucket: config.bucket,
        Key: key,
        Body: buffer,
        ContentType: file.type,
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upload to R2 failed.";
    return { error: message };
  }

  return {
    url: buildR2PublicObjectUrl(config, key),
    key,
    bucket: config.bucket,
    contentType: file.type,
    size: file.size,
  };
}

export async function deleteFromR2ByPublicUrl(publicUrl: string): Promise<void> {
  const resolved = getR2S3Client();
  if (!resolved) return;

  const key = publicUrlToObjectKey(publicUrl);
  if (!key) return;

  try {
    await resolved.client.send(
      new DeleteObjectCommand({
        Bucket: resolved.config.bucket,
        Key: key,
      }),
    );
  } catch {
    /* ignore storage errors — caller may still remove DB row */
  }
}
