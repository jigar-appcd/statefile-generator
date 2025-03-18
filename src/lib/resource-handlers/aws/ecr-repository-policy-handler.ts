import { Region } from '@/types/cloud'
import {
    ResourceAttributes,
    ResourceHandler,
    generateArn,
    generateBeanstalkRoleId,
    generateEcrRepoId
} from '../base-handler'

export class AWSECRRepositoryPolicyHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const repoId = generateEcrRepoId()
    const roleId = generateBeanstalkRoleId()
    const accountId = '123456789012' // Using a static account ID for consistency
    
    const attributes: ResourceAttributes = {
      repository: repoId,
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
            ]
          }
        ]
      }),
      depends_on: [
        `aws_ecr_repository.${repoId}`,
        `aws_iam_role.${roleId}`
      ]
    }

    return attributes
  }
} 