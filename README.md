# Pocket Moloch aka Pokémol

Bare bones, mobile-first set up for Moloch frontend with Abridged Wallet SDK by Odyssy

## Development

1. Install dependencies

```bash
$ yarn install
```

2. Run a dev server

```bash
$ yarn start
```

### Linting

Set up auto-linting and prettier to be run on file save or in real-time in your IDE:
[VSCode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode).

## Deployment instructions

Assumes the moloch contracts are forked and deployed to mainnet and kovan if you need testnet support. You will also need an infura endpoint.

#### 1. Fork and deploy the subgraph(s)

https://github.com/MolochVentures/moloch-monorepo/tree/master/packages/subgraph

Update the contract address(es) and deploy:
https://thegraph.com/docs/deploy-a-subgraph

#### 2. Build the AWS resources

Use the serverless framework to get this started. You'll need to install the serveless cli:
https://serverless.com/framework/docs/getting-started/

Set up your AWS access keys, add them to your aws profile and assign the profile in this serverless.yaml
https://serverless.com/framework/docs/providers/aws/guide/credentials/

```yaml
provider:
  name: aws
  runtime: nodejs8.10
  stage: dev
  region: us-east-1
  profile: <your profile name>
```

This will build a CloudFormation stack with

- Cognito indentity pool and user pool
- s3 bucket for storing proposal and member metadata
- s3 bucket for hosting the build files and the CloudFront distribution for the front end hosting.

Update the service name in serveless.yml line 1

```yaml
service: <name of your app>
```

Build the resources:

```bash
staging/kovan:
$ serverless deploy

prod/mainnet
$ serverless deploy --stage prod
```

Manually add custom field to the Cognito user pool. in the AWS console navigate to cognito/users and select the new pool that was created. You can add fields in the Attibutes section.

All are type: string, min-length: 1, max-length: 256 and mutable

- device_address
- account_address
- ens_name
- encrypted_ks (max length 2000)
- named_devices (max length 2000)

#### 3. Update your .env file with the contract addresses, infura enpoint, subgraph endpoint(s) new AWS resource information. You can find all of the AWS resrouce information in the AWS console in the respective areas.

```
REACT_APP_SDK_ENV=
REACT_APP_GRAPH_NODE_URI=
REACT_APP_INFURA_URI=
REACT_APP_CONTRACT_ADDRESS=
REACT_APP_S3_REGION=
REACT_APP_S3_BUCKET=
REACT_APP_COGNITO_REGION=
REACT_APP_COGNITO_USER_POOL_ID=
REACT_APP_COGNITO_APP_CLIENT_ID=
REACT_APP_COGNITO_IDENTITY_POOL_ID=
```

#### 5. Build and deploy the app

Sync production build to S3 and invalidate the cloudfront cache.

```bash
build the app for dev/kovan:
$ yarn build

build the app for dev/kovan:
$ yarn prod-build

You could use the aws cli to do this if you want to:

$ aws s3 sync build/ s3://<your s3> --profile <your profile name>

invalidate cloudfront cache:
$ aws cloudfront create-invalidation --distribution-id <your distribution id> --paths /\* --profile <your profile name>
```

#### Custom domain set up

You will need to set up an ssl cert and point some cname records at the cloudfront distibution. Detailed instructions here:
https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-https-alternate-domain-names.html

1. Get a ssl cert from ACM. You'll have to verify domain ownership by adding a cname record where you're domain is managed.
   happe
2. Update your CloudFront distribution to use the new certificate once it is provisioned.

3. Create cname records to point the domain at the CloudFront url
