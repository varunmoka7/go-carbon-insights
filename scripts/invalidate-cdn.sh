#!/bin/bash

# CloudFront CDN Invalidation Script for Forum Uploads
# Usage: ./invalidate-cdn.sh [distribution-id] [path-pattern]

set -e

# Configuration
DEFAULT_DISTRIBUTION_ID=""
DEFAULT_PATH_PATTERN="/*"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Help function
show_help() {
    echo "CloudFront CDN Invalidation Script"
    echo
    echo "Usage: $0 [OPTIONS] [DISTRIBUTION_ID] [PATH_PATTERN]"
    echo
    echo "Options:"
    echo "  -h, --help              Show this help message"
    echo "  -d, --distribution-id   CloudFront Distribution ID"
    echo "  -p, --paths             Path pattern to invalidate (default: /*)"
    echo "  -w, --wait              Wait for invalidation to complete"
    echo "  -v, --verbose           Verbose output"
    echo
    echo "Examples:"
    echo "  $0 E1234567890ABC /uploads/*"
    echo "  $0 --distribution-id E1234567890ABC --paths '/uploads/*.jpg,/uploads/*.png'"
    echo "  $0 -d E1234567890ABC -p '/*' --wait"
    echo
    echo "Environment Variables:"
    echo "  CLOUDFRONT_DISTRIBUTION_ID  Default distribution ID"
    echo "  AWS_PROFILE                 AWS profile to use"
    echo "  AWS_REGION                  AWS region"
}

# Logging functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

# Check if AWS CLI is installed
check_aws_cli() {
    if ! command -v aws &> /dev/null; then
        log_error "AWS CLI is not installed. Please install it first."
        exit 1
    fi
}

# Check AWS credentials
check_aws_credentials() {
    if ! aws sts get-caller-identity &> /dev/null; then
        log_error "AWS credentials not configured or invalid."
        log_error "Please run 'aws configure' or set AWS_PROFILE environment variable."
        exit 1
    fi
}

# Validate distribution ID
validate_distribution_id() {
    local dist_id="$1"
    
    if [[ ! "$dist_id" =~ ^E[A-Z0-9]{13}$ ]]; then
        log_error "Invalid CloudFront Distribution ID format: $dist_id"
        log_error "Expected format: E followed by 13 alphanumeric characters"
        exit 1
    fi
    
    # Check if distribution exists
    if ! aws cloudfront get-distribution --id "$dist_id" &> /dev/null; then
        log_error "CloudFront distribution not found: $dist_id"
        exit 1
    fi
}

# Create invalidation
create_invalidation() {
    local dist_id="$1"
    local paths="$2"
    local wait_flag="$3"
    local verbose="$4"
    
    log_info "Creating CloudFront invalidation..."
    log_info "Distribution ID: $dist_id"
    log_info "Paths: $paths"
    
    # Convert comma-separated paths to JSON array
    local paths_json
    if [[ "$paths" == *","* ]]; then
        # Multiple paths
        IFS=',' read -ra PATH_ARRAY <<< "$paths"
        paths_json="["
        for i in "${!PATH_ARRAY[@]}"; do
            if [ $i -gt 0 ]; then
                paths_json+=","
            fi
            paths_json+="\"${PATH_ARRAY[$i]}\""
        done
        paths_json+="]"
    else
        # Single path
        paths_json="[\"$paths\"]"
    fi
    
    # Create invalidation request
    local invalidation_batch="{\"Paths\":{\"Quantity\":$(echo "$paths_json" | jq length),\"Items\":$paths_json},\"CallerReference\":\"invalidation-$(date +%s)\"}"
    
    if [ "$verbose" = true ]; then
        log_info "Invalidation batch: $invalidation_batch"
    fi
    
    # Execute invalidation
    local result
    result=$(aws cloudfront create-invalidation \
        --distribution-id "$dist_id" \
        --invalidation-batch "$invalidation_batch" \
        --output json)
    
    if [ $? -eq 0 ]; then
        local invalidation_id
        invalidation_id=$(echo "$result" | jq -r '.Invalidation.Id')
        
        log_info "Invalidation created successfully!"
        log_info "Invalidation ID: $invalidation_id"
        
        if [ "$wait_flag" = true ]; then
            log_info "Waiting for invalidation to complete..."
            aws cloudfront wait invalidation-completed \
                --distribution-id "$dist_id" \
                --id "$invalidation_id"
            
            if [ $? -eq 0 ]; then
                log_info "Invalidation completed successfully!"
            else
                log_error "Failed to wait for invalidation completion"
                exit 1
            fi
        else
            log_info "Invalidation is in progress. You can check status with:"
            log_info "aws cloudfront get-invalidation --distribution-id $dist_id --id $invalidation_id"
        fi
    else
        log_error "Failed to create invalidation"
        exit 1
    fi
}

# Get distribution ID from Terraform output
get_distribution_from_terraform() {
    if [ -f "terraform.tfstate" ]; then
        local dist_id
        dist_id=$(terraform output -raw cloudfront_distribution_id 2>/dev/null)
        if [ $? -eq 0 ] && [ -n "$dist_id" ]; then
            echo "$dist_id"
            return 0
        fi
    fi
    return 1
}

# Main function
main() {
    local distribution_id=""
    local paths="$DEFAULT_PATH_PATTERN"
    local wait_flag=false
    local verbose=false
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -d|--distribution-id)
                distribution_id="$2"
                shift 2
                ;;
            -p|--paths)
                paths="$2"
                shift 2
                ;;
            -w|--wait)
                wait_flag=true
                shift
                ;;
            -v|--verbose)
                verbose=true
                shift
                ;;
            -*)
                log_error "Unknown option: $1"
                show_help
                exit 1
                ;;
            *)
                if [ -z "$distribution_id" ]; then
                    distribution_id="$1"
                elif [ "$paths" = "$DEFAULT_PATH_PATTERN" ]; then
                    paths="$1"
                else
                    log_error "Too many arguments"
                    show_help
                    exit 1
                fi
                shift
                ;;
        esac
    done
    
    # Check dependencies
    check_aws_cli
    check_aws_credentials
    
    # Determine distribution ID
    if [ -z "$distribution_id" ]; then
        # Try environment variable
        if [ -n "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
            distribution_id="$CLOUDFRONT_DISTRIBUTION_ID"
            log_info "Using distribution ID from environment variable"
        else
            # Try Terraform output
            local terraform_dist_id
            terraform_dist_id=$(get_distribution_from_terraform)
            if [ $? -eq 0 ]; then
                distribution_id="$terraform_dist_id"
                log_info "Using distribution ID from Terraform output"
            else
                log_error "Distribution ID not provided and could not be determined automatically"
                log_error "Please provide it via:"
                log_error "  - Command line argument"
                log_error "  - CLOUDFRONT_DISTRIBUTION_ID environment variable"
                log_error "  - Terraform output (cloudfront_distribution_id)"
                exit 1
            fi
        fi
    fi
    
    # Validate inputs
    validate_distribution_id "$distribution_id"
    
    # Create invalidation
    create_invalidation "$distribution_id" "$paths" "$wait_flag" "$verbose"
}

# Run main function with all arguments
main "$@"