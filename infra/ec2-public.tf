# Create an EC2 instance (Instance 1) in the public subnet 1
resource "aws_instance" "ec2-public-1" {
  ami                    = "ami-0df435f331839b2d6" # AMAZON LINUX 
  instance_type          = "t2.micro"              # FREE TIER
  count                  = 1
  key_name               = aws_key_pair.generated_key.key_name # Key pair for SSH access
  user_data              = file("${path.module}/user-data-scripts/user-data-crud-front.tpl")
  vpc_security_group_ids = [aws_security_group.public.id]
  tags = {
    Name        = "${local.prefix}-ec2-public-1"                    # Name tag for identifying the instance
    Environment = local.env                                         # Environment tag for categorization
    Path        = "${basename(abspath(path.module))}/ec2-public.tf" # Path tag for tracking the configuration file
    Company     = local.tag_3pg                                     #Tag for upskilling program
  }
  depends_on = [
    aws_security_group.public, # Ensure security group is created before the instance
  ]
}

