#!/bin/bash

# Terraform Infrastructure Validation Script
# This script validates the Terraform configuration without requiring Terraform to be installed

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Terraform Infrastructure Validation ===${NC}\n"

# Check if we're in the right directory
if [ ! -f "s3-cdn.tf" ] || [ ! -f "variables.tf" ] || [ ! -f "outputs.tf" ]; then
    echo -e "${RED}❌ Error: Terraform files not found. Please run this script from the infrastructure/ directory${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Terraform configuration files found${NC}"

# Validate file structure
echo -e "\n${YELLOW}1. Validating file structure...${NC}"

files=("s3-cdn.tf" "variables.tf" "outputs.tf")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "   ✅ $file"
    else
        echo -e "   ❌ $file (missing)"
    fi
done

# Check file contents
echo -e "\n${YELLOW}2. Validating configuration content...${NC}"

# Check S3 configuration
if grep -q "aws_s3_bucket.*forum_uploads" s3-cdn.tf; then
    echo -e "   ✅ S3 bucket configuration found"
else
    echo -e "   ❌ S3 bucket configuration missing"
fi

# Check CloudFront configuration
if grep -q "aws_cloudfront_distribution" s3-cdn.tf; then
    echo -e "   ✅ CloudFront distribution configuration found"
else
    echo -e "   ❌ CloudFront distribution configuration missing"
fi

# Check CORS configuration
if grep -q "aws_s3_bucket_cors_configuration" s3-cdn.tf; then
    echo -e "   ✅ S3 CORS configuration found"
else
    echo -e "   ❌ S3 CORS configuration missing"
fi

# Check lifecycle configuration
if grep -q "aws_s3_bucket_lifecycle_configuration" s3-cdn.tf; then
    echo -e "   ✅ S3 lifecycle configuration found"
else
    echo -e "   ❌ S3 lifecycle configuration missing"
fi

# Check security policies
if grep -q "aws_s3_bucket_policy" s3-cdn.tf; then
    echo -e "   ✅ S3 bucket policy found"
else
    echo -e "   ❌ S3 bucket policy missing"
fi

# Check Origin Access Identity
if grep -q "aws_cloudfront_origin_access_identity" s3-cdn.tf; then
    echo -e "   ✅ CloudFront Origin Access Identity found"
else
    echo -e "   ❌ CloudFront Origin Access Identity missing"
fi

# Validate variables
echo -e "\n${YELLOW}3. Validating variables...${NC}"

required_vars=("s3_bucket_name" "environment" "allowed_origins" "aws_region")
for var in "${required_vars[@]}"; do
    if grep -q "variable \"$var\"" variables.tf; then
        echo -e "   ✅ Variable '$var' defined"
    else
        echo -e "   ❌ Variable '$var' missing"
    fi
done

# Validate outputs
echo -e "\n${YELLOW}4. Validating outputs...${NC}"

required_outputs=("s3_bucket_name" "cloudfront_distribution_id" "cloudfront_domain_name" "env_vars")
for output in "${required_outputs[@]}"; do
    if grep -q "output \"$output\"" outputs.tf; then
        echo -e "   ✅ Output '$output' defined"
    else
        echo -e "   ❌ Output '$output' missing"
    fi
done

# Check for security best practices
echo -e "\n${YELLOW}5. Validating security configuration...${NC}"

# Check for encryption
if grep -q "server_side_encryption" s3-cdn.tf; then
    echo -e "   ✅ S3 server-side encryption configured"
else
    echo -e "   ❌ S3 server-side encryption missing"
fi

# Check for public access block
if grep -q "aws_s3_bucket_public_access_block" s3-cdn.tf; then
    echo -e "   ✅ S3 public access block configured"
else
    echo -e "   ❌ S3 public access block missing"
fi

# Check for HTTPS enforcement
if grep -q "redirect-to-https" s3-cdn.tf; then
    echo -e "   ✅ HTTPS enforcement configured"
else
    echo -e "   ❌ HTTPS enforcement missing"
fi

# Check CDN invalidation script
echo -e "\n${YELLOW}6. Validating CDN invalidation script...${NC}"

if [ -f "../scripts/invalidate-cdn.sh" ]; then
    echo -e "   ✅ CDN invalidation script found"
    if [ -x "../scripts/invalidate-cdn.sh" ]; then
        echo -e "   ✅ CDN invalidation script is executable"
    else
        echo -e "   ⚠️  CDN invalidation script is not executable (run: chmod +x ../scripts/invalidate-cdn.sh)"
    fi
else
    echo -e "   ❌ CDN invalidation script missing"
fi

# Generate deployment instructions
echo -e "\n${BLUE}=== Deployment Instructions ===${NC}\n"

cat << 'EOF'
To deploy this infrastructure:

1. Install Terraform:
   • macOS: brew install terraform
   • Linux: Download from https://terraform.io/downloads
   • Windows: Download from https://terraform.io/downloads

2. Configure AWS credentials:
   export AWS_ACCESS_KEY_ID="your-access-key"
   export AWS_SECRET_ACCESS_KEY="your-secret-key"
   export AWS_DEFAULT_REGION="us-east-1"

3. Initialize Terraform:
   terraform init

4. Plan the deployment:
   terraform plan -var="s3_bucket_name=your-unique-bucket-name"

5. Apply the configuration:
   terraform apply -var="s3_bucket_name=your-unique-bucket-name"

6. Note the outputs for your application configuration:
   terraform output

7. Update your application environment variables:
   • S3_BUCKET_NAME: from terraform output s3_bucket_name
   • CLOUDFRONT_DOMAIN: from terraform output cloudfront_domain_name
   • AWS_REGION: your selected region

8. Test CDN invalidation:
   ./scripts/invalidate-cdn.sh

Example terraform.tfvars file:
s3_bucket_name = "mycompany-forum-uploads-prod"
environment = "production"
allowed_origins = ["https://myapp.com", "https://www.myapp.com"]
enable_monitoring = true
EOF

echo -e "\n${GREEN}✅ Terraform configuration validation complete!${NC}"

# Check for common issues
echo -e "\n${YELLOW}7. Checking for common deployment issues...${NC}"

# Check bucket name format
if grep -q "forum-uploads" variables.tf; then
    echo -e "   ⚠️  Default bucket name may not be globally unique. Consider using: mycompany-forum-uploads-\$ENVIRONMENT"
fi

# Check for hardcoded values
if grep -q "yourdomain.com" variables.tf; then
    echo -e "   ⚠️  Update allowed_origins default value from 'yourdomain.com' to your actual domain"
fi

echo -e "\n${GREEN}🎉 Infrastructure validation complete!${NC}"
echo -e "\n${BLUE}Next steps:${NC}"
echo -e "1. Review the deployment instructions above"
echo -e "2. Customize variables.tf for your environment"
echo -e "3. Deploy using Terraform"
echo -e "4. Update application environment variables"
echo -e "5. Test file upload functionality"