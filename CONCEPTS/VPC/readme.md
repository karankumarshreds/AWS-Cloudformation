# VPC

### CIDR (Classless Inter Domain Routing)

CIDR helps to assign IP addresses to our AWS components running inside a particular VPC.

```x.x.x.x/16``` where ```16``` is the CIDR prefix which defines the number of available IP addresses that can be used in a VPC.

***Example***: 

```js
10.10.0.0/16  
```
Since it has 16, the Network IP would be ```10.10.0.0``` and the AWS components would get IPS ranging from  ```10.10.0.0``` to ```10.10.255.255``` which means **65536** available IPS.

```js
X.X.X.0/24   // 24/8 = 3 Network Bits 
X.X.0.0/16   // 16/8 = 2 Network Bits 
X.0.0.0/8    // 8/8  = 1 Network Bit  
```
<p align="center"><img width="600" src="https://github.com/karankumarshreds/AWS-Cloudformation/blob/master/img/cidr.PNG"/></p>

#### Available IP ranges : 

- 10.10.0.0
- 192.168.0.0
- 172.16.0.0
