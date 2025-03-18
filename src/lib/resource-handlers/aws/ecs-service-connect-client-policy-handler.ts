import { Region } from '@/types/cloud'
import {
    ResourceAttributes,
    ResourceHandler,
    generateArn,
    generateBeanstalkRoleId
} from '../base-handler'

export class AWSECSServiceConnectClientPolicyHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const roleId = generateBeanstalkRoleId()
    const accountId = '123456789012' // Using a static account ID for consistency
    
    const attributes: ResourceAttributes = {
      role: generateArn('iam', region, accountId, 'role', roleId),
      policy: JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Action: [
              'servicediscovery:DiscoverInstances',
              'servicediscovery:GetNamespace',
              'servicediscovery:ListNamespaces'
            ],
            Resource: generateArn('servicediscovery', region, accountId, '*', '*')
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