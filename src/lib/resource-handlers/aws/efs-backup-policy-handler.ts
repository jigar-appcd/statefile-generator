import { Region } from '@/types/cloud'
import {
    ResourceAttributes,
    ResourceHandler,
    generateEcsServiceId
} from '../base-handler'

export class AWSEFSBackupPolicyHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const fsId = generateEcsServiceId()
    
    const attributes: ResourceAttributes = {
      file_system_id: fsId,
      backup_policy: {
        status: 'ENABLED'
      },
      depends_on: [
        `aws_efs_file_system.${fsId}`
      ]
    }

    return attributes
  }
} 