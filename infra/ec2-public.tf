# Create an EC2 instance (Instance 1) in the public subnet 1
resource "aws_instance" "ec2-public-1" {
  ami                         = "ami-05548f9cecf47b442" # AMAZON LINUX 2
  instance_type               = "t2.micro"             # FREE TIER
  count                       = 1
  vpc_security_group_ids      = ["${aws_security_group.public.id}"]   # Attach security group for the instance
  subnet_id                   = "${aws_subnet.public-subnet-1.id}"    # Place the instance in public subnet 1
  user_data                   = data.template_file.user_data.rendered # User data script from the "data" block
  key_name                    = aws_key_pair.generated_key.key_name    # Key pair for SSH access
  tags = {
    Name        = "${local.prefix}-ec2-public-1"      # Name tag for identifying the instance
    Environment = local.env                            # Environment tag for categorization
    Path        = "${basename(abspath(path.module))}/ec2-public.tf"   # Path tag for tracking the configuration file
    Company = local.tag_3pg #Tag for upskilling program
  }
  depends_on = [
    aws_security_group.public,             # Ensure security group is created before the instance
    aws_subnet.public-subnet-1             # Ensure public subnet 1 is created before the instance
  ]
}

data "template_file" "user_data" {
  template = file("${path.module}/user-data-scripts/user-data-crud-front.tpl")
}
