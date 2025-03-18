import { Region } from '@/types/cloud'
import {
    ResourceAttributes,
    ResourceHandler,
    generateArn,
    generateEcsServiceId
} from '../base-handler'

export class AWSEFSFileSystemPolicyHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const fsId = generateEcsServiceId()
    const accountId = '123456789012' // Using a static account ID for consistency
    
    const attributes: ResourceAttributes = {
      file_system_id: fsId,
      policy: JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Sid: 'AllowClientAccess',
            Effect: 'Allow',
            Principal: {
              AWS: '*'
            },
            Action: [
              'elasticfilesystem:ClientMount',
              'elasticfilesystem:ClientWrite'
            ],
            Resource: generateArn('elasticfilesystem', region, accountId, 'file-system', fsId),
            Condition: {
              Bool: {
                'aws:SecureTransport': 'true'
              }
            }
          }
        ]
      }),
      depends_on: [
        `aws_efs_file_system.${fsId}`
      ]
    }

    return attributes
  }
} 