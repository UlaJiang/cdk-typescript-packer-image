import * as cdk from '@aws-cdk/core';
import * as ec2 from "@aws-cdk/aws-ec2";

export class CdkSelfStudyStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Get the default VPC. This is the network where your instance will be provisioned
    const defaultVpc = ec2.Vpc.fromLookup(this, 'VPC', { isDefault: true })

    // Open port 22 for SSH connection from anywhere
    const mySecurityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
      vpc: defaultVpc,
      securityGroupName: "xing-sg",
      description: 'Allow ssh access to ec2 instances from anywhere',
      allowAllOutbound: true 
    });

    // lets use the security group to allow inbound traffic on port 22, 80, and 443
    mySecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(), 
      ec2.Port.tcp(22), 
      'Allows SSH access from Internet'
    )

    mySecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      'Allows HTTP access from Internet'
    )

    mySecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(443),
      'Allows HTTPS access from Internet'
    )

    // Accept input parameter from CLI to define the custom AMI id 
    const amiid = new cdk.CfnParameter(this, "amiid", {
      type: "String",
      description: "The AMI ID."
    });

    // Using the AMI baked by Paker
    const awsAMI = ec2.MachineImage.genericLinux({
      'ap-southeast-2': amiid.valueAsString
    });

    // Accept input parameter from CLI to define the name of SSH KeyName 
    const keyName = new cdk.CfnParameter(this, "keyName", {
      type: "String",
      description: "The key name of EC2."
    });

    // Instance details
    const ec2Instance = new ec2.Instance(this, 'Instance', {
      vpc: defaultVpc,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T2, 
        ec2.InstanceSize.MICRO),
      machineImage: awsAMI,
      securityGroup: mySecurityGroup,
      instanceName: 'xing-instance',
      keyName: keyName.valueAsString,
    });
  }
}
