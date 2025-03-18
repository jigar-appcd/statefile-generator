import { Region } from '@/types/cloud'
import {
  ResourceAttributes,
  ResourceHandler,
  commonTags,
  generateArn,
  generateKmsKeyId
} from '../base-handler'

export class AWSEFSFileSystemHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const kmsKeyId = generateKmsKeyId()
    const accountId = '123456789012' // Using a static account ID for consistency
    
    const attributes: ResourceAttributes = {
      creation_token: resourceName,
      encrypted: true,
      kms_key_id: generateArn('kms', region, accountId, 'key', kmsKeyId),
      performance_mode: 'generalPurpose',
      throughput_mode: 'bursting',
      provisioned_throughput_in_mibps: 0,
      lifecycle_policy: [
        {
          transition_to_ia: 'AFTER_30_DAYS',
          transition_to_primary_storage_class: 'AFTER_1_ACCESS'
        }
      ],
      availability_zone_name: `${region.code}a`,
      backup_policy: {
        status: 'ENABLED'
      },
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_kms_key.${kmsKeyId}`
      ]
    }

    return attributes
  }
} 