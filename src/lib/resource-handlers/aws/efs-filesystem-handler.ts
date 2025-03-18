import { Region } from '@/types/cloud'
import { generateResourceId } from '../../utils/id-generator'
import { ResourceAttributes, ResourceHandler } from '../base-handler'

export class AWSEFSFileSystemHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const fsId = generateResourceId()
    const kmsKeyId = generateResourceId()
    
    const attributes: ResourceAttributes = {
      creation_token: `efs-${fsId}`,
      encrypted: true,
      kms_key_id: `arn:aws:kms:${region.code}:123456789012:key/${kmsKeyId}`,
      performance_mode: 'generalPurpose',
      throughput_mode: 'bursting',
      lifecycle_policy: [
        {
          transition_to_ia: 'AFTER_30_DAYS'
        }
      ],
      backup_policy: {
        status: 'ENABLED'
      },
      tags: {
        environment: 'production'
      },
      depends_on: [
        `aws_kms_key.${kmsKeyId}`
      ]
    }

    return attributes
  }
} 