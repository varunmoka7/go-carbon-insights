# S3 and CDN Outputs

output "s3_bucket_name" {
  description = "Name of the created S3 bucket"
  value       = aws_s3_bucket.forum_uploads.bucket
}

output "s3_bucket_arn" {
  description = "ARN of the created S3 bucket"
  value       = aws_s3_bucket.forum_uploads.arn
}

output "s3_bucket_domain_name" {
  description = "Domain name of the S3 bucket"
  value       = aws_s3_bucket.forum_uploads.bucket_domain_name
}

output "s3_bucket_regional_domain_name" {
  description = "Regional domain name of the S3 bucket"
  value       = aws_s3_bucket.forum_uploads.bucket_regional_domain_name
}

output "cloudfront_distribution_id" {
  description = "ID of the CloudFront distribution"
  value       = aws_cloudfront_distribution.cdn.id
}

output "cloudfront_distribution_arn" {
  description = "ARN of the CloudFront distribution"
  value       = aws_cloudfront_distribution.cdn.arn
}

output "cloudfront_domain_name" {
  description = "Domain name of the CloudFront distribution"
  value       = aws_cloudfront_distribution.cdn.domain_name
}

output "cloudfront_hosted_zone_id" {
  description = "Hosted zone ID of the CloudFront distribution"
  value       = aws_cloudfront_distribution.cdn.hosted_zone_id
}

output "origin_access_identity_arn" {
  description = "ARN of the CloudFront Origin Access Identity"
  value       = aws_cloudfront_origin_access_identity.forum_uploads.iam_arn
}

# Environment variables for the application
output "env_vars" {
  description = "Environment variables to set in the application"
  value = {
    S3_BUCKET_NAME      = aws_s3_bucket.forum_uploads.bucket
    CLOUDFRONT_DOMAIN   = aws_cloudfront_distribution.cdn.domain_name
    AWS_REGION          = var.aws_region
    UPLOAD_URL_EXPIRES  = "300"
  }
  sensitive = false
}