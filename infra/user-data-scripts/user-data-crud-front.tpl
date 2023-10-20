#!/bin/bash
yum update -y

# Install necessary tools
yum install -y gcc-c++ make
curl -sL https://rpm.nodesource.com/setup_14.x | sudo -E bash -
yum install -y nodejs

# Install Nginx
yum install -y epel-release
yum install -y nginx