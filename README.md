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