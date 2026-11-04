package com.intelliquest.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class R2StorageService {

    private final S3Client s3Client;

    @Value("${cloudflare.r2.bucket-name}")
    private String bucketName;

    @Value("${cloudflare.r2.public-url}")
    private String publicUrl;

    @jakarta.annotation.PostConstruct
    public void configureBucketCors() {
        try {
            CORSRule corsRule = CORSRule.builder()
                    .allowedOrigins("*")
                    .allowedMethods("GET", "HEAD", "PUT", "POST", "DELETE")
                    .allowedHeaders("*")
                    .exposeHeaders("ETag", "Content-Type", "Content-Length")
                    .maxAgeSeconds(3600)
                    .build();

            CORSConfiguration corsConfiguration = CORSConfiguration.builder()
                    .corsRules(corsRule)
                    .build();

            PutBucketCorsRequest putBucketCorsRequest = PutBucketCorsRequest.builder()
                    .bucket(bucketName)
                    .corsConfiguration(corsConfiguration)
                    .build();

            s3Client.putBucketCors(putBucketCorsRequest);
            log.info("Successfully configured CORS on Cloudflare R2 bucket: {}", bucketName);
        } catch (Exception e) {
            log.warn("Could not set bucket CORS automatically: {}", e.getMessage());
        }
    }

    /**
     * Upload a MultipartFile directly to Cloudflare R2 via non-blocking stream
     * @param file The file uploaded by user
     * @param folder The folder path (e.g. "courses/thumbnails", "courses/materials")
     * @return The public URL of the uploaded object
     */
    public String uploadFile(MultipartFile file, String folder) throws IOException {
        String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "file";
        String cleanFileName = originalFilename.replaceAll("[^a-zA-Z0-9._-]", "_");
        String key = folder + "/" + UUID.randomUUID() + "-" + cleanFileName;

        String contentType = file.getContentType();
        if (contentType == null || contentType.isBlank()) {
            contentType = "application/octet-stream";
        }

        try (InputStream inputStream = file.getInputStream()) {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .contentType(contentType)
                    .contentLength(file.getSize())
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(inputStream, file.getSize()));
            log.info("Successfully uploaded file to R2: bucket={}, key={}", bucketName, key);

            return formatPublicUrl(key);
        } catch (Exception e) {
            log.error("Failed to upload file to Cloudflare R2: {}", e.getMessage(), e);
            throw new IOException("Failed to upload file to Cloudflare R2: " + e.getMessage(), e);
        }
    }

    /**
     * Upload raw byte array to Cloudflare R2 (used for migration of existing BLOBs)
     */
    public String uploadBytes(byte[] data, String fileName, String folder, String contentType) throws IOException {
        String cleanFileName = fileName.replaceAll("[^a-zA-Z0-9._-]", "_");
        String key = folder + "/" + UUID.randomUUID() + "-" + cleanFileName;

        if (contentType == null || contentType.isBlank()) {
            contentType = "application/octet-stream";
        }

        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .contentType(contentType)
                    .contentLength((long) data.length)
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(new ByteArrayInputStream(data), data.length));
            log.info("Successfully uploaded byte data to R2: key={}", key);

            return formatPublicUrl(key);
        } catch (Exception e) {
            log.error("Failed to upload bytes to Cloudflare R2: {}", e.getMessage(), e);
            throw new IOException("Failed to upload bytes to Cloudflare R2: " + e.getMessage(), e);
        }
    }

    /**
     * Delete an object from Cloudflare R2 given its public URL or key
     */
    public void deleteFile(String fileUrlOrKey) {
        if (fileUrlOrKey == null || fileUrlOrKey.isBlank()) {
            return;
        }

        String key = extractKeyFromUrl(fileUrlOrKey);
        try {
            DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

            s3Client.deleteObject(deleteRequest);
            log.info("Successfully deleted file from R2: key={}", key);
        } catch (Exception e) {
            log.warn("Failed to delete file from Cloudflare R2 key={}: {}", key, e.getMessage());
        }
    }

    private String formatPublicUrl(String key) {
        String base = publicUrl.endsWith("/") ? publicUrl.substring(0, publicUrl.length() - 1) : publicUrl;
        return base + "/" + key;
    }

    private String extractKeyFromUrl(String urlOrKey) {
        if (!urlOrKey.startsWith("http://") && !urlOrKey.startsWith("https://")) {
            return urlOrKey;
        }
        int idx = urlOrKey.indexOf(".r2.dev/");
        if (idx != -1) {
            return urlOrKey.substring(idx + 8);
        }
        int cloudflareIdx = urlOrKey.indexOf(".cloudflarestorage.com/");
        if (cloudflareIdx != -1) {
            String path = urlOrKey.substring(cloudflareIdx + 23);
            if (path.startsWith(bucketName + "/")) {
                return path.substring(bucketName.length() + 1);
            }
            return path;
        }
        return urlOrKey;
    }
}
