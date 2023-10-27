resource "aws_security_group" "public" {
  name_prefix = "${local.prefix}-sg-public"      # Name prefix for the security group
  description = "Public SG Group"               # Description for the security group
  # Ingress rule: Allow all incoming traffic (from any port) from any IP
  ingress {
    from_port   = 0                           # Ingress rule: Allow all incoming traffic (from any port)
    to_port     = 0                           # Ingress rule: Allow all incoming traffic (to any port)
    protocol    = "-1"                        # Ingress rule: Allow all protocols
    cidr_blocks = ["0.0.0.0/0"]                # Ingress rule: Allow incoming traffic from any IP (0.0.0.0/0)
  }

  egress {
    from_port   = 0                           # Egress rule: Allow all outgoing traffic
    to_port     = 0                           # Egress rule: Allow all outgoing traffic
    protocol    = "-1"                        # Egress rule: Allow all protocols
    cidr_blocks = ["0.0.0.0/0"]                # Egress rule: Allow outgoing traffic to any IP (0.0.0.0/0)
  }
}