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
