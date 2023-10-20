resource "tls_private_key" "this" {
  algorithm = "RSA"    # Generate a private key using RSA algorithm
}

# Create an AWS Key Pair resource using the generated private key
resource "aws_key_pair" "generated_key" {
  key_name   = "generated_key"                             # Name for the AWS key pair
  public_key = tls_private_key.this.public_key_openssh     # Use the generated public key in OpenSSH format
}

# Store the private key in a local file
resource "local_file" "private_key" {
  content  = tls_private_key.this.private_key_pem   # Use the generated private key in PEM format
  filename = "${path.module}/generated_key.pem"     # File path for storing the private key
}
