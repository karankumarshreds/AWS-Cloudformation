var response = require('cfn-response');
var AWS = require('aws-sdk');
exports.handler = function (event, context) {
  console.log("Request received:\n", JSON.stringify(event));
  var physicalId = event.PhysicalResourceId;
  function success(data) {
    return response.send(event, context, response.SUCCESS, data, physicalId);
  }
  function failed(e) {
    return response.send(event, context, response.FAILED, e, physicalId);
  }
  // Call ec2.waitFor, continuing if not finished before Lambda function timeout.
  function wait(waiter) {
    console.log("Waiting: ", JSON.stringify(waiter));
    event.waiter = waiter;
    event.PhysicalResourceId = physicalId;
    var request = ec2.waitFor(waiter.state, waiter.params);
    setTimeout(() => {
      request.abort();
      console.log("Timeout reached, continuing function. Params:\n", JSON.stringify(event));
      var lambda = new AWS.Lambda();
      lambda.invoke({
        FunctionName: context.invokedFunctionArn,
        InvocationType: 'Event',
        Payload: JSON.stringify(event)
      }).promise().then((data) => context.done()).catch((err) => context.fail(err));
    }, context.getRemainingTimeInMillis() - 5000);
    return request.promise().catch((err) =>
      (err.code == 'RequestAbortedError') ?
        new Promise(() => context.done()) :
        Promise.reject(err)
    );
  }
  var ec2 = new AWS.EC2(),
    instanceId = event.ResourceProperties.InstanceId;
  if (event.waiter) {
    wait(event.waiter).then((data) => success({})).catch((err) => failed(err));
  } else if (event.RequestType == 'Create' || event.RequestType == 'Update') {
    if (!instanceId) { failed('InstanceID required'); }
    ec2.waitFor('instanceStopped', { InstanceIds: [instanceId] }).promise()
      .then((data) =>
        ec2.createImage({
          InstanceId: instanceId,
          Name: event.RequestId
        }).promise()
      ).then((data) =>
        wait({
          state: 'imageAvailable',
          params: { ImageIds: [physicalId = data.ImageId] }
        })
      ).then((data) => success({})).catch((err) => failed(err));
  } else if (event.RequestType == 'Delete') {
    if (physicalId.indexOf('ami-') !== 0) { return success({}); }
    ec2.describeImages({ ImageIds: [physicalId] }).promise()
      .then((data) =>
        (data.Images.length == 0) ? success({}) :
          ec2.deregisterImage({ ImageId: physicalId }).promise()
      ).then((data) =>
        ec2.describeSnapshots({
          Filters: [{
            Name: 'description',
            Values: ["*" + physicalId + "*"]
          }]
        }).promise()
      ).then((data) =>
        (data.Snapshots.length === 0) ? success({}) :
          ec2.deleteSnapshot({ SnapshotId: data.Snapshots[0].SnapshotId }).promise()
      ).then((data) => success({})).catch((err) => failed(err));
  }
};