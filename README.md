## Prerequisite:
To run the code, several things need to be setup:
* Make sure Packer and AWS CDK is properly installed on local PC.
* Have an aws credentials (access-key and secret-key). Recommended to store your aws credentials in default path: "~/.aws/credentials".
* Get your AWS account ID, and export it as an environment before you run cdk command.
* Have generated a ssh key-pair in AWS, so you can ssh to the EC2 after it being deployed

## Build image by Pakcer
The image based on **latest** RedHat image in ap-southeast-2 region with nginx and openjdk installed.

To build the image, please enter to packer folder first. Then run the following command:
###### 1. Build the golden image
  ```shell script
  packer build -var-file=variable.json rhel_latest.jsonV
  ```

## Deploy an EC2 instance by CDK with the baked golden image
###### 1. Creating a new Key Pair in the AWS Console
Before deploying our newly created instance, we need to go to the AWS console and create a key pair that we will use to access the instance.
  * Log into the AWS console, and go to EC2 dashboard, then go to Key Pairs and click create Key Pair
  * Enter key name (eg. rhel8) and click create. Your new key pair will be created and your browser will automatically download a new .pem file called "rhel8.pem"
  * change the necessary permissions of the key
      ```shell script
      chmod 400 rhel8.pem
      ```
###### 2. Export your account id as environment variable 
  ```shell script
  export ACCOUNT_ID='XXXXXXXXXXXX'
  ```
###### 3. To deploy an EC2 instance in AWS, please enter to cdk-self-study folder first. Then run the following command:
Since you get your baked image ami_id from the above step (eg.ami-09fb40ef519b75eab is the image I build with Pakcer, i also make is public already in region ap-southeast-2), and create a keypair (eg. rhel8.pem), please use them as the parameter input in following command:
  ```shell script
  cdk deploy --profile default --parameters amiid=ami-02247df2d3e4771c6 --parameters keyName=rhel8
  ```
###### 4. After the EC2 instance is delpyed, you can ssh to it and check if the ngnix and openjdk have been installed already.
  ```shell script
  ssh -i rhel8.pem ec2-user@<ec2-public-ip>
  ```

  ```shell script
  rpm -qa | grep nginx
  rpm -qa | grep openjdk
  ```