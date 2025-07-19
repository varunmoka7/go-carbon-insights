# S3 Bucket for File Uploads
resource "aws_s3_bucket" "forum_uploads" {
  bucket = var.s3_bucket_name

  tags = {
    Name        = "Forum Uploads"
    Environment = var.environment
    Project     = "GoCarbonTracker"
  }
}

# S3 Bucket Versioning
resource "aws_s3_bucket_versioning" "forum_uploads" {
  bucket = aws_s3_bucket.forum_uploads.id
  versioning_configuration {
    status = "Enabled"
  }
}

# S3 Bucket Server Side Encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "forum_uploads" {
  bucket = aws_s3_bucket.forum_uploads.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# S3 Bucket Public Access Block
resource "aws_s3_bucket_public_access_block" "forum_uploads" {
  bucket = aws_s3_bucket.forum_uploads.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# S3 Bucket CORS Configuration
resource "aws_s3_bucket_cors_configuration" "forum_uploads" {
  bucket = aws_s3_bucket.forum_uploads.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST", "GET", "HEAD"]
    allowed_origins = var.allowed_origins
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

# S3 Bucket Lifecycle Configuration
resource "aws_s3_bucket_lifecycle_configuration" "forum_uploads" {
  bucket = aws_s3_bucket.forum_uploads.id

  rule {
    id     = "cleanup_failed_uploads"
    status = "Enabled"

    filter {
      prefix = "uploads/"
    }

    expiration {
      days = 7
    }

    noncurrent_version_expiration {
      noncurrent_days = 1
    }

    abort_incomplete_multipart_upload {
      days_after_initiation = 1
    }
  }

  rule {
    id     = "transition_to_glacier"
    status = "Enabled"

    filter {
      prefix = "uploads/"
    }

    transition {
      days          = 30
      storage_class = "GLACIER"
    }

    transition {
      days          = 90
      storage_class = "DEEP_ARCHIVE"
    }
  }
}

# CloudFront Origin Access Identity
resource "aws_cloudfront_origin_access_identity" "forum_uploads" {
  comment = "OAI for forum uploads bucket"
}

# S3 Bucket Policy for CloudFront
resource "aws_s3_bucket_policy" "forum_uploads" {
  bucket = aws_s3_bucket.forum_uploads.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "AllowCloudFrontAccess"
        Effect    = "Allow"
        Principal = {
          AWS = aws_cloudfront_origin_access_identity.forum_uploads.iam_arn
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.forum_uploads.arn}/*"
      }
    ]
  })
}

# CloudFront Distribution
resource "aws_cloudfront_distribution" "cdn" {
  origin {
    domain_name = aws_s3_bucket.forum_uploads.bucket_regional_domain_name
    origin_id   = "S3-${aws_s3_bucket.forum_uploads.id}"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.forum_uploads.cloudfront_access_identity_path
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "CDN for forum file uploads"
  default_root_object = "index.html"

  # Logging configuration (optional)
  logging_config {
    include_cookies = false
    bucket          = var.cloudfront_logging_bucket
    prefix          = "forum-uploads/"
  }

  # Default cache behavior
  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.forum_uploads.id}"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400

    # Security headers
    response_headers_policy_id = aws_cloudfront_response_headers_policy.security_headers.id
  }

  # Cache behavior for images
  ordered_cache_behavior {
    path_pattern     = "uploads/*.jpg"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.forum_uploads.id}"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
    compress               = true
    viewer_protocol_policy = "redirect-to-https"
  }

  # Cache behavior for PNG images
  ordered_cache_behavior {
    path_pattern     = "uploads/*.png"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.forum_uploads.id}"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
    compress               = true
    viewer_protocol_policy = "redirect-to-https"
  }

  # Cache behavior for PDFs
  ordered_cache_behavior {
    path_pattern     = "uploads/*.pdf"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.forum_uploads.id}"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
    compress               = true
    viewer_protocol_policy = "redirect-to-https"
  }

  # Geographic restrictions
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  # SSL certificate
  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = {
    Name        = "Forum Uploads CDN"
    Environment = var.environment
    Project     = "GoCarbonTracker"
  }
}

# CloudFront Response Headers Policy
resource "aws_cloudfront_response_headers_policy" "security_headers" {
  name    = "forum-security-headers"
  comment = "Security headers for forum uploads"

  security_headers_config {
    strict_transport_security {
      access_control_max_age_sec = 31536000
      include_subdomains         = true
    }
    content_type_options {
      override = true
    }
    frame_options {
      frame_option = "DENY"
    }
    referrer_policy {
      referrer_policy = "strict-origin-when-cross-origin"
    }
  }
}

# CloudWatch Metric Filter for monitoring uploads
resource "aws_cloudwatch_log_metric_filter" "high_upload_rate" {
  count          = var.enable_monitoring ? 1 : 0
  name           = "high-upload-rate"
  log_group_name = var.application_log_group
  pattern        = "[timestamp, requestId, level=\"INFO\", message=\"File uploaded*\"]"

  metric_transformation {
    name      = "UploadCount"
    namespace = "ForumService/Uploads"
    value     = "1"
  }
}

# CloudWatch Alarm for high upload rate
resource "aws_cloudwatch_metric_alarm" "high_upload_rate" {
  count               = var.enable_monitoring ? 1 : 0
  alarm_name          = "forum-high-upload-rate"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "UploadCount"
  namespace           = "ForumService/Uploads"
  period              = "60"
  statistic           = "Sum"
  threshold           = "100"
  alarm_description   = "This metric monitors upload rate"
  alarm_actions       = [var.sns_alert_topic_arn]

  dimensions = {
    Environment = var.environment
  }
}

# IAM Role for Lambda function (virus scanning)
resource "aws_iam_role" "virus_scan_lambda" {
  count = var.enable_virus_scanning ? 1 : 0
  name  = "forum-virus-scan-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

# IAM Policy for Lambda function
resource "aws_iam_role_policy" "virus_scan_lambda" {
  count = var.enable_virus_scanning ? 1 : 0
  name  = "forum-virus-scan-lambda-policy"
  role  = aws_iam_role.virus_scan_lambda[0].id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObjectTagging"
        ]
        Resource = "${aws_s3_bucket.forum_uploads.arn}/*"
      }
    ]
  })
}