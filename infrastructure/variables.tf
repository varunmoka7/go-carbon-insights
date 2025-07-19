# S3 and CDN Configuration Variables

variable "s3_bucket_name" {
  description = "Name of the S3 bucket for file uploads"
  type        = string
  default     = "gocarbon-forum-uploads"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "allowed_origins" {
  description = "List of allowed origins for CORS"
  type        = list(string)
  default     = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://yourdomain.com"
  ]
}

variable "cloudfront_logging_bucket" {
  description = "S3 bucket for CloudFront access logs"
  type        = string
  default     = ""
}

variable "enable_monitoring" {
  description = "Enable CloudWatch monitoring and alarms"
  type        = bool
  default     = true
}

variable "enable_virus_scanning" {
  description = "Enable virus scanning for uploaded files"
  type        = bool
  default     = false
}

variable "application_log_group" {
  description = "CloudWatch log group for the application"
  type        = string
  default     = "/aws/lambda/forum-service"
}

variable "sns_alert_topic_arn" {
  description = "SNS topic ARN for alerts"
  type        = string
  default     = ""
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}