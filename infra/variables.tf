locals {
  # Prefix for resource names to ensure uniqueness and easy identification
  prefix = "upskilling-github-actions"

  # Environment where the infrastructure is being deployed (e.g., "dev", "prod")
  env = "dev"

  # AWS region where the resources will be provisioned
  aws = {
    region = "us-east-1"
  }
}