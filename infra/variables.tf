locals {
  # Prefix for resource names to ensure uniqueness and easy identification
  prefix = "umg-is-tf"

  # Environment where the infrastructure is being deployed (e.g., "dev", "prod")
  env = "dev"

  # AWS region where the resources will be provisioned
  aws = {
    region = "us-east-1"
  }

  tag_3pg = "3pg" #this will be helpful to redefine the tags from 3pillar later 
  # VPC and subnet CIDR blocks for defining IP address ranges
  vpc = {
    cidr = "192.168.0.0/16" # CIDR block for the VPC
    # CIDR blocks for private subnets in two availability zones
    cidr_subnet1_public = "192.168.2.0/24"

  }
}