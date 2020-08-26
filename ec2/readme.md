<h3 align="center">EC2 Template</h3>
<p align="center"><img src="https://github.com/karankumarshreds/AWS-Cloudformation/blob/master/img/ec2-advance.PNG"/></p>

This is general EC2 template for the above design: 

```yaml
Resources: 
    # EC2 instance definition
    MyInstance: 
        Type: AWS::EC2::Instance 
        Properties: 
            AvailabilityZone: us-east-1a 
            ImageId: ami-a4c7edb2
            InstanceType: t2.micro 
            # array of security groups attached 
            SecurityGroups: 
                - !Ref SSHSecurityGroup 
                - !Ref ServerSecurityGroup 
    # EC2 instance elastic IP definition
    MyEIP: 
        Type: AWS::EC2::EIP 
        Properties: 
            InstanceId: !Ref MyInstance 
    # security group definition for SSH
    SSHSecurityGroup: 
        Type: AWS::EC2::SecurityGroup
        Properties: 
            GroupDescription: Enable inbound SSH access via port 22 
            ## Ingress === inbound rules 
            SecurityGroupInrgress: 
                - FromPort: 22
                  ## allow from 
                  CidrIp: 0.0.0.0/0
                  IpProtocol: tcp 
    # security group definition for general ports 
    ServerSecurityGroup: 
        Type: AWS::EC2::SecurityGroup
        Properties: 
            GroupDescription: Allow connections from mentioned IPs and ports
            SecurityGroupIngress: 
                - FromPort: 80
                  ToPort: 80
                  IpProtocol: tcp 
                  ## allow from 
                  CidrIp: 0.0.0.0/0
```
