<h2>Outputs</h2>

The optional ```outputs``` section declares output values that you can import *into other stacks*. 
In simple words, suppose you want to use one stack's rendered output in some other stack. You can do it by using **outputs**.

#### Example: 
Suppose you define a network Cloudformation and output the values such as *VPC ID* of the created network. You can use that network via this output in the other templates by using **references**.

<h5>Syntax</h5>

```yaml
Outputs: 
    Logical ID: 
        Description: Information about the value 
        Value: Value to return 
        Export: 
            Name: Value to export 

# Logical ID : An identifier for the current output. Must be unique withtin template.
# Value :             
```

<h3>Example</h3>

```yaml
## suppose a networking guy configures this 
Resources: 
    MyCustomSSHSecurityGroup: 
        Type: AWS::EC2::SecurityGroup 
        Properties: 
            SecurityGroupIngress: 
            - CidrIp: 0.0.0.0/0
              IpProtocol: tcp
              FromPort: 22
              ToPort: 22 
# export this for other stacks to be created
Outputs: 
    StackSSHSecurityGroup: 
        Value: !Ref MyCustomSSHSecurityGroup
        Export: 
            # this can be reffered by other stacks
            Name: SSHSecurityGroupOutput
```

Now this can be used by other stack using 
#### Fn: ImportValue 

##### Other template : 
```yaml
Resources: 
    MyEC2Instance: 
        Type: AWS::EC2::Instance 
        Properties: 
            AvailabilityZone: us-east-2a
            ImageId: ami-0a54aef4ef3b5f881
            InstanceType: t2.micro
            SecurityGroups: 
                # imported here 
                - !ImportValue SSHSecurityGroupOutput

```