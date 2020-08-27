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
            ImageId: !FindInMap [ RegionMap, us-east-1, 32 ]
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
