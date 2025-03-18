import { Region } from '@/types/cloud'
import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateArn,
    generateResourceId
} from '../base-handler'

export class ECSClusterHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const kmsKeyId = generateResourceId('key')
    const logGroupId = generateResourceId('log')
    const accountId = '123456789012'
    
    const attributes: ResourceAttributes = {
      name: resourceName,
      setting: [
        {
          name: 'containerInsights',
          value: 'enabled'
        }
      ],
      configuration: {
        execute_command_configuration: {
          kms_key_id: generateArn('kms', region, accountId, 'key', kmsKeyId),
          logging: 'OVERRIDE',
          log_configuration: {
            cloud_watch_encryption_enabled: true,
            cloud_watch_log_group_name: `${resourceName}-${logGroupId}`
          }
        }
      },
      capacity_providers: [
        'FARGATE',
        'FARGATE_SPOT'
      ],
      default_capacity_provider_strategy: [
        {
          capacity_provider: 'FARGATE',
          weight: 1,
          base: 1
        },
        {
          capacity_provider: 'FARGATE_SPOT',
          weight: 4
        }
      ],
      service_connect_defaults: {
        namespace: resourceName
      },
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_kms_key.${kmsKeyId}`,
        `aws_cloudwatch_log_group.${logGroupId}`
      ]
    }

    return attributes
  }
} 