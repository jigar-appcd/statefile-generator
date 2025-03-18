import { Region } from '@/types/cloud'
import {
  ResourceAttributes,
  ResourceHandler,
  generateArn,
  generateBeanstalkRoleId
} from '../base-handler'

export class AWSECRRegistryPolicyHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const roleId = generateBeanstalkRoleId()
    const accountId = '123456789012' // Using a static account ID for consistency
    
    const attributes: ResourceAttributes = {
      policy: JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Sid: 'AllowPull',
            Effect: 'Allow',
            Principal: {
              AWS: generateArn('iam', region, accountId, 'role', roleId)
            },
            Action: [
              'ecr:GetDownloadUrlForLayer',
              'ecr:BatchGetImage',
              'ecr:BatchCheckLayerAvailability'
            ],
            Resource: generateArn('ecr', region, accountId, 'repository', '*')
          }
        ]
      }),
      depends_on: [
        `aws_iam_role.${roleId}`
      ]
    }

    return attributes
  }
} 