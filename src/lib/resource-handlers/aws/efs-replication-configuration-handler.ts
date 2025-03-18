import { Region } from '@/types/cloud'
import {
    ResourceAttributes,
    ResourceHandler,
    generateArn,
    generateEcsServiceId,
    generateKmsKeyId
} from '../base-handler'

export class AWSEFSReplicationConfigurationHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const fsId = generateEcsServiceId()
    const kmsKeyId = generateKmsKeyId()
    const accountId = '123456789012' // Using a static account ID for consistency
    
    const attributes: ResourceAttributes = {
      source_file_system_id: fsId,
      destination: {
        availability_zone_name: `${region.code}b`,
        kms_key_id: generateArn('kms', region, accountId, 'key', kmsKeyId),
        region: region.code
      },
      depends_on: [
        `aws_efs_file_system.${fsId}`,
        `aws_kms_key.${kmsKeyId}`
      ]
    }

    return attributes
  }
} 