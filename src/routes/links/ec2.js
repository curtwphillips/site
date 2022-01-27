import { Container } from "react-bootstrap";
import './articles.css';

export default function EC2Article() {
  return (
    <Container className="vertical-padding-40">
      <h3>Setting up an AWS EC2</h3>
      <p>In AWS go to services {'>'} ec2s</p>
      <p>Select Amazon Linux 2 AMI</p>
      <p>Select t2.micro</p>
      <p>Review and launch</p>
      <p>Edit security group</p>
      <p>Update storage</p>
      <p>Create key pair and download to local file</p>
      <p>Protect the key</p>
      <div className="mb1rem">
        <code>chmod 400 [key file path]</code>
      </div>
      <p>Launch instance</p>
      <p>Create elastic ip</p>
      <p>Allocate elastic ip address</p>
      <p>Select the new elastic ip</p>
      <p>Select "Associate Elastic IP address"</p>
      <p>Select the ec2 instance to associate with</p>
      <p>Select "Associate"</p>
      <p>SSH to ec2</p>
      <div className="mb1rem">
        <code>ssh -i [path to .pem] ec2-user@[elastic ip]</code>
      </div>
      <div className="mb1rem">
        <code>sudo yum install nginx</code>
      </div>
      <p>install git</p>
      <div className="mb1rem">
        <code>sudo yum install git -y</code>
      </div>
      <p>create git aliases</p>
      <div className="mb1rem">
        <code>git config --global alias.co checkout</code>
        <code>git config --global alias.st status</code>
      </div>
      <p>install docker</p>
      <div className="mb1rem">
        <code>sudo yum install docker</code>
        <code>sudo systemctl enable docker</code>
        <code>sudo service docker start</code>
        <code>sudo usermod -a -G docker ec2-user</code>
      </div>
      <p>log out and back into ssh to have new permissions take effect</p>
      <p>install docker-compose</p>
      <div className="mb1rem">
        <code>sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose</code>
        <code>sudo chmod +x /usr/local/bin/docker-compose</code>
        <code>docker-compose version</code>
      </div>
    </Container>
  )
}