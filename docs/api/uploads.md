# Upload API Documentation

The Forum Service provides secure file upload functionality using AWS S3 presigned URLs and CloudFront CDN delivery.

## Overview

The upload system supports:
- **Direct-to-S3 uploads** using presigned URLs
- **File validation** (type, size, security)
- **CDN delivery** via CloudFront
- **Virus scanning** (optional)
- **Lifecycle management** with automatic cleanup

## Supported File Types

- **Images**: `image/png`, `image/jpeg`
- **Documents**: `application/pdf`
- **Size Limit**: 10MB per file

## API Endpoints

### Generate Presigned URL

Generate a presigned URL for direct upload to S3.

**Endpoint:** `POST /api/uploads/presign`

**Authentication:** Required (Bearer token)

**Request Body:**
```json
{
  "filename": "screenshot.png",
  "contentType": "image/png",
  "sizeBytes": 824123
}
```

**Response (200 OK):**
```json
{
  "uploadId": "123e4567-e89b-12d3-a456-426614174000",
  "url": "https://bucket.s3.amazonaws.com/uploads/123e4567-e89b-12d3-a456-426614174000.png?AWSAccessKeyId=...",
  "expiresIn": 300
}
```

**Error Responses:**
- `400 Bad Request` - Invalid file type or size
- `401 Unauthorized` - Authentication required
- `429 Too Many Requests` - Rate limit exceeded

**Example Error:**
```json
{
  "code": "INVALID_FILE",
  "message": "File size exceeds maximum limit of 10MB"
}
```

### Confirm Upload

Confirm that the file was successfully uploaded to S3.

**Endpoint:** `POST /api/uploads/confirm`

**Authentication:** Required (Bearer token)

**Request Body:**
```json
{
  "uploadId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Response:** `204 No Content`

**Error Responses:**
- `400 Bad Request` - File not found in S3
- `404 Not Found` - Upload record not found
- `409 Conflict` - Upload already processed

### Get Upload Metadata

Retrieve metadata for a specific upload.

**Endpoint:** `GET /api/uploads/:id`

**Authentication:** Required (Bearer token)

**Response (200 OK):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "originalFilename": "screenshot.png",
  "contentType": "image/png",
  "sizeBytes": 824123,
  "cdnUrl": "https://d1234567890abc.cloudfront.net/uploads/123e4567-e89b-12d3-a456-426614174000.png",
  "status": "uploaded",
  "createdAt": "2025-07-19T10:30:00.000Z",
  "updatedAt": "2025-07-19T10:31:00.000Z"
}
```

**Access Control:**
- Users can only access their own uploads
- Admins and moderators can access all uploads

### Delete Upload

Soft-delete an upload (marks as failed).

**Endpoint:** `DELETE /api/uploads/:id`

**Authentication:** Required (Bearer token)

**Response:** `204 No Content`

**Access Control:**
- Users can only delete their own uploads
- Admins and moderators can delete any upload

### Get User Uploads

Retrieve uploads for the current user with pagination.

**Endpoint:** `GET /api/uploads/user/me`

**Authentication:** Required (Bearer token)

**Query Parameters:**
- `limit` (optional): Number of uploads to return (default: 50, max: 100)
- `offset` (optional): Number of uploads to skip (default: 0)

**Response (200 OK):**
```json
{
  "uploads": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "originalFilename": "screenshot.png",
      "contentType": "image/png",
      "sizeBytes": 824123,
      "cdnUrl": "https://d1234567890abc.cloudfront.net/uploads/123e4567-e89b-12d3-a456-426614174000.png",
      "status": "uploaded",
      "createdAt": "2025-07-19T10:30:00.000Z"
    }
  ],
  "limit": 50,
  "offset": 0,
  "total": 1
}
```

## Upload Flow

### 1. Client-Side Upload Process

```javascript
// Step 1: Get presigned URL
const presignResponse = await fetch('/api/uploads/presign', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`,
  },
  body: JSON.stringify({
    filename: file.name,
    contentType: file.type,
    sizeBytes: file.size,
  }),
});

const { uploadId, url } = await presignResponse.json();

// Step 2: Upload directly to S3
const uploadResponse = await fetch(url, {
  method: 'PUT',
  body: file,
  headers: {
    'Content-Type': file.type,
  },
});

if (!uploadResponse.ok) {
  throw new Error('Failed to upload file');
}

// Step 3: Confirm upload
await fetch('/api/uploads/confirm', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`,
  },
  body: JSON.stringify({ uploadId }),
});

// Step 4: Get final metadata (optional)
const metadataResponse = await fetch(`/api/uploads/${uploadId}`, {
  headers: {
    'Authorization': `Bearer ${authToken}`,
  },
});

const uploadMeta = await metadataResponse.json();
console.log('CDN URL:', uploadMeta.cdnUrl);
```

### 2. React Component Usage

```jsx
import { FileUpload } from '../components/FileUpload';

function MyComponent() {
  const handleSuccess = (upload) => {
    console.log('Upload successful:', upload.cdnUrl);
    // Use upload.cdnUrl in your topic/reply
  };

  const handleError = (error) => {
    console.error('Upload failed:', error.message);
  };

  return (
    <FileUpload
      uploadUrl="/api/uploads"
      allowedTypes={['image/png', 'image/jpeg', 'application/pdf']}
      maxSizeBytes={10000000}
      multiple={false}
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
}
```

## Rate Limiting

Upload endpoints are rate-limited to prevent abuse:

- **Presign requests**: 5 per minute per IP
- **General API**: 100 requests per 15 minutes per IP

Rate limit headers are included in responses:
```http
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 4
X-RateLimit-Reset: 1642678800
```

## Security

### Authentication
All upload endpoints require JWT authentication via Bearer token:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### File Validation
- **Content-Type validation**: Server validates MIME type
- **Size limits**: 10MB maximum per file
- **Filename sanitization**: Path traversal protection
- **Virus scanning**: Optional ClamAV integration

### S3 Security
- **Presigned URLs**: Expire after 5 minutes
- **CORS policy**: Restricted to allowed origins
- **Bucket policy**: Read-only access via CloudFront OAI
- **Encryption**: Server-side encryption (AES-256)

## Error Handling

### Common Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `INVALID_REQUEST` | Missing or invalid request parameters | 400 |
| `INVALID_FILE` | File type, size, or format violation | 400 |
| `UPLOAD_FAILED` | S3 upload or confirmation failed | 400 |
| `NOT_FOUND` | Upload record not found | 404 |
| `FORBIDDEN` | Access denied (wrong user/role) | 403 |
| `CONFLICT` | Upload already processed | 409 |
| `INTERNAL_ERROR` | Server error | 500 |

### Error Response Format
```json
{
  "code": "INVALID_FILE",
  "message": "File size exceeds maximum limit of 10MB"
}
```

## Environment Variables

Configure the upload service with these environment variables:

```bash
# AWS Configuration
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
S3_BUCKET_NAME=forum-uploads-prod
CLOUDFRONT_DOMAIN=d1234567890abc.cloudfront.net

# Upload Settings
UPLOAD_URL_EXPIRES=300  # Presigned URL expiration (seconds)

# Optional Features
VIRUS_SCANNING_ENABLED=false
```

## Monitoring

### CloudWatch Metrics

The service emits custom metrics for monitoring:

- `ForumService/Uploads/UploadCount` - Number of uploads per minute
- `ForumService/Uploads/UploadErrors` - Failed uploads per minute
- `ForumService/Uploads/StorageUsed` - Total storage usage

### Alarms

Automatic alerts are configured for:
- High upload rate (>100 uploads/minute)
- High error rate (>10% failure rate)
- Storage quota approaching limit

### Logs

Upload events are logged with structured data:
```json
{
  "timestamp": "2025-07-19T10:30:00.000Z",
  "level": "INFO",
  "message": "File uploaded successfully",
  "uploadId": "123e4567-e89b-12d3-a456-426614174000",
  "userId": "user-123",
  "filename": "screenshot.png",
  "sizeBytes": 824123,
  "contentType": "image/png"
}
```

## CDN and Caching

### CloudFront Configuration

- **Cache TTL**: 1 hour (default), 24 hours (images), 1 year (max)
- **Compression**: Enabled for all file types
- **Geographic distribution**: Global edge locations
- **HTTPS**: Redirect HTTP to HTTPS

### Cache Invalidation

Invalidate CDN cache when needed:

```bash
# Using the provided script
./scripts/invalidate-cdn.sh E1234567890ABC /uploads/*

# Manual AWS CLI
aws cloudfront create-invalidation \
  --distribution-id E1234567890ABC \
  --paths "/uploads/*"
```

## Lifecycle Management

### Automatic Cleanup

S3 lifecycle rules automatically manage storage:

- **Failed uploads**: Deleted after 7 days
- **Old versions**: Deleted after 1 day
- **Archive transition**: Move to Glacier after 30 days
- **Deep archive**: Move to Deep Archive after 90 days

### Manual Cleanup

Clean up test uploads:
```bash
# List uploads older than 30 days
aws s3 ls s3://forum-uploads/uploads/ \
  --recursive \
  --query "Contents[?LastModified<='2025-06-19']"

# Delete old test files
aws s3 rm s3://forum-uploads/uploads/test/ --recursive
```

## Integration Examples

### Forum Topic with Attachments

```javascript
// Create topic with file attachments
const uploadIds = ['upload-1', 'upload-2'];

const topic = await fetch('/api/topics', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`,
  },
  body: JSON.stringify({
    title: 'My Topic',
    content: 'Topic content with attachments',
    categoryId: 'category-123',
    attachments: uploadIds,
  }),
});
```

### Display Uploaded Images

```jsx
function ImageAttachment({ upload }) {
  return (
    <div className="attachment">
      <img 
        src={upload.cdnUrl} 
        alt={upload.originalFilename}
        loading="lazy"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
      <p className="filename">{upload.originalFilename}</p>
    </div>
  );
}
```

## Troubleshooting

### Common Issues

1. **"Upload URL expired"**
   - Presigned URLs expire after 5 minutes
   - Generate a new URL if needed

2. **"CORS error"**
   - Check that your domain is in the allowed origins
   - Verify S3 bucket CORS configuration

3. **"File not found after upload"**
   - S3 may have eventual consistency
   - Retry confirmation after a short delay

4. **"Access denied"**
   - Verify JWT token is valid
   - Check user permissions for the upload

### Debug Mode

Enable verbose logging:
```bash
DEBUG=upload:* npm run dev
```

This will log detailed information about upload operations for debugging.