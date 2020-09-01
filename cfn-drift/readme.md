<h2>Cloudformation Drift<h2>

This helps us notify if the cloudformation stack resources has been changed/deleted manually by some other user.

#### Note: 
Not all the resources are supported in this feature.
 
<h4>Steps</h4>

1. Go to your running stacks in AWS Cloudformation.
2. Click on *settings* icon.
3. Enable *Drift status* and *Last drift check time*
4. Now choose the stack name >> *Actions* >> *Detect drift*

*Now if someone has changed / will change any of your resources manually, the status will show **drifted** next to the name of the stack in the stacks section.