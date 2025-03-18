import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateResourceId
} from '../base-handler'

export class AWSSageMakerModelHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const roleId = generateResourceId('role')
    const kmsKeyId = generateResourceId('key')
    const sgId = generateResourceId('sg')
    const subnetId1 = generateResourceId('subnet')
    const subnetId2 = generateResourceId('subnet')
    const accountId = '123456789012'
    
    const attributes: ResourceAttributes = {
      name: resourceName,
      execution_role_arn: `arn:aws:iam::${accountId}:role/${resourceName}-${roleId}`,
      enable_network_isolation: true,
      vpc_config: {
        security_group_ids: [sgId],
        subnets: [
          subnetId1,
          subnetId2
        ]
      },
      primary_container: {
        image: `${accountId}.dkr.ecr.us-west-2.amazonaws.com/${resourceName}:latest`,
        model_data_url: `s3://${resourceName}-models/${resourceName}/model.tar.gz`,
        environment: {
          SAGEMAKER_PROGRAM: 'inference.py',
          SAGEMAKER_SUBMIT_DIRECTORY: '/opt/ml/model/code',
          SAGEMAKER_CONTAINER_LOG_LEVEL: '20',
          SAGEMAKER_REGION: 'us-west-2'
        }
      },
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_iam_role.${roleId}`,
        `aws_kms_key.${kmsKeyId}`,
        `aws_security_group.${sgId}`,
        `aws_subnet.${subnetId1}`,
        `aws_subnet.${subnetId2}`
      ]
    }

    return attributes
  }
} 