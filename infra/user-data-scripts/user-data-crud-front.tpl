#!/bin/bash
sudo yum update -y

# Install necessary tools
sudo yum install -y nodejs

# Install Nginx
#sudo yum install -y epel-release
#sudo yum install -y nginx
#install pm2 for node apps
sudo npm add -g pm2 
