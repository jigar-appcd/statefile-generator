import { Region } from '@/types/cloud'
import {
  ResourceAttributes,
  ResourceHandler,
  generateArn,
  generateBeanstalkRoleId
} from '../base-handler'

export class AWSECRPublicRepositoryPolicyHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const roleId = generateBeanstalkRoleId()
    const accountId = '123456789012' // Using a static account ID for consistency
    
    const attributes: ResourceAttributes = {
      repository_name: resourceName,
      policy: JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Sid: 'AllowPullAccess',
            Effect: 'Allow',
            Principal: {
              AWS: generateArn('iam', region, accountId, 'role', roleId)
            },
            Action: [
              'ecr-public:BatchGetImage',
              'ecr-public:GetDownloadUrlForLayer'
            ]
          }
        ]
      }),
      depends_on: [
        `aws_ecrpublic_repository.${resourceName}`,
        `aws_iam_role.${roleId}`
      ]
    }

    return attributes
  }
} 