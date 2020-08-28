<h1 align="center">AWS CLOUDFORMATION TEMPLATES ✌️</h1>
<br />
<h2>Update Types</h2>

<h4>Updates with no interruption (adding AccessControl)</h4>
<p>This does not replace the running resources. Example, adding AccessControl(permissions) will simply change the permission settings on the same resource</p>

<h4>Replacement Updates</h4>
<p>Replacement updates, such as updating the name of the bucket. </p>
<p>NOTE: This will cause data loss.</p>
<br />

<h2>Template Options</h2>

1. Tags                     // all the resources will share the stack's tags 
2. Permissions              // provide role to the stack to create resources 
3. Notification Options     // emails for general notifications 
4. Timeouts                 // fails after specific amount of time 
5. Rollback on Failure      // rollback to previous state on failure 
6. Stack Policy             // can be set to resources templates to avoid deletion
<br />

<h2>Parameters</h2>
<p>Parameters are a way to provide inputs to your AWS Cloudformation templates.</p>
<p>Parameters can be declared separately which helps the templates become more dynamic and reusable becuse they can be changed as per the requirements of the different applications</p>

<h4>Parameters can be controlled by</h4>

1. Type: String/ Number/ CommaDelimitedList/ List/ AWS Parameter(AWS Custom Type)
2. Description
3. Contraints 
4. ContraintDescription
5. Min/MaxLength
6. Min/MaxValues 
7. Defaults 
8. AllowedValues(array)
9. AllowedPattern(regex)
10. NoEcho(Boolean) // if set true, the output will not be printed out (used for passwords)
<br />

<h2>Mappings</h2>
Mappings is a section of cloudformation to help you organize parameters by named keys and its corresponding values for each group.

This is similar to parameters, but here the values are predefined and others who will be creating templates can use these predefined values. It'se similar to setting the environment variables to not hardcode the values everytime (to avoid errors).

In the below example, we are specifying valid ami's to be used by our team members depending on which region they're in:

```yaml
Mappings: 
    # name of mapping
    RegionMap: 
        us-east-1: 
            "32": "ami-6411e20d"
            "64": "ami-7a11e213"
        us-east-2: 
            "32": "ami-c9c7978c"
            "64": "ami-cfc7978a"
```
These values can be reffered using !FindInMap function: 
```yaml
!FindInMap [ MapName, TopLevelKey, SecondLevelKey ]
```

Now the resources *such as an EC2 instance* can use one of those values: 
```yaml
# assuming instance needs to be in us-east1
# assuming instance needs to be of 64 bit 
Resources: 
    MyEC2Instance: 
        Type: "AWS::EC2::Instance"
        Properties: 
            ImageId: !FindInMap [ RegionMap, us-east1, 32 ]
```

<h5>Now let's say you want to take this further and make it more dynamic. </h5>
Suppose you don't want to specify the region you're making the instance in and you want it to be automatically set to whichever region you are in: 

```yaml
Resources: 
    MyEC2Instance: 
        Type: "AWS::EC2::Instance"
        Properties: 
            ImageId: !FindInMap [ RegionMap, !Ref "AWS::Region", 32 ]
```

<h5>AWS::Region</h5> 

This is what is called a *Pseudo Parameter*. These are provided by AWS an be dynamically used inside any of your template. Some of the common examples are: 

1. AWS::AccountId
2. AWS::NoValue 
3. AWS::Region
4. AWS::StackId 
5. AWS::StackName 
<br />

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
<br />

<h2>Conditions</h2>

As the name suggests *conditions* are used to control the creation of the resources based on some parameters.

The common use cases of using the conditions are: 
1. Environment(dev/test/prod)
2. AWS Region
3. Any parameter value 

<h4>How to define a condition?</h4>

```yaml
Conditions: 
    # name of your condition (can be any)
    Logical ID:
        Intrinsic function
```
<h5>Intrinsic functions</h5>

- Fn::And
- Fn::Equals
- Fn::If
- Fn::Not
- Fn::Or
<br />

<h2>Cloudformation Init</h2>

Suppose you want the resources(EC2) to be self configured so that they can perform the jobs they are supposed to perform. In simple words, you want them to be preconfigured.
*This can be achieved from Clouformation Init*

<h3>EC2 User Data</h3>

This is a way to write a *startup script* or *bootstrapping* an instance with ```user custom scripts```. We can either pass in this script while manually provisioning this server or we can use this script inside our EC2 instance cloudformation template using the **function**:

```yaml
Fn::Base64
```
We can use this function and write a script like: 

```yaml
Resources: 
    MyInstance: 
        Properties: 
            ImageId: ami-a4c7edb2
            InstanceType: t2.micro 
            UserData: 
                Fn::Base64: |
                #!/bin/bash
                yum install something
                echo "and so on..."
```

<h3>EC2 User Data Disadvantages</h3>

- What if we want to have a very large startup template?
- What if we wat to evolve the state of the EC2 instance without terminating it or creating a new one? 
- How do we separate the user data from the cloudformation template? 
- How do we check the logs to see if the script ran successfully or not?
--- 

**All these can be solved using Cloudformation INIT instead of user-data**

https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-init.html

It has following sections: 

1. <h4>Packages</h4>

- You can install packages from the following repos: ```rpm, yum/apt, rubygems, python, msi```.
- Packages are are processed in the same order.
- You can specify any version [2.0] or the no version [] === latest.

```yaml
packages:
    rpm: 
        epel: "http://somelinktodownloadarepo.com"
    yum: 
        httpd: []
        docker: [3.1]
        wordpress: []
    python: 
        django: []
```

It is used by defining ```AWS::CloudFormation::Init```inside the resources template.

<h5>Example</h5>

```yaml
Resources: 
    MyEC2Instance: 
        Type: AWS::EC2::Instance 
        Metadata: 
            Comment: Install a simple php application 
            AWS::CloudFormation::Init: 
                config: 
                    packages: 
                        yum: 
                            httpd: []
                            php: []    
```

2. <h4>Groups and Users</h4>

- If you want to have multiple users and groups in your EC2 instance.

```yaml
groups: 
    # will have any gid
    groupOne: {}
    groupTwo: 
        gid: "45"
users: 
    myUser: 
        groups: 
            - groupOne
            - groupTwo
        uid: 50
        homeDir: "/tmp"
```

3. <h4>Sources</h4>

- We can download whole compressed archives from the web and unpack them on the instance directly.
- It's very handy if you have a set of standardized scripts for your instances that you store in s3 for example.
- Or you could simply download the whole github project on your instance.

<h3>NOTE:</h3> This only works with downloadable links (the ones which download directly/wget)

```yaml
sources: 
    /etc/puppet: "https://github.com/user1/cfn-demo/tarball/master"
    /etc/myapp: "https://s3.aws.com/bucket/myfile.tar.gz"
```

4. <h4>Files</h4>

You can use files to create files in the ec2 instance, modify it's content and even change it's permissions. 

```yaml
files: 
  /tmp/setup.mysql: 
    content: !Sub |
      CREATE DATABASE ${DBName};
      CREATE USER '${DBUsername}'@'localhost' IDENTIFIED BY '${DBPassword}';
      GRANT ALL ON ${DBName}.* TO '${DBUsername}'@'localhost';
      FLUSH PRIVILEGES;
    mode: "000644"
    owner: "root"
    group: "root"
```
5. <h4>Commands</h4>

You can use the commands key to execute commands on the EC2 instance. The commands are processed in alphabetical order by name.

```yaml
commands: 
  test: 
    command: "echo \"$MAGIC\" > test.txt"
    env: 
      MAGIC: "I come from the environment!"
    cwd: "~"
    test: "test ! -e ~/test.txt"
    ignoreErrors: "false"
  test2: 
    command: "echo \"$MAGIC2\" > test2.txt"
    env: 
      MAGIC2: "I come from the environment!"
    cwd: "~"
    test: "test ! -e ~/test2.txt"
    ignoreErrors: "false"
```

6. <h4>Services</h4>

- You can use this to launch the services at launch. 
- To define which services should be enabled or disabled when the instance is launched.

```yaml
services: 
  sysvinit: 
    nginx: 
      enabled: "true"
      ensureRunning: "true"
      files: 
        - "/etc/nginx/nginx.conf"
      sources: 
        - "/var/www/html"
    php-fastcgi: 
      enabled: "true"
      ensureRunning: "true"
      packages: 
        yum: 
          - "php"
          - "spawn-fcgi"
    sendmail: 
      enabled: "false"
      ensureRunning: "false"
```