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