import { Region } from '@/types/cloud'
import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateArn,
    generateResourceId
} from '../base-handler'

export class AWSSageMakerNotebookHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const notebookId = generateResourceId('notebook')
    const sgId = generateResourceId('sg')
    const subnetId = generateResourceId('subnet')
    const kmsKeyId = generateResourceId('key')
    const roleId = generateResourceId('role')
    const accountId = '123456789012'
    
    const attributes: ResourceAttributes = {
      name: `${resourceName}-${notebookId}`,
      role_arn: generateArn('iam', region, accountId, 'role', `${resourceName}-notebook-${roleId}`),
      instance_type: 'ml.t3.medium',
      platform_identifier: 'notebook-al2-v2',
      volume_size: 50,
      subnet_id: subnetId,
      security_groups: [sgId],
      accelerator_types: [],
      additional_code_repositories: [],
      default_code_repository: null,
      direct_internet_access: false,
      instance_metadata_service_configuration: {
        minimum_instance_metadata_service_version: '2'
      },
      root_access: false,
      kms_key_id: generateArn('kms', region, accountId, 'key', kmsKeyId),
      lifecycle_config_name: `${resourceName}-${notebookId}-config`,
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_security_group.${sgId}`,
        `aws_subnet.${subnetId}`,
        `aws_kms_key.${kmsKeyId}`,
        `aws_iam_role.${roleId}`,
        `aws_sagemaker_notebook_instance_lifecycle_configuration.${notebookId}-config`
      ]
    }

    return attributes
  }
} 